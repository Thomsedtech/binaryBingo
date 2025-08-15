// /js/skills/bin2dec.js
import { padBits } from '../utils.js';

export const bin2dec = {
  key: 'bin2dec',
  name: 'Binary → Decimal',
  generate(mode) {
    const n = Math.floor(Math.random() * (mode.rangeMax + 1));
    const correct = String(n);
    const promptBits = padBits(n, mode.displayBits);
    // simple numeric distractors near n
    const near = new Set([n]);
    while (near.size < 4) {
      near.add(Math.max(0, Math.min(mode.rangeMax, n + (Math.floor(Math.random()*9)-4))));
    }
    const answers = [...near].map(x => String(x));
    return {
      prompt: promptBits.replace(/(.{4})/g, '$1 ').trim(),
      sublabel: null,
      answers,              // decimal strings
      correct,
      formatAnswer: (s)=>s, // UI prints as-is
    };
  }
};

