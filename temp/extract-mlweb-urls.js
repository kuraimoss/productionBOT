const fs = require('fs');
const text = fs.readFileSync('temp/mlweb-index.js','utf8');
const re = /https?:\/\/[^"'\s)]+/g;
const urls = new Set();
let m;
while((m=re.exec(text))){
  urls.add(m[0]);
}
const arr=[...urls];
arr.sort();
const filtered=arr.filter(u=>u.includes('moonton')||u.includes('youngjoy')||u.includes('mobilelegends')||u.includes('gms'));
console.log('total urls',arr.length,'filtered',filtered.length);
console.log(filtered.slice(0,200).join('\n'));
