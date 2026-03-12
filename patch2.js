const fs = require('fs');

let mainPath = 'temp_logisim/src/javascript/main.js';
let main = fs.readFileSync(mainPath, 'utf8');

main = main.replace(
    'window.location.pathname.replace(/\\/index\\.html$/, \'\').replace(/\\/$/, \'\') + "/logisim.jar")',
    'window.location.pathname.replace(/\\/index\\.html$/, \'\').replace(/\\/$/, \'\') + "/logisim.jar", "-nosplash")'
);

fs.writeFileSync(mainPath, main);

let patchPath = 'patch.js';
let patch = fs.readFileSync(patchPath, 'utf8');
patch = patch.replace(
    'cheerpjRunJar("/app" + window.location.pathname.replace(/\\/index\\.html$/, \'\').replace(/\\/$/, \'\') + "/logisim.jar")',
    'cheerpjRunJar("/app" + window.location.pathname.replace(/\\/index\\.html$/, \'\').replace(/\\/$/, \'\') + "/logisim.jar", "-nosplash")'
);
fs.writeFileSync(patchPath, patch);

console.log('Added -nosplash to cheerpjRunJar successfully');
