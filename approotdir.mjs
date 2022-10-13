import * as path from 'path';
import * as url from 'url';
const _filename = url.fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
export const approotdir = _dirname;
