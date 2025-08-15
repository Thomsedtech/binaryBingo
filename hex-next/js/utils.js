// utils.js
export const padBits = (n, bits) => n.toString(2).padStart(bits, '0');
export const hexLabelFixed = (n, hexDigits) => '0x' + n.toString(16).toUpperCase().padStart(hexDigits, '0');
export const groupBits = (s) => s.replace(/(.{4})/g, '$1 ').trim();

export const clamp = (v, lo, hi)=> Math.max(lo, Math.min(hi, v));
export const randomInt = (min, max)=> Math.floor(Math.random()*(max-min+1))+min;

export function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

export function hamming(a,b){ let d=0; for(let i=0;i<a.length;i++){ if(a[i]!==b[i]) d++; } return d; }

export function pickDistinct(arr, count, notIncluding){
  const set = new Set([notIncluding]);
  const out = [];
  let guard=0;
  while(out.length<count && guard<200){
    guard++;
    const item = arr[randomInt(0, arr.length-1)];
    if(!set.has(item)){ set.add(item); out.push(item); }
  }
  return out;
}
