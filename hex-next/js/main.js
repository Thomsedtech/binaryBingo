// main.js
import { createEngine } from './engine.js';
import { modes } from './modes.js';
import { hex2bin } from './skills/hex2bin.js';
import { dec2bin } from './skills/dec2bin.js';
import { bin2dec } from './skills/bin2dec.js';
import * as ui from './ui.js';
import { sfx, initAudio, setSoundEnabled } from './audio.js';

const skills = { hex2bin, dec2bin, bin2dec };
const engine = createEngine({ skills, modes, sfx });

// Wire up UI
ui.init(engine, { skills });

// Expose for quick debugging in console
window.__engine = engine;
