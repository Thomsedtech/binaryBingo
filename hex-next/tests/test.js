import { padBits, groupBits } from '../js/utils.js';
import { generateDistractors } from '../js/distractors.js';
import { modes } from '../js/modes.js';
import { hex2bin } from '../js/skills/hex2bin.js';

const out = document.getElementById('out');
const log = (ok, msg)=>{
  const div=document.createElement('div');
  div.className = ok ? 'ok' : 'bad';
  div.textContent = (ok?'✓ ':'✗ ') + msg;
  out.appendChild(div);
};

try {
  out.textContent = '';

  // padBits
  let ok = padBits(10,8)==='00001010'; log(ok, 'padBits 8-bit');
  ok = padBits(15,4)==='1111'; log(ok, 'padBits 4-bit');

  // groupBits
  ok = groupBits('00001010')==='0000 1010'; log(ok, 'groupBits');

  // distractors
  const corr = '00001010';
  const d = generateDistractors(corr, 8, 0x3F);
  ok = d.length===3 && !d.includes(corr) && d.every(x=>x.length===8); log(ok, 'distractors basic');

  // mode sanity
  ok = modes.intermediate.displayBits===8 && modes.intermediate.rangeMax===0x3F; log(ok, 'modes intermediate');

  // skill generator
  const q = hex2bin.generate(modes.beginner);
  ok = q.answers.length===4 && typeof q.prompt==='string'; log(ok, 'hex2bin.generate shape');

  if([...out.querySelectorAll('.bad')].length===0){
    const done=document.createElement('div'); done.className='ok'; done.textContent='All tests passed ✓';
    out.appendChild(done);
  }
} catch(e){
  log(false, 'Exception: ' + e.message);
}
