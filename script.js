const moves = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const pairs = document.getElementById('pairs');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const gameContainer = document.querySelector('.game-container');
const result = document.getElementById('result');
const controls = document.querySelector('.controls-container');
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//items array
const items = [];
for (let i = 0; i < 40; i++) {
  const item = {
    name: `munich-${i}`,
    image: `munich/munich-${i}.jpg`,
  };
  items.push(item);
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
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

//for calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
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
    /* 
            Create Cards
            before => front side (?)
            after => back side (actual image)
            data-card-value is a custom attribute which stores 
            names of cards to match later
        */
    gameContainer.innerHTML += `
        <div class="card-container" data-card-value=" ${cardValues[i].name}">
            <div class="card-before">:)</div>
            <div class="card-after"> 
                <img src="${cardValues[i].image}" class="image"/> 
            </div>
        </div>
        `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${cols},auto)`;
  gameContainer.style.gridTemplateRows = `repeat(${rows},auto)`;

  //cards
  cards = document.querySelectorAll('.card-container');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
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
          console.log(firstCardValue);
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute('data-card-value');
          console.log(secondCardValue);

          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would be ignored next time
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            //also hide them after 1500 miliseconds by hiding all child elements
            var firstCardChilds = firstCard.querySelectorAll('*');
            var secondCardChilds = secondCard.querySelectorAll('*');
            setTimeout(() => {
              firstCardChilds.forEach((child) => {
                child.classList.add('hide');
              });
              secondCardChilds.forEach((child) => {
                child.classList.add('hide');
              });
            }, 1500);
            //set firstCard to flase since next card would be firstCard now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            pairs.innerHTML = `<span>Pairs: </span> ${winCount}/${cols * rows}`;
            //check if winCount == half of the cardValue
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>WOW! YOU HAVE SUCH A GREAT MEMORY!</h2>
                        <h4>Moves: ${movesCount}</h4>`;
              stopGame();
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
            }, 900);
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
  //controls and buttons visibility
  controls.classList.add('hide');
  stopButton.classList.remove('hide');
  startButton.classList.add('hide');
  //initialize according to the dificulty
  var value = document.getElementsByName('dificulty');
  for (var radio of value) {
    if (radio.checked) {
      switch (radio.value) {
        case 'Easy':
          initializer(6, 5);
          break;
        case 'Medium':
          initializer(8, 5);
          break;
        case 'Hard':
          initializer(10, 5);
          break;
        case 'Very Hard':
          initializer(10, 7);
          break;
      }
    }
  }
});

//stop game
stopButton.addEventListener(
  'click',
  (stopGame = () => {
    controls.classList.remove('hide');
    stopButton.classList.add('hide');
    startButton.classList.remove('hide');
    setDificultyOptions();
    clearInterval(interval);
  })
);

//initialize values and func calls
const initializer = (cols, rows) => {
  //initial moves
  moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
  timeValue.innerHTML = `<span>Time: 00:00</span>`;
  pairs.innerHTML = `<span>Pairs: </span> 0/${cols * rows}`;
  result.innerHTML = '';
  winCount = 0;
  let cardValues = generateRandom(cols, rows);
  console.log(cardValues);
  if (window.innerWidth > 750) matrixGenerator(cardValues, cols, rows);
  else matrixGenerator(cardValues, rows, cols);
};

function setDificultyOptions() {
  const optionContainers = document.querySelectorAll('.option-container');
  // Loop through each element with the class .option-container
  optionContainers.forEach((option) => {
    option.style.left =
      Math.floor(Math.random() * (window.innerWidth - 100)) + 'px';
    option.style.top =
      Math.floor(Math.random() * (window.innerHeight - 100)) + 'px';
  });
}

setDificultyOptions();
