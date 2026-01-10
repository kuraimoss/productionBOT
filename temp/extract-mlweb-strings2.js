const fs = require('fs');
const text = fs.readFileSync('temp/mlweb-index.js', 'utf8');

function extractQuoted(regex) {
  const out = [];
  let m;
  while ((m = regex.exec(text))) {
    out.push(m[1]);
  }
  return out;
}

const strings = new Set([
  ...extractQuoted(/"([^"\\]{1,200})"/g),
  ...extractQuoted(/'([^'\\]{1,200})'/g),
]);

const arr = [...strings].filter(s => s.includes('/') && s.length <= 120);
const interesting = arr.filter(s => /profile|player|role|zone|userid|battle|rank|detail|info/i.test(s));
interesting.sort((a,b)=>a.localeCompare(b));
console.log('strings', strings.size, 'slash', arr.length, 'interesting', interesting.length);
console.log(interesting.slice(0,250).join('\n'));
