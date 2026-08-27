import { invoke } from '@tauri-apps/api/core';

export const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export type ShellKind = 'powershell' | 'cmd';

export interface CommandResult {
  code: number;
  stdout: string;
  stderr: string;
}

export interface GrokStatus {
  installed: boolean;
  path?: string | null;
  version?: string | null;
}

export async function runNativeCommand(command: string, cwd?: string, shell: ShellKind = 'powershell') {
  return invoke<CommandResult>('run_command', { command, cwd: cwd || null, shell });
}

export async function nativeGit(args: string[], cwd: string) {
  return invoke<CommandResult>('git_command', { args, cwd });
}

export async function listDirectory(path: string) {
  return invoke<Array<{ name: string; path: string; isDir: boolean; size: number | null }>>('read_dir', { path });
}

export async function readTextFile(path: string) {
  return invoke<string>('read_text_file', { path });
}

export async function writeTextFile(path: string, content: string) {
  return invoke<void>('write_text_file', { path, content });
}

export async function detectGrok() {
  return invoke<GrokStatus>('grok_detect');
}

export async function openExternal(url: string) {
  return invoke<void>('open_external', { url });
}

export async function memoryList(scope?: string) {
  return invoke<Array<{ id: number; scope: string; key: string; value: string; pinned: boolean; updated_at: string }>>('memory_list', { scope: scope || null });
}

export async function memoryUpsert(scope: string, key: string, value: string, pinned = false) {
  return invoke<number>('memory_upsert', { scope, key, value, pinned });
}

export async function memoryDelete(id: number) {
  return invoke<void>('memory_delete', { id });
}
