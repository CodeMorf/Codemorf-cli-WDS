import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export type AcpEnvelope = Record<string, unknown>;

type Pending = { resolve: (value: any) => void; reject: (reason?: any) => void };

export class GrokAcpClient {
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private unlisten?: UnlistenFn;
  private updateListeners = new Set<(message: any) => void>();
  sessionId?: string;

  async start(cwd: string, alwaysApprove = false) {
    this.unlisten = await listen<string>('grok://message', (event) => {
      try {
        const message = JSON.parse(event.payload);
        if (typeof message?.id === 'number' && this.pending.has(message.id)) {
          const item = this.pending.get(message.id)!;
          this.pending.delete(message.id);
          if (message.error) item.reject(message.error);
          else item.resolve(message.result);
          return;
        }
        this.updateListeners.forEach((listener) => listener(message));
      } catch {
        // Ignore non-JSON diagnostic lines. Rust forwards stderr separately.
      }
    });

    await invoke('grok_start', { cwd, alwaysApprove });
    await this.request('initialize', {
      protocolVersion: 1,
      clientCapabilities: {
        fs: { readTextFile: true, writeTextFile: true },
        terminal: true,
      },
    });

    const session = await this.request('session/new', {
      cwd,
      mcpServers: [],
      _meta: { yoloMode: alwaysApprove },
    });
    this.sessionId = session?.sessionId;
    return this;
  }

  onUpdate(listener: (message: any) => void) {
    this.updateListeners.add(listener);
    return () => this.updateListeners.delete(listener);
  }

  request(method: string, params: unknown) {
    const id = this.nextId++;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    return new Promise<any>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      invoke('grok_send', { payload }).catch((error) => {
        this.pending.delete(id);
        reject(error);
      });
    });
  }

  async prompt(text: string) {
    if (!this.sessionId) throw new Error('Grok ACP session is not initialized');
    return this.request('session/prompt', {
      sessionId: this.sessionId,
      prompt: [{ type: 'text', text }],
    });
  }

  async stop() {
    await invoke('grok_stop');
    this.unlisten?.();
    this.unlisten = undefined;
    this.sessionId = undefined;
  }
}
