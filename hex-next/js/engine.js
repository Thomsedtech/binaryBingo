// /js/engine.js
export function createEngine({ skills, modes, ui, audio }) {
  const state = { running:false, score:0, streak:0, lives:3, modeKey:'beginner', skillKey:'hex2bin', ...modes.beginner };
  function nextQuestion() {
    const skill = skills[state.skillKey];
    const q = skill.generate(modes[state.modeKey]);
    state.q = q;
    ui.renderQuestion(state, q);
    ui.startTimer(state, onTimeout);
  }
  function choose(i) { ui.lockAnswers(); /* scoring, streak, lives */ }
  function onTimeout(){ /* lose life; nextQuestion or gameOver */ }
  return { state, nextQuestion, choose, setMode(k){state.modeKey=k}, setSkill(k){state.skillKey=k} };
}

