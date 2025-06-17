const body = document.body;
const lightsEl = document.getElementById('lights');
const resultEl = document.getElementById('result');
const resultValueEl = document.getElementById('result-value');
const highScoreDisplayEl = document.getElementById('high-score-display'); // Get High Score Element
const lightSound = new Audio('./f1_light_sound.mp3');
const revSound = new Audio('./idle_rev_f1.mp3');
const awayWeGo = new Audio('./away_we_go.mp3');
let gameStarted = false;
let timer = 0;
let countOngoing = false;
let currentHighScore = null; // Variable to store the current high score

// Function to load high score from localStorage
function loadHighScore() {
  const savedScore = localStorage.getItem('reactionHighScore');
  if (savedScore === null) {
    return 9999; // Return a default high value if no score is found
  }
  return parseInt(savedScore, 10);
}

// Function to update the high score display
function updateHighScoreDisplay(score) {
  if (score === null || score === 9999) {
    highScoreDisplayEl.innerText = "High Score: ---";
  } else {
    highScoreDisplayEl.innerText = `High Score: ${score} MS`;
  }
}

// Load and display initial high score
currentHighScore = loadHighScore();
updateHighScoreDisplay(currentHighScore);

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
  // resultEl.style.display = 'block'; // Replaced with classList animation
  resultEl.classList.add('show');
  resultValueEl.innerText = result;
  gameStarted = false;

  // Save and Update High Score
  if (currentHighScore === 9999 || result < currentHighScore) {
    currentHighScore = result;
    localStorage.setItem('reactionHighScore', currentHighScore);
    updateHighScoreDisplay(currentHighScore);
  }
};

const startGame = async () => {
  gameStarted = true;
  countOngoing = true;
  // resultEl.style.display = 'none'; // Replaced with classList animation
  resultEl.classList.remove('show');
  // Ensure it's fully hidden for the next time .show is added,
  // as 'show' class sets display: block. Removing class reverts to CSS default (display: none).
  // Explicitly setting style.display is a fallback, but usually not needed if CSS is set up correctly.
  // resultEl.style.display = 'none'; // This line is likely redundant if base .result-wrapper is display:none
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
