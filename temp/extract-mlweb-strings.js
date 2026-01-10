const fs = require('fs');
const text = fs.readFileSync('temp/mlweb-index.js', 'utf8');
// crude extraction of quoted strings
const re = /"([^"\\]{1,200})"/g;
const set = new Set();
let m;
while ((m = re.exec(text))) {
  const s = m[1];
  if (s.includes('/') && (s.startsWith('/') || s.includes('api') || s.includes('profile') || s.includes('player')))
    set.add(s);
}
const arr = [...set];
const interesting = arr.filter(s => /profile|player|role|zone|userId|battle|rank/i.test(s));
interesting.sort((a,b)=>a.localeCompare(b));
console.log('strings total', arr.length, 'interesting', interesting.length);
console.log(interesting.slice(0,200).join('\n'));
