// /js/main.js
import { createEngine } from './engine.js';
import * as modes from './modes.js';
import { hex2bin } from './skills/hex2bin.js';
import { dec2bin } from './skills/dec2bin.js';
import { bin2dec } from './skills/bin2dec.js';
import * as ui from './ui.js';
import * as audio from './audio.js';

const engine = createEngine({ skills:{hex2bin, dec2bin, bin2dec}, modes, ui, audio });
ui.bindControls({ onStart: ()=>engine.nextQuestion(), onMode:(k)=>engine.setMode(k), onSkill:(k)=>engine.setSkill(k) });
ui.renderPreview(engine.state);   // same as your current preview()

