// /js/skills/hex2bin.js
import { padBits, groupBits } from '../utils.js';
import { generateDistractors } from '../distractors.js';

export const hex2bin = {
  key: 'hex2bin',
  name: 'Hex → Binary',
  generate(mode) {
    // mode: {rangeMax, displayBits, hexDigits}
    const n = Math.floor(Math.random() * (mode.rangeMax + 1));
    const correct = padBits(n, mode.displayBits);
    const answers = shuffle([correct, ...generateDistractors(
      correct, mode.displayBits, mode.rangeMax
    )]);
    return {
      prompt: `0x${n.toString(16).toUpperCase().padStart(mode.hexDigits, '0')}`,
      sublabel: `(decimal ${n})`,
      answers,                     // strings of bits
      correct,
      formatAnswer: groupBits,     // how UI prints each answer
    };
  }
};

