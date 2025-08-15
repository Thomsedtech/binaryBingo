// audio.js
let audioCtx = null;
let soundOn = true;

export function setSoundEnabled(on){ soundOn = !!on; }
export function getSoundEnabled(){ return soundOn; }

export function initAudio(){
  if(audioCtx || !soundOn) return;
  try { audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }
  catch(e){ console.warn('Audio init failed', e); }
}

function note(freq=440, dur=0.12, type='sine', vol=0.2){
  if(!audioCtx || !soundOn) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator(); osc.type = type; osc.frequency.setValueAtTime(freq, t0);
  const gain = audioCtx.createGain();
  const envA=0.005, envD=dur*0.4, sus=0.6, rel=dur*0.4;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0+envA);
  gain.gain.linearRampToValueAtTime(vol*sus, t0+envA+envD);
  gain.gain.setTargetAtTime(0, t0+envA+envD+rel, 0.05);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.25);
}

function seq(arr, gap=0.04){
  if(!audioCtx || !soundOn) return;
  let delay=0;
  for(const [f,d,t,v] of arr){
    setTimeout(()=> note(f,d,t,v), delay*1000);
    delay += (d+gap);
  }
}

export const sfx = {
  start: ()=> seq([[440,0.08,'sine',0.15],[660,0.08,'sine',0.15]]),
  correct: ()=> seq([[660,0.07,'triangle',0.18],[880,0.07,'triangle',0.18],[1320,0.09,'triangle',0.18]]),
  wrong: ()=> seq([[300,0.11,'sawtooth',0.12],[180,0.12,'sawtooth',0.12]]),
  timeout: ()=> seq([[240,0.12,'sine',0.12],[160,0.14,'sine',0.12]]),
  life: ()=> seq([[110,0.18,'sine',0.2],[90,0.16,'sine',0.18]]),
  streak: ()=> seq([[1200,0.05,'square',0.12],[1500,0.08,'square',0.12]]),
  gameover: ()=> seq([[392,0.12,'triangle',0.16],[330,0.14,'triangle',0.16],[262,0.16,'triangle',0.16]]),
};
