let gameStarted = false;
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
let inputDir = { x: 0, y: 0 }

let foodSound = new Audio('./assets/munch-sound-effect.mp3')

let gameOverSound = new Audio('./assets/die.mp3')

let moveSound = new Audio('./assets/flap.mp3')
let points = new Audio('./assets/point.mp3')

let musicSound = new Audio('./assets/smooth.mpeg')

const easy = document.getElementById('easy')
const medium = document.getElementById('medium')
const hard = document.getElementById('hard')

let speed = 5

easy.addEventListener("click", () => {
    speed = 5
    easy.classList.add("active")
    medium.classList.remove("active")
    hard.classList.remove("active")
})

medium.addEventListener("click", () => {
    speed = 10
    medium.classList.add("active")
    easy.classList.remove("active")
    hard.classList.remove("active")
})

hard.addEventListener("click", () => {
    speed = 15
    hard.classList.add("active")
    easy.classList.remove("active")
    medium.classList.remove("active")
})

startBtn.addEventListener("click", () => {
    gameStarted = true;
    startScreen.style.display = "none";
    musicSound.play();
    window.requestAnimationFrame(main);
});

let lastPaintTime = 0;
let score = 0

let maxscore = document.getElementById('highscore');


let high_score = localStorage.getItem('highscore') || 0

maxscore.innerHTML = `Highest-Score :${high_score}`;

let hasWon = false

let snakeArr = [
    { x: 13, y: 15 }
]
let food = { x: 6, y: 7 }

let isMuted = false

const muteBtn = document.getElementById('muteBtn');

muteBtn.addEventListener('click', () => {

    isMuted = !isMuted;
    muteBtn.innerText = isMuted ? "🔇 Muted" : "🔊 Sound ON";

    musicSound.muted = isMuted;
});

const totalCells = 324



const board = document.getElementById('board')
const scoreBox = document.getElementById('gamescore');




function main(ctime) {
    if (!gameStarted) return;

    window.requestAnimationFrame(main);
    // console.log(ctime)
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return
    }
    lastPaintTime = ctime
    gameEngine();
}



function isCollide(snake) {

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}


function gameEngine() {

    if(hasWon){
        return;
    }

    if (isCollide(snakeArr)) {
        gameOverSound.play()
        musicSound.pause()
        if (score > high_score) {
            high_score = score
            localStorage.setItem("highscore", high_score)
            maxscore.innerHTML = `Highest-Score :${high_score}`;
        }
        inputDir = { x: 0, y: 0 }
        alert("Game Over-Press Any Key To Play Again...")
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play()
        score = 0
        scoreBox.innerHTML = `Current-Score :${score}`;

    }

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play()
        score += 1
        points.play()

        scoreBox.innerHTML = `Current-Score :${score}`;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y })
        let a = 2
        let b = 16
        let newFood;
        do {
            newFood = {
                x: Math.round(a + (b - a) * Math.random()),
                y: Math.round(a + (b - a) * Math.random())
            };
        } while (snakeArr.some(seg => seg.x === newFood.x && seg.y === newFood.y));

        food = newFood;
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {

        snakeArr[i + 1] = { ...snakeArr[i] }

    }
    if (snakeArr.length === totalCells && !hasWon) {
        hasWon = true
        inputDir = { x: 0, y: 0 };
        musicSound.pause(); // if using music
        const game_win = document.createElement('div');
        const game_text = document.createElement('h1');

        game_text.innerHTML = "Congratulations👏 <br>You Have Won the Game 🎉";
        game_win.classList.add('winScreen');
        board.appendChild(game_win);
        game_win.appendChild(game_text);

    }

    snakeArr[0].x += inputDir.x
    snakeArr[0].y += inputDir.y

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head')
        } else {
            snakeElement.classList.add('snake')

        }
        board.appendChild(snakeElement);

    })
    let foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);

}


window.addEventListener('keydown', e => {
    moveSound.play()
    switch (e.key.toLocaleLowerCase()) {
        case "arrowup":
        case "w":
            inputDir.x = 0;
            inputDir.y = -1;
            // console.log("arrowup");
            break;
        case "arrowdown":
        case "s":
            inputDir.x = 0;
            inputDir.y = 1;
            // console.log("arrowdown");
            break;
        case "arrowleft":
        case "a":
            inputDir.x = -1;
            inputDir.y = 0;
            // console.log("arrowleft");
            break;
        case "arrowright":
        case "d":
            inputDir.x = 1;
            inputDir.y = 0;
            // console.log("arrowrighy");
            break;
        default:
            break;
    }
})

let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    musicSound.play();
});

window.addEventListener("touchend", e => {

    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    moveSound.play();

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            inputDir = { x: 1, y: 0 };
        } else {
            inputDir = { x: -1, y: 0 };
        }
    } else {
        if (dy > 0) {
            inputDir = { x: 0, y: 1 };
        } else {
            inputDir = { x: 0, y: -1 };
        }
    }
});


