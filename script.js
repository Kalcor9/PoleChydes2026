const gameRounds = [
    {
        finalWord: "ЕЛЬ",
        riddles: [
            "Буква 1. Загадка: Гласная буква, с которой начинается слово 'Ежевика'?",
            "Буква 2. Загадка: Прозрачные сосульки на крыше — это...? (Начинается на Л)",
            "Буква 3. Загадка: Буква-знак, которая делает согласные мягкими?"
        ]
    },
    {
        finalWord: "ШАР",
        riddles: [
            "Буква 1. Загадка: Тёплый зимний аксессуар на голову? (Начинается на Ш)",
            "Буква 2. Загадка: Цитрус, который едят на Новый год? (Начинается на А)",
            "Буква 3. Загадка: У Деда Мороза в руках волшебный...? (Начинается на Р)"
        ]
    },
    {
        finalWord: "СНЕГ",
        riddles: [
            "Буква 1. Загадка: Внучка Деда Мороза? (Начинается на С)",
            "Буква 2. Загадка: Праздник, который мы ждем? (Начинается на Н)",
            "Буква 3. Загадка: Если вода замерзнет, получится...? (Начинается на Е)",
            "Буква 4. Загадка: На чем горят новогодние огни? (Начинается на Г - Гирлянда)"
        ]
    }
];

let roundIdx = 0, letterIdx = 0, score = 0, canGuess = false, points = 0;

const input = document.getElementById("letter-input");
const status = document.getElementById("status-message");

function loadRound() {
    letterIdx = 0; canGuess = false;
    const wordDiv = document.getElementById("word-display");
    wordDiv.innerHTML = "";
    const round = gameRounds[roundIdx];
    
    for (let i = 0; i < round.finalWord.length; i++) {
        const div = document.createElement("div");
        div.className = "letter-slot";
        div.id = "s-" + i;
        wordDiv.appendChild(div);
    }
    document.getElementById("question").innerText = round.riddles[0];
}

document.getElementById("wheel").addEventListener("click", () => {
    if (canGuess || roundIdx >= gameRounds.length) return;
    const rot = Math.floor(Math.random() * 360) + 1440;
    document.getElementById("wheel").style.transform = `rotate(${rot}deg)`;
    status.innerText = "Барабан крутится...";
    
    setTimeout(() => {
        points = [100, 300, 500, 1000][Math.floor(Math.random() * 4)];
        status.innerText = `На барабане ${points}! Введите первую букву ответа:`;
        canGuess = true;
        input.focus();
    }, 2000);
});

function guessLetter() {
    const char = input.value.toUpperCase();
    input.value = "";
    if (!canGuess || !char) return;

    if (char === gameRounds[roundIdx].finalWord[letterIdx]) {
        document.getElementById("s-" + letterIdx).innerText = char;
        score += points;
        document.getElementById("score").innerText = score;
        letterIdx++;
        canGuess = false;

        if (letterIdx < gameRounds[roundIdx].finalWord.length) {
            document.getElementById("question").innerText = gameRounds[roundIdx].riddles[letterIdx];
            status.innerText = "Верно! Крутите барабан дальше.";
        } else {
            roundIdx++;
            if (roundIdx < gameRounds.length) {
                status.innerText = "Слово отгадано! Следующий раунд...";
                setTimeout(loadRound, 2000);
            } else {
                status.innerHTML = "<strong>ВЫ ПОБЕДИЛИ! С НОВЫМ ГОДОМ! 🎉</strong>";
                document.getElementById("wheel").style.display = "none";
                document.getElementById("restart-btn").style.display = "block";
            }
        }
    } else {
        status.innerText = "Неверно! Попробуйте снова крутануть.";
        canGuess = false;
    }
}

input.addEventListener("keypress", (e) => { if (e.key === "Enter") guessLetter(); });
loadRound();
