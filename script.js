const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status-text");

const restartBtn = document.getElementById("restart-btn");
const resetScoreBtn = document.getElementById("reset-score-btn");

const pvpBtn = document.getElementById("pvp-btn");
const aiBtn = document.getElementById("ai-btn");

const xScoreEl = document.getElementById("x-score");
const oScoreEl = document.getElementById("o-score");
const drawScoreEl = document.getElementById("draw-score");

const winnerModal = document.getElementById("winner-modal");
const winnerMessage = document.getElementById("winner-message");
const playAgainBtn = document.getElementById("play-again-btn");

const moveSound = document.getElementById("move-sound");
const winSound = document.getElementById("win-sound");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;

/* =========================
   Load Scores
========================= */

let xScore =
    Number(localStorage.getItem("xScore")) || 0;

let oScore =
    Number(localStorage.getItem("oScore")) || 0;

let drawScore =
    Number(localStorage.getItem("drawScore")) || 0;

xScoreEl.textContent = xScore;
oScoreEl.textContent = oScore;
drawScoreEl.textContent = drawScore;

/* =========================
   Winning Combinations
========================= */

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

/* =========================
   Save Scores
========================= */

function saveScores() {

    localStorage.setItem(
        "xScore",
        xScore
    );

    localStorage.setItem(
        "oScore",
        oScore
    );

    localStorage.setItem(
        "drawScore",
        drawScore
    );
}

/* =========================
   Winner Modal
========================= */

function showWinnerModal(message) {

    winnerMessage.textContent =
        message;

    winnerModal.classList.add(
        "show"
    );
}

function hideWinnerModal() {

    winnerModal.classList.remove(
        "show"
    );
}

/* =========================
   Cell Click
========================= */

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});

function handleCellClick(e) {

    const index =
        e.target.dataset.index;

    if (
        board[index] !== "" ||
        !gameActive
    ) {
        return;
    }

    makeMove(
        index,
        currentPlayer
    );

    if (
        vsComputer &&
        gameActive &&
        currentPlayer === "O"
    ) {

        setTimeout(
            computerMove,
            500
        );

    }
}

/* =========================
   Make Move
========================= */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent =
        player;

    cells[index].classList.add(
        player.toLowerCase()
    );

    if (moveSound) {

        moveSound.currentTime = 0;

        moveSound.play()
            .catch(() => {});
    }

    checkGameResult();

    if (gameActive) {

        currentPlayer =
            player === "X"
            ? "O"
            : "X";

        statusText.textContent =
            vsComputer &&
            currentPlayer === "O"
            ? "Computer's Turn"
            : `Player ${currentPlayer}'s Turn`;
    }
}

/* =========================
   Computer Move
========================= */

function computerMove() {

    let emptyCells = [];

    board.forEach(
        (cell, index) => {

            if (cell === "") {
                emptyCells.push(index);
            }

        }
    );

    if (
        emptyCells.length === 0
    ) {
        return;
    }

    const randomIndex =
        emptyCells[
            Math.floor(
                Math.random() *
                emptyCells.length
            )
        ];

    makeMove(
        randomIndex,
        "O"
    );
}

/* =========================
   Check Winner / Draw
========================= */

function checkGameResult() {

    let roundWon = false;

    for (
        let combination
        of winningCombinations
    ) {

        const [a,b,c] =
            combination;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            roundWon = true;

            cells[a].classList.add(
                "win"
            );

            cells[b].classList.add(
                "win"
            );

            cells[c].classList.add(
                "win"
            );

            break;
        }
    }

    if (roundWon) {

        statusText.textContent =
            `${currentPlayer} Wins! 🎉`;

        showWinnerModal(
            `${currentPlayer} Wins! 🎉`
        );

        if (winSound) {

            winSound.currentTime = 0;

            winSound.play()
                .catch(() => {});
        }

        gameActive = false;

        if (
            currentPlayer === "X"
        ) {

            xScore++;

            xScoreEl.textContent =
                xScore;

        } else {

            oScore++;

            oScoreEl.textContent =
                oScore;
        }

        saveScores();

        return;
    }

    if (
        !board.includes("")
    ) {

        statusText.textContent =
            "It's a Draw! 🤝";

        showWinnerModal(
            "It's a Draw! 🤝"
        );

        drawScore++;

        drawScoreEl.textContent =
            drawScore;

        saveScores();

        gameActive = false;
    }
}

/* =========================
   Restart Game
========================= */

restartBtn.addEventListener(
    "click",
    restartGame
);

function restartGame() {

    hideWinnerModal();

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "X";
    gameActive = true;

    statusText.textContent =
        "Player X's Turn";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "win"
        );

    });
}

/* =========================
   Play Again
========================= */

playAgainBtn.addEventListener(
    "click",
    restartGame
);

/* =========================
   Reset Scores
========================= */

resetScoreBtn.addEventListener(
    "click",
    () => {

        const confirmReset =
            confirm(
                "Reset all scores?"
            );

        if (!confirmReset) {
            return;
        }

        xScore = 0;
        oScore = 0;
        drawScore = 0;

        xScoreEl.textContent = 0;
        oScoreEl.textContent = 0;
        drawScoreEl.textContent = 0;

        localStorage.removeItem(
            "xScore"
        );

        localStorage.removeItem(
            "oScore"
        );

        localStorage.removeItem(
            "drawScore"
        );

        restartGame();
    }
);

/* =========================
   PvP Mode
========================= */

pvpBtn.addEventListener(
    "click",
    () => {

        vsComputer = false;

        pvpBtn.classList.add(
            "active"
        );

        aiBtn.classList.remove(
            "active"
        );

        restartGame();
    }
);

/* =========================
   AI Mode
========================= */

aiBtn.addEventListener(
    "click",
    () => {

        vsComputer = true;

        aiBtn.classList.add(
            "active"
        );

        pvpBtn.classList.remove(
            "active"
        );

        restartGame();
    }
);