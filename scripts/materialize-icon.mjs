import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const source = path.join(root, 'src-tauri', 'icons', 'icon.base64');
const target = path.join(root, 'src-tauri', 'icons', 'icon.ico');

const encoded = fs.readFileSync(source, 'utf8').trim();
const bytes = Buffer.from(encoded, 'base64');

if (bytes.length < 32 || bytes[0] !== 0 || bytes[1] !== 0 || bytes[2] !== 1 || bytes[3] !== 0) {
  throw new Error('Invalid ICO payload in src-tauri/icons/icon.base64');
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, bytes);
console.log(`Materialized Windows icon: ${target} (${bytes.length} bytes)`);
