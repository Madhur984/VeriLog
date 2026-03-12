const fs = require('fs');

let index = fs.readFileSync('temp_logisim/index.html', 'utf8');
index = index.replace(/\/images\//g, './images/');
index = index.replace(/\/examples\//g, './examples/');
fs.writeFileSync('temp_logisim/index.html', index);

let main = fs.readFileSync('temp_logisim/src/javascript/main.js', 'utf8');
main = main.replace('cheerpjRunJar("/app/logisim.jar")', 'cheerpjRunJar("/app" + window.location.pathname.replace(/\\/index\\.html$/, \'\').replace(/\\/$/, \'\') + "/logisim.jar")');
fs.writeFileSync('temp_logisim/src/javascript/main.js', main);

console.log('Patched index.html and main.js successfully');
