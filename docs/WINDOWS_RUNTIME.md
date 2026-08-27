# CodeMorf CLI — Windows Runtime

## Architecture

CodeMorf Desktop uses Tauri 2 + React. Native operations run in the Rust backend, never directly in the WebView.

```text
React UI
  -> Tauri invoke/events
Rust runtime
  -> PowerShell / CMD
  -> Git
  -> local filesystem
  -> SQLite memory
  -> Grok Build CLI (`grok agent stdio`)
```

## Grok Build

CodeMorf does not bundle or impersonate the xAI binary. Install the official Grok Build CLI on Windows and authenticate it once:

```powershell
irm https://x.ai/cli/install.ps1 | iex
grok login
grok --version
```

CodeMorf resolves `grok` from PATH and also checks `%USERPROFILE%\.grok\bin\grok.exe`. For development/testing you may set `CODEMORF_GROK_CLI` to an explicit executable path.

The integration starts:

```text
grok agent stdio
```

and transports ACP JSON-RPC messages through Tauri events. `--always-approve` is opt-in only.

## Local memory

Persistent memory is stored under the Windows application data directory in `codemorf-memory.sqlite3`. The Rust backend owns the database and exposes list/upsert/delete commands.

## Real terminal

`run_command` executes PowerShell by default and optionally CMD. The UI should always pass the active workspace as `cwd`. Commands execute with the permissions of the logged-in Windows user; CodeMorf does not request administrator elevation automatically.

## Git / GitHub

`git_command` uses the user's installed Git for Windows and existing credential manager. GitHub authentication remains under the user's Git/GitHub credential configuration.

## Builds

```powershell
npm ci
npm run lint
npm run build
npm run desktop:dev
npm run desktop:build
```

`desktop:build` produces MSI and NSIS bundles under `src-tauri/target/release/bundle/`.

## Safety

- Grok always-approve is disabled by default.
- No remote installer is executed automatically.
- No API key is committed to the repository.
- Native filesystem and shell actions stay in the Rust process boundary.
