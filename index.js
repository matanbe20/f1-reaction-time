const body = document.body;
const lightsEl = document.getElementById('lights');
const resultEl = document.getElementById('result');
const resultValueEl = document.getElementById('result-value');
const lightSound = new Audio('./f1_light_sound.mp3');
const revSound = new Audio('./idle_rev_f1.mp3');
const awayWeGo = new Audio('./away_we_go.mp3');
let gameStarted = false;
let timer = 0;
let countOngoing = false;

function handleInputs(){
  if (countOngoing) {
    return;
  }
  if (!gameStarted) {
    startGame();
  } else {
    setTime();
  }
}
body.addEventListener('keydown', (e) => {
  console.log(e.code);
  if (e.code === 'Space') {
    handleInputs()
  }
});

body.addEventListener('click', (e) => {
  handleInputs()
});

const initLights = async () => {
  revSound.volume = 0.5;
  revSound.play();
  for (const light of lightsEl.children) {
    await sleep(1000);
    for (const circle of light.children) {
      circle.classList.add('on');
    }
    lightSound.play();
  }
};

const lightOut = async () => {
  const stopTime = getRandomInt(500, 2500);
  await sleep(stopTime);
  const circles = document.getElementsByClassName('circle');
  for (const circle of circles) {
    circle.classList.remove('on');
  }
  timer = new Date();
  countOngoing = false;
};

const setTime = () => {
  const result = new Date() - timer;
  revSound.pause();
  revSound.currentTime = 0;
  awayWeGo.volume = 0.5;
  awayWeGo.play();
  resultEl.style.display = 'block';
  resultValueEl.innerText = result;
  gameStarted = false;
};

const startGame = async () => {
  gameStarted = true;
  countOngoing = true;
  resultEl.style.display = 'none';
  await initLights();
  await lightOut();
};

//utils
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
