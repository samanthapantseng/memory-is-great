const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false; 
let secondCard = false;

//items array
const items = [];

for (let i = 0; i < 12; i++) {
    const item = {
        name: `munich-${i}`,
        image: `munich/munich-${i}.jpg`
    };
    items.push(item);
}

//initial time
let seconds = 0,
    minutes = 0;

//initial moves and win count
let movesCount = 0,
    winCount = 0;

//for timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if(seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    //format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}`: seconds;
    let minutesValue = minutes < 10 ? `0${minutes}`: minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
}

//for calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
}

//pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //random object selection
    for(let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //access tempArray elements in a random order and adds them to the card Values
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
        //avoid duplicates 
    }
    return cardValues;
}

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    /*comparator function between -0.5 and 0.499
    if it returns negative, 1st element is sorted before 2nd
    if it returns positive, 2nd elemnt, is sorted before 1st
    if 0, order remains unchanged
    */
    for(let i=0; i<size*size; i++) {
        /* 
            Create Cards
            before => front side (?)
            after => back side (actual image)
            data-card-value is a custom attribute which stores 
            names of cards to match later
        */
        gameContainer.innerHTML += 
        `
        <div class="card-container" data-card-value=" ${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after"> 
                <img src="${cardValues[i].image}" class="image"/> 
            </div>
        </div>
        `;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
}

//initialize values and func calls
const initializer = () => {
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
}

initializer();

