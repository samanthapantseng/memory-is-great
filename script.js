const moves = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const pairs = document.getElementById('pairs');
const difficulty = document.getElementById('difficulty');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const wrapper = document.getElementById('wrapper');
const againButton = document.getElementById('again');
const gameContainer = document.querySelector('.game-container');
const result = document.getElementById('result');
const winScreen = document.getElementById('win');
const controls = document.querySelector('.controls-container');


//Import audio files
const clickAudio = new Audio('flip.mp3');
const matchAudio = new Audio('yay.mp3');

const quitAudio = new Audio('boo-womp.mp3');

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//items array
let items = [];

//choose which place for memory
function setPlaceOption() {
  var value = document.getElementsByName('place');
  for (var radio of value) {
    if (radio.checked) {
      switch (radio.value) {
        case 'Berlin':
          for (let i = 0; i < 35; i++) {
            const item = {
              name: `berlin-${i}`,
              image: `berlin/berlin-${i}.jpg`,
            };
            items.push(item);
          }
          break;
        case 'Munich':
          for (let i = 0; i < 35; i++) {
            const item = {
              name: `munich-${i}`,
              image: `munich/munich-${i}.jpg`,
            };
            items.push(item);
          }
          break;
      }
    }
  }
}

//initial time
let seconds = 0,
  minutes = 0;

//initial moves and win count
let movesCount = 0,
  winCount = 0;

//first card to start the timer
let firstMove = true;

//for timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>time: </span>${minutesValue}:${secondsValue}`;
};

//for calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>moves: </span>${movesCount}`;
};

//pick random objects from the items array
const generateRandom = (cols, rows) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (cols * rows) / 2;
  //random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //access tempArray elements in a random order and adds them to the card Values
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
    //avoid duplicates
  }
  return cardValues;
};

const matrixGenerator = (cardValues, cols, rows) => {
  
  gameContainer.innerHTML = '';
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  /*comparator function between -0.5 and 0.499
    if it returns negative, 1st element is sorted before 2nd
    if it returns positive, 2nd elemnt, is sorted before 1st
    if 0, order remains unchanged
    */
  for (let i = 0; i < cols * rows; i++) {

    var value = document.getElementsByName('place');
    for (var radio of value) {
      if (radio.checked) {
        switch (radio.value) {
          case 'Berlin':
              gameContainer.innerHTML += `
              <div class="card-container" data-card-value=" ${cardValues[i].name}">
                  <div class="card-before">
                    <img src=placeholder/berlin-placeholder.png class="image"/>
                  </div>
                  <div class="card-after"> 
                      <img src="${cardValues[i].image}" class="image"/> 
                  </div>
              </div>
              `;
            break;
          case 'Munich':
              gameContainer.innerHTML += `
              <div class="card-container" data-card-value=" ${cardValues[i].name}">
                  <div class="card-before">
                    <img src=placeholder/munich-placeholder.png class="image"/>
                  </div>
                  <div class="card-after"> 
                      <img src="${cardValues[i].image}" class="image"/> 
                  </div>
              </div>
              `;
            
        }
      }
    }
    /* 
            Create Cards
            before => front side (?)
            after => back side (actual image)
            data-card-value is a custom attribute which stores 
            names of cards to match later
        */
  }
  gameContainer.style.gridTemplateColumns = `repeat(${cols},auto)`;
  gameContainer.style.gridTemplateRows = `repeat(${rows},auto)`;

  //cards
  cards = document.querySelectorAll('.card-container');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      //play the click sound effect
      clickAudio.cloneNode().play();
      //if this is the first card clicked, start the timer
      if (firstMove) {
        interval = setInterval(timeGenerator, 1000);
        firstMove = false;
      }
      /*
            if selected card is not matched yet then only run
            (i.e already matched card when click would be ignored)
            */
      if (
        !card.classList.contains('matched') &&
        !card.classList.contains('flipped')
      ) {
        //flip the clicked card
        card.classList.add('flipped');
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute('data-card-value');
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute('data-card-value');

          if (firstCardValue == secondCardValue) {
            matchAudio.cloneNode().play();
            //if both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            //animation for spinner
            firstCard.classList.add('spinner');
            secondCard.classList.add('spinner');

            //set firstCard to flase since next card would be firstCard now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            pairs.innerHTML = `<span>Pairs: </span> ${winCount}/${
              (cols * rows) / 2
            }`;
            //check if winCount == half of the cardValue
            const timeTaken = timeValue.innerText;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<p>wow! u have such a good memory</p>
                        <br />
                        <p>moves: ${movesCount}</p>
                        <p>${timeTaken}</p>
                        `;
              winGame();
            }
          } else {
            //if card dont match
            //flip card back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              tempFirst.classList.remove('flipped');
              tempSecond.classList.remove('flipped');
            }, 1300);
          }
        }
      }
    });
  });
};

//start game
startButton.addEventListener('click', () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  firstMove = true;
  items = [];
  setPlaceOption();
  //controls and buttons visibility
  controls.classList.add('hide');
  stopButton.classList.remove('hide');
  startButton.classList.add('hide');
  winScreen.classList.add('hide');
  //initialize according to the dificulty
  wrapper.classList.add('appear');
  var value = document.getElementsByName('dificulty');
  for (var radio of value) {
    if (radio.checked) {
      switch (radio.value) {
        case 'easy':
          initializer(6, 5);
          break;
        case 'medium':
          initializer(8, 5);
          break;
        case 'hard':
          initializer(10, 5);
          break;
        case 'very hard':
          initializer(10, 7);
          break;
      }
      difficulty.innerHTML = `<span>difficulty: </span>${radio.value}`;
    }
  }
});

//stop game
stopButton.addEventListener(
  'click',
  (stopGame = () => {
    quitAudio.cloneNode().play();
    controls.classList.remove('hide');
    stopButton.classList.add('hide');
    startButton.classList.remove('hide');
    againButton.classList.add('hide');
    wrapper.classList.remove('appear');
    wrapper.classList.remove('hide');
    winScreen.classList.add('hide');
    setGameOptions();
    clearInterval(interval);
  })
);

//play again
againButton.addEventListener('click', stopGame);

function winGame() {
  winScreen.classList.remove('hide');
  controls.classList.add('hide');
  stopButton.classList.add('hide');
  wrapper.classList.add('hide');
  clearInterval(interval);
  againButton.classList.remove('hide');

}

//initialize values and func calls
const initializer = (cols, rows) => {
  //initial moves
  moves.innerHTML = `<span>moves: </span> ${movesCount}`;
  timeValue.innerHTML = `<span>time: 00:00</span>`;
  pairs.innerHTML = `<span>pairs: </span> 0/${(cols * rows) / 2}`;
  result.innerHTML = '';
  winCount = 0;
  let cardValues = generateRandom(cols, rows);
  console.log(cardValues);
  if (window.innerWidth > 750) matrixGenerator(cardValues, cols, rows);
  else matrixGenerator(cardValues, rows, cols);
};

function setGameOptions() {
  const dificultyOptions = document.querySelectorAll('input[name="dificulty"]');
  const placeOptions = document.querySelectorAll('input[name="place"]');
  const playerOptions = document.querySelectorAll('input[name="players"]');

  setOptionsRandomPosition(dificultyOptions, 'upper');
  setOptionsRandomPosition(placeOptions, 'lower');
  setOptionsRandomPosition(playerOptions, 'lower');
}

function setOptionsRandomPosition(options, position) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const maxTop = screenHeight / 2 - 100;

  options.forEach((option) => {
    option.parentElement.style.left =
      Math.floor(Math.random() * (screenWidth - 100)) + 'px';
    option.parentElement.style.top =
      position === 'upper'
        ? Math.floor(Math.random() * maxTop) + 'px'
        : Math.floor(Math.random() * maxTop + screenHeight / 2) + 'px';
  });
}

setGameOptions();
