const gameRounds = [
    { word: "МАНДАРИН", question: "Оранжевый символ Нового года?" },
    { word: "СНЕГУРОЧКА", question: "Кто помогает Деду Морозу?" },
    { word: "ГИРЛЯНДА", question: "Что светится на елке огоньками?" }
];

let players = [];
let currentPlayerIdx = 0;
let roundIdx = 0;
let pointsOnWheel = 0;
let canGuess = false;
let guessedLetters = [];

const input = document.getElementById("letter-input");
const status = document.getElementById("status-message");

function initGame(num) {
    // Создаем массив игроков
    for (let i = 0; i < num; i++) {
        players.push({ id: i + 1, score: 0 });
    }
    
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("main-game").style.display = "block";
    
    updateScorePanel();
    loadRound();
}

function loadRound() {
    guessedLetters = [];
    canGuess = false;
    const round = gameRounds[roundIdx];
    document.getElementById("question").innerText = `Раунд ${roundIdx + 1}: ${round.question}`;
    
    const wordDiv = document.getElementById("word-display");
    wordDiv.innerHTML = "";
    for (let i = 0; i < round.word.length; i++) {
        const div = document.createElement("div");
        div.className = "letter-slot";
        div.id = "s-" + i;
        wordDiv.appendChild(div);
    }
    updateTurnDisplay();
}

function updateTurnDisplay() {
    document.getElementById("current-player-display").innerText = `Ход Игрока ${players[currentPlayerIdx].id}`;
    updateScorePanel();
}

function updateScorePanel() {
    const panel = document.getElementById("score-panel");
    panel.innerHTML = "";
    players.forEach((p, idx) => {
        const div = document.createElement("div");
        div.className = "player-score" + (idx === currentPlayerIdx ? " active-score" : "");
        div.innerText = `Игрок ${p.id}: ${p.score}`;
        panel.appendChild(div);
    });
}

document.getElementById("wheel").addEventListener("click", () => {
    if (canGuess || roundIdx >= gameRounds.length) return;
    
    const rot = Math.floor(Math.random() * 360) + 1440;
    document.getElementById("wheel").style.transform = `rotate(${rot}deg)`;
    status.innerText = "Барабан крутится...";
    
    setTimeout(() => {
        const sectors = [100, 200, 300, 500, 0]; // 0 - Банкрот
        pointsOnWheel = sectors[Math.floor(Math.random() * sectors.length)];
        
        if (pointsOnWheel === 0) {
            status.innerText = `Банкрот! Игрок ${players[currentPlayerIdx].id} теряет очки и ход.`;
            players[currentPlayerIdx].score = 0;
            nextTurn();
        } else {
            status.innerText = `На барабане ${pointsOnWheel}! Ваша буква?`;
            canGuess = true;
            input.focus();
        }
    }, 2000);
});

function guessLetter() {
    const char = input.value.toUpperCase();
    input.value = "";
    if (!canGuess || !char) return;

    const word = gameRounds[roundIdx].word;
    
    if (guessedLetters.includes(char)) {
        status.innerText = "Эту букву уже называли! Переход хода.";
        nextTurn();
        return;
    }

    let found = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === char) {
            document.getElementById("s-" + i).innerText = char;
            found = true;
        }
    }

    if (found) {
        guessedLetters.push(char);
        players[currentPlayerIdx].score += pointsOnWheel;
        status.innerText = "Есть такая буква! Вы ходите снова.";
        updateScorePanel();
        checkWin();
    } else {
        status.innerText = "Нет такой буквы! Ход переходит дальше.";
        nextTurn();
    }
    canGuess = false;
}

function nextTurn() {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    canGuess = false;
    setTimeout(updateTurnDisplay, 1000);
}

function checkWin() {
    const word = gameRounds[roundIdx].word;
    const slots = document.getElementsByClassName("letter-slot");
    let allOpened = true;
    for (let slot of slots) { if (slot.innerText === "") allOpened = false; }

    if (allOpened) {
        roundIdx++;
        if (roundIdx < gameRounds.length) {
            status.innerHTML = "<strong>Слово отгадано! Следующий раунд...</strong>";
            setTimeout(loadRound, 2500);
        } else {
            const winner = [...players].sort((a,b) => b.score - a.score)[0];
            status.innerHTML = `<strong>ПОБЕДА! Победил Игрок ${winner.id}! 🎉</strong>`;
            document.getElementById("wheel").style.display = "none";
            document.getElementById("restart-btn").style.display = "block";
        }
    }
}

input.addEventListener("keypress", (e) => { if (e.key === "Enter") guessLetter(); });
