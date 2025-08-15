// skills/dec2bin.js
import { padBits, groupBits, shuffle } from '../utils.js';
import { generateDistractors } from '../distractors.js';

export const dec2bin = {
  key: 'dec2bin',
  name: 'Decimal → Binary',
  generate(mode){
    const n = Math.floor(Math.random() * (mode.rangeMax + 1));
    const correct = padBits(n, mode.displayBits);
    const answers = shuffle([correct, ...generateDistractors(correct, mode.displayBits, mode.rangeMax)]);
    return {
      prompt: String(n),
      sublabel: null,
      answers,
      correct,
      formatAnswer: groupBits,
      kind: 'bits',
    };
  }
};
