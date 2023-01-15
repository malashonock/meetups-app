import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
export const ROOT_DIR = path.dirname(__filename);
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

export const PORT = 8080;
export const ORIGIN = `http://localhost:${PORT}`;