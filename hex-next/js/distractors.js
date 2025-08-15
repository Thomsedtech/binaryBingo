// distractors.js
import { padBits, hamming, pickDistinct } from './utils.js';

export function generateDistractors(correct, displayBits, rangeMax){
  const pool = Array.from({length: rangeMax+1}, (_,i)=> padBits(i, displayBits));
  const candidates = [];
  for(let i=0;i<=rangeMax;i++){
    const s = pool[i];
    if(s===correct) continue;
    const h = hamming(s, correct);
    if(h<=2) candidates.push(s);
  }
  const d1 = pickDistinct(candidates, 2, correct);
  const d2 = pickDistinct(pool, 4 - d1.length, correct);
  return [...d1, ...d2].slice(0,3);
}
