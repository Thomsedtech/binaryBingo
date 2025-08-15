// skills/bin2dec.js
import { padBits, shuffle } from '../utils.js';

export const bin2dec = {
  key: 'bin2dec',
  name: 'Binary → Decimal',
  generate(mode){
    const n = Math.floor(Math.random() * (mode.rangeMax + 1));
    const correct = String(n);
    const promptBits = padBits(n, mode.displayBits).replace(/(.{4})/g, '$1 ').trim();
    const near = new Set([n]);
    while (near.size < 4) {
      near.add(Math.max(0, Math.min(mode.rangeMax, n + (Math.floor(Math.random()*9)-4))));
    }
    const answers = shuffle([...near].map(x => String(x)));
    return {
      prompt: promptBits,
      sublabel: null,
      answers,
      correct,
      formatAnswer: (s)=>s,
      kind: 'dec',
    };
  }
};
