import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export type AcpEnvelope = Record<string, any>;
type Pending = { resolve: (value: any) => void; reject: (reason?: any) => void };

export class GrokAcpClient {
  readonly runtimeId: string;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private unlisten?: UnlistenFn;
  private unlistenErr?: UnlistenFn;
  private updateListeners = new Set<(message: AcpEnvelope) => void>();
  sessionId?: string;
  cwd?: string;

  constructor(runtimeId = `runtime-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`) {
    this.runtimeId = runtimeId.replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  private bindEvents = async () => {
    this.unlisten = await listen<string>(`grok://message/${this.runtimeId}`, event => this.handleLine(event.payload));
    this.unlistenErr = await listen<string>(`grok://stderr/${this.runtimeId}`, event => {
      this.updateListeners.forEach(listener => listener({ method: 'codemorf/stderr', params: { text: event.payload } }));
    });
  };

  private handleLine(line: string) {
    try {
      const message = JSON.parse(line) as AcpEnvelope;
      if (typeof message?.id === 'number' && this.pending.has(message.id) && !message.method) {
        const item = this.pending.get(message.id)!;
        this.pending.delete(message.id);
        message.error ? item.reject(message.error) : item.resolve(message.result);
        return;
      }
      this.updateListeners.forEach(listener => listener(message));
    } catch {}
  }

  async start(cwd: string, alwaysApprove = true) {
    await this.stop().catch(() => undefined);
    this.cwd = cwd;
    await this.bindEvents();
    await invoke('grok_start', { runtimeId: this.runtimeId, cwd, alwaysApprove });
    await this.request('initialize', { protocolVersion: 1, clientCapabilities: {} });
    const session = await this.request('session/new', { cwd, mcpServers: [], _meta: { yoloMode: alwaysApprove } });
    this.sessionId = session?.sessionId;
    if (!this.sessionId) throw new Error('Grok ACP no devolvió sessionId');
    return this;
  }

  async load(cwd: string, sessionId: string, alwaysApprove = true) {
    await this.stop().catch(() => undefined);
    this.cwd = cwd;
    await this.bindEvents();
    await invoke('grok_start', { runtimeId: this.runtimeId, cwd, alwaysApprove });
    await this.request('initialize', { protocolVersion: 1, clientCapabilities: {} });
    await this.request('session/load', { sessionId, cwd, mcpServers: [], _meta: { yoloMode: alwaysApprove } });
    this.sessionId = sessionId;
    return this;
  }

  onUpdate(listener: (message: AcpEnvelope) => void) {
    this.updateListeners.add(listener);
    return () => this.updateListeners.delete(listener);
  }

  request(method: string, params: unknown) {
    const id = this.nextId++;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    return new Promise<any>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      invoke('grok_send', { runtimeId: this.runtimeId, payload }).catch(error => {
        this.pending.delete(id);
        reject(error);
      });
    });
  }

  async prompt(text: string) {
    if (!this.sessionId) throw new Error('Grok ACP session is not initialized');
    return this.request('session/prompt', { sessionId: this.sessionId, prompt: [{ type: 'text', text }] });
  }

  async cancel() {
    if (!this.sessionId) return;
    const payload = JSON.stringify({ jsonrpc: '2.0', method: 'session/cancel', params: { sessionId: this.sessionId } });
    await invoke('grok_send', { runtimeId: this.runtimeId, payload }).catch(() => undefined);
  }

  async stop() {
    this.pending.forEach(p => p.reject(new Error('Grok runtime stopped')));
    this.pending.clear();
    await invoke('grok_stop', { runtimeId: this.runtimeId }).catch(() => undefined);
    this.unlisten?.(); this.unlistenErr?.();
    this.unlisten = undefined; this.unlistenErr = undefined;
    this.sessionId = undefined; this.cwd = undefined;
  }
}
