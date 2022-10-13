import { fileURLToPath  } from "url";
import { dirname } from "path";

console.log( `import.meta.url : ${import.meta.url}` );

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

console.log(`dirname: ${_dirname}`);
console.log(`filename: ${_filename}`);