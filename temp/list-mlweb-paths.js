const fs=require('fs');
const text=fs.readFileSync('temp/mlweb-index.js','utf8');
function extract(regex){const out=[];let m;while((m=regex.exec(text))) out.push(m[1]);return out;}
const strings=new Set([...extract(/"([^"\\]{1,200})"/g),...extract(/'([^'\\]{1,200})'/g)]);
const arr=[...strings].filter(s=>s.startsWith('/') && s.length<=80);
arr.sort();
console.log('count',arr.length);
console.log(arr.join('\n'));
