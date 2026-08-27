import type { PermissionLevel } from '../types';

const PERMISSION_KEY = 'codemorf.permissionLevel';
const WORKSPACE_KEY = 'codemorf.lastWorkspace';

export function getPermissionLevel(fallback: PermissionLevel = 'ask_confirmation'): PermissionLevel {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(PERMISSION_KEY) as PermissionLevel | null;
  return value === 'read_only' || value === 'ask_confirmation' || value === 'full_access' ? value : fallback;
}

export function setPermissionLevel(level: PermissionLevel) {
  if (typeof window !== 'undefined') window.localStorage.setItem(PERMISSION_KEY, level);
}

export function getLastWorkspace(fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(WORKSPACE_KEY) || fallback;
}

export function setLastWorkspace(path: string) {
  if (typeof window !== 'undefined' && path) window.localStorage.setItem(WORKSPACE_KEY, path);
}
