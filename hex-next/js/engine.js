// engine.js
import { modes as MODES } from './modes.js';
import { generateDistractors } from './distractors.js'; // used by some skills
import { padBits } from './utils.js';
import * as ui from './ui.js';

export function createEngine({ skills, modes = MODES, sfx }){
  const state = {
    running:false,
    modeKey:'beginner',
    skillKey:'hex2bin',
    speed:'normal', // slow, normal, fast
    timePerQ: 10000,
    score:0,
    streak:0,
    lives:3,
    maxLives:3,
    remaining:0,
    q:null,
    _rafId:null,
    _startedAt:0,
  };

  function modeObj(){ return modes[state.modeKey]; }

  function calcTimer(){
    const base = state.modeKey==='beginner' ? 14000 : state.modeKey==='intermediate' ? 11000 : 9000;
    const mult = state.speed==='slow' ? 1.25 : state.speed==='fast' ? 0.8 : 1;
    state.timePerQ = Math.round(base * mult);
  }

  function generateQuestion(){
    const skill = skills[state.skillKey];
    return skill.generate(modeObj());
  }

  function nextQuestion(){
    if(state.lives<=0){ gameOver(); return; }
    calcTimer();
    state.q = generateQuestion();
    ui.renderQuestion(state, state.q);
    ui.startTimer(state, timeUp);
  }

  function choose(i){
    if(!state.running || !state.q) return;
    const chosen = state.q.answers[i];
    ui.lockAnswers();
    if(chosen === state.q.correct){
      ui.markAnswers(state, i, true);
      const add = 100 + Math.max(0, Math.floor( (state.remaining/state.timePerQ)*100 ));
      state.score += add;
      state.streak += 1;
      sfx.correct && sfx.correct();
      if(state.streak>0 && state.streak%5===0){
        ui.flash('Streak +5! Bonus time');
        sfx.streak && sfx.streak();
        state.remaining = Math.min(state.timePerQ, state.remaining + 2000);
      }
      ui.renderHUD(state);
      setTimeout(nextQuestion, 550);
    } else {
      ui.markAnswers(state, i, false);
      sfx.wrong && sfx.wrong();
      state.streak = 0;
      state.lives = Math.max(0, state.lives - 1);
      ui.animateLifeLoss();
      sfx.life && sfx.life();
      ui.renderHUD(state);
      if(state.lives<=0){ setTimeout(gameOver, 650); }
      else { setTimeout(nextQuestion, 750); }
    }
  }

  function startGame(){
    resetGame(true);
    state.running = true;
    nextQuestion();
    sfx.start && sfx.start();
  }

  function resetGame(keepRunning=false){
    ui.clearTimer(state);
    state.score=0; state.streak=0; state.lives=state.maxLives;
    if(!keepRunning) state.running=false;
    ui.renderHUD(state);
    preview();
  }

  function preview(){
    calcTimer();
    state.q = generateQuestion();
    ui.renderQuestion(state, state.q);
    ui.renderHUD(state);
  }

  function timeUp(){
    ui.clearTimer(state);
    state.streak = 0;
    state.lives = Math.max(0, state.lives - 1);
    ui.animateLifeLoss();
    ui.renderHUD(state);
    ui.flash(\"Time's up!\");
    sfx.timeout && sfx.timeout();
    if(state.lives<=0){ gameOver(); }
    else { nextQuestion(); }
  }

  function gameOver(){
    state.running=false;
    ui.clearTimer(state);
    ui.flash(`Game over — score ${state.score}`);
    sfx.gameover && sfx.gameover();
  }

  // Expose API
  return {
    state,
    startGame, resetGame, preview, nextQuestion, choose,
    setMode:(k)=>{ state.modeKey=k; preview(); },
    setSkill:(k)=>{ state.skillKey=k; preview(); },
    setSpeed:(k)=>{ state.speed=k; preview(); },
  };
}
