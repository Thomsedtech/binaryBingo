// ui.js
import { groupBits, clamp } from './utils.js';
import { initAudio, setSoundEnabled } from './audio.js';

let engine;
const el = {};

export function init(_engine, { skills }){
  engine = _engine;
  // Bind DOM
  el.game = document.getElementById('game');
  el.answers = document.getElementById('answers');
  el.promptLabel = document.getElementById('promptLabel');
  el.subLabel = document.getElementById('subLabel');
  el.score = document.getElementById('scoreHUD');
  el.streak = document.getElementById('streakHUD');
  el.livesNum = document.getElementById('livesNumHUD');
  el.timerBar = document.getElementById('timerBar');
  el.livesOverlay = document.getElementById('livesOverlay');
  el.canvas = document.getElementById('fxCanvas');
  el.skill = document.getElementById('skill');
  el.mode = document.getElementById('mode');
  el.speed = document.getElementById('speed');
  el.soundOn = document.getElementById('soundOn');
  el.startBtn = document.getElementById('startBtn');
  el.resetBtn = document.getElementById('resetBtn');

  // Populate skills if needed (already in HTML, but keep in sync)
  const known = new Set([...el.skill.options].map(o=>o.value));
  for(const key of Object.keys(skills)){
    if(!known.has(key)){
      const opt = document.createElement('option'); opt.value=key; opt.textContent = skills[key].name;
      el.skill.appendChild(opt);
    }
  }

  // Events
  const onStart = ()=> { initAudio(); engine.startGame(); };
  const onReset = ()=> engine.resetGame();

  el.startBtn.addEventListener('click', onStart);
  el.startBtn.addEventListener('pointerdown', onStart);
  el.resetBtn.addEventListener('click', onReset);
  el.resetBtn.addEventListener('pointerdown', onReset);

  document.getElementById('toolbar').addEventListener('click', (e)=>{
    const t = e.target.closest('button');
    if(!t) return;
    if(t.id==='startBtn') onStart();
    if(t.id==='resetBtn') onReset();
  });

  el.mode.addEventListener('change', ()=> engine.setMode(el.mode.value));
  el.speed.addEventListener('change', ()=> engine.setSpeed(el.speed.value));
  el.skill.addEventListener('change', ()=> engine.setSkill(el.skill.value));
  el.soundOn.addEventListener('change', ()=> setSoundEnabled(el.soundOn.checked));

  document.addEventListener('keydown', (e)=>{
    if(['1','2','3','4'].includes(e.key)){
      const idx = parseInt(e.key,10)-1; engine.choose(idx);
    } else if(e.key==='r' || e.key==='R'){ engine.resetGame(); }
  });

  // Canvas background
  setupCanvas();

  // Initial preview
  engine.preview();
}

export function renderQuestion(state, q){
  el.promptLabel.textContent = q.prompt;
  if(q.sublabel){ el.subLabel.textContent = q.sublabel; el.subLabel.style.display = 'block'; }
  else { el.subLabel.style.display = 'none'; }
  el.answers.innerHTML='';
  q.answers.forEach((ans, i)=>{
    const b=document.createElement('button');
    b.className='ans';
    b.textContent = q.formatAnswer ? q.formatAnswer(ans) : ans;
    b.setAttribute('data-i', i);
    b.title = `Press ${i+1}`;
    b.addEventListener('click', ()=> engine.choose(i));
    el.answers.appendChild(b);
  });
  el.timerBar.style.transform = 'scaleX(1)';
}

export function lockAnswers(){
  const buttons = [...document.querySelectorAll('.ans')];
  buttons.forEach(b=> b.disabled = true);
}

export function markAnswers(state, index, ok){
  const buttons = [...document.querySelectorAll('.ans')];
  buttons[index].classList.add(ok? 'correct':'wrong');
  const correctIndex = state.q.answers.indexOf(state.q.correct);
  if(correctIndex!==index){ buttons[correctIndex].classList.add('correct'); }
}

export function renderHUD(state){
  el.score.textContent = state.score;
  el.streak.textContent = state.streak;
  el.livesNum.textContent = state.lives;
  renderLivesOverlay(state);
}

export function startTimer(state, onTimeout){
  if(state._rafId){ cancelAnimationFrame(state._rafId); state._rafId = null; }
  state._startedAt = performance.now();
  state.remaining = state.timePerQ;
  const tick = (now)=>{
    const dt = now - state._startedAt;
    state._startedAt = now;
    state.remaining -= dt;
    const p = Math.max(0, state.remaining / state.timePerQ);
    el.timerBar.style.transform = `scaleX(${p})`;
    if(state.remaining<=0){ onTimeout(); }
    else { state._rafId = requestAnimationFrame(tick); }
  };
  state._rafId = requestAnimationFrame(tick);
}

export function clearTimer(state){
  if(state._rafId){ cancelAnimationFrame(state._rafId); state._rafId = null; }
}

export function flash(msg){
  const div=document.createElement('div');
  div.textContent=msg;
  div.style.position='absolute';
  div.style.left='50%'; div.style.top='18%';
  div.style.transform='translate(-50%,-50%)';
  div.style.padding='10px 14px';
  div.style.borderRadius='12px';
  div.style.background='rgba(0,0,0,.5)';
  div.style.border='1px solid rgba(255,255,255,.2)';
  div.style.backdropFilter='blur(4px)';
  div.style.boxShadow='0 10px 30px rgba(0,0,0,.35)';
  document.querySelector('.game').appendChild(div);
  setTimeout(()=> div.remove(), 1000);
}

// ---- Lives Overlay ----
function renderLivesOverlay(state){
  const cont = el.livesOverlay;
  cont.innerHTML = '';
  for(let i=0;i<state.maxLives;i++){
    const d = document.createElement('div');
    d.className = 'lifeIcon';
    d.textContent = '❤';
    if(i >= state.lives){ d.classList.add('lost'); }
    cont.appendChild(d);
  }
}

export function animateLifeLoss(){
  const hearts = [...document.getElementById('livesOverlay').querySelectorAll('.lifeIcon:not(.lost)')];
  if(!hearts.length) return;
  const toLose = hearts[hearts.length-1];
  toLose.classList.add('lost');
}

// ---- Background canvas (starfield) ----
let stars = [], w=0, h=0, ctx=null;
function setupCanvas(){
  const canvas = el.canvas;
  const dpr = Math.min(2, window.devicePixelRatio||1);
  function resize(){
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    w = canvas.width; h = canvas.height;
  }
  resize();
  ctx = canvas.getContext('2d');
  stars = Array.from({length: 140}, ()=>({ x: Math.random()*w, y: Math.random()*h, z: Math.random()*2+0.5 }));
  new ResizeObserver(resize).observe(canvas);
  requestAnimationFrame(renderFX);
}
function renderFX(){
  if(!ctx) return;
  ctx.clearRect(0,0,w,h);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for(const s of stars){
    s.y += s.z*0.6; if(s.y>h) s.y = 0;
    ctx.globalAlpha = 0.25 + s.z*0.35;
    ctx.fillRect(s.x, s.y, 1, 1);
  }
  ctx.restore();
  requestAnimationFrame(renderFX);
}
