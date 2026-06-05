import { saveScore } from "./firebase.js";

const size = 4;
const winTile = 2048;

const boardEl = document.querySelector("#board");
const scoreEl = document.querySelector("#score");
const bestScoreEl = document.querySelector("#best-score");
const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const messageTitleEl = document.querySelector("#message-title");
const messageCopyEl = document.querySelector("#message-copy");
const newGameBtn = document.querySelector("#new-game");
const keepPlayingBtn = document.querySelector("#keep-playing");

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem("bestScore2048") || 0);
let won = false;
let keepPlaying = false;
let savedCurrentGame = false;

function emptyBoard() {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function cloneBoard(nextBoard) {
  return nextBoard.map((row) => [...row]);
}

function getEmptyCells(nextBoard = board) {
  const cells = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (nextBoard[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }

  return cells;
}

function addRandomTile() {
  const emptyCells = getEmptyCells();
  if (!emptyCells.length) return;

  const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[target.row][target.col] = Math.random() < 0.9 ? 2 : 4;
}

function createCells() {
  boardEl.innerHTML = "";

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const cell = document.createElement("div");
      cell.className = "cell tile-0";
      cell.setAttribute("role", "gridcell");
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      boardEl.append(cell);
    }
  }
}

function render() {
  const cells = boardEl.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = board[row][col];
    cell.textContent = value || "";
    cell.className = `cell tile-${value}`;
    cell.setAttribute("aria-label", value ? String(value) : "빈 칸");
  });

  scoreEl.textContent = String(score);
  bestScoreEl.textContent = String(bestScore);
}

function compressLine(line) {
  const values = line.filter(Boolean);
  const result = [];
  let gained = 0;

  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === values[index + 1]) {
      const merged = values[index] * 2;
      result.push(merged);
      gained += merged;
      index += 1;
    } else {
      result.push(values[index]);
    }
  }

  while (result.length < size) {
    result.push(0);
  }

  return { line: result, gained };
}

function moveLeft(sourceBoard) {
  const nextBoard = emptyBoard();
  let gained = 0;

  sourceBoard.forEach((row, rowIndex) => {
    const result = compressLine(row);
    nextBoard[rowIndex] = result.line;
    gained += result.gained;
  });

  return { nextBoard, gained };
}

function reverseRows(sourceBoard) {
  return sourceBoard.map((row) => [...row].reverse());
}

function transpose(sourceBoard) {
  return sourceBoard[0].map((_, col) => sourceBoard.map((row) => row[col]));
}

function calculateMove(direction, sourceBoard = board) {
  if (direction === "left") return moveLeft(sourceBoard);

  if (direction === "right") {
    const moved = moveLeft(reverseRows(sourceBoard));
    return {
      nextBoard: reverseRows(moved.nextBoard),
      gained: moved.gained
    };
  }

  if (direction === "up") {
    const moved = moveLeft(transpose(sourceBoard));
    return {
      nextBoard: transpose(moved.nextBoard),
      gained: moved.gained
    };
  }

  if (direction === "down") {
    const rotated = reverseRows(transpose(sourceBoard));
    const moved = moveLeft(rotated);
    return {
      nextBoard: transpose(reverseRows(moved.nextBoard)),
      gained: moved.gained
    };
  }

  return { nextBoard: cloneBoard(sourceBoard), gained: 0 };
}

function boardsEqual(first, second) {
  return first.every((row, rowIndex) =>
    row.every((value, colIndex) => value === second[rowIndex][colIndex])
  );
}

function hasAvailableMove() {
  if (getEmptyCells().length) return true;

  return ["left", "right", "up", "down"].some((direction) => {
    const { nextBoard } = calculateMove(direction);
    return !boardsEqual(board, nextBoard);
  });
}

function showMessage(title, copy) {
  messageTitleEl.textContent = title;
  messageCopyEl.textContent = copy;
  messageEl.hidden = false;
}

function hideMessage() {
  messageEl.hidden = true;
}

function finishTurn() {
  bestScore = Math.max(bestScore, score);
  localStorage.setItem("bestScore2048", String(bestScore));

  if (!won && board.some((row) => row.includes(winTile))) {
    won = true;
    saveFinalScore();
    statusEl.textContent = "2048 달성!";
    showMessage("승리!", "2048 타일을 만들었습니다.");
  } else if (!hasAvailableMove()) {
    saveFinalScore();
    statusEl.textContent = "더 이상 이동할 수 없습니다.";
    showMessage("게임 오버", "새 게임으로 다시 도전해보세요.");
  } else {
    statusEl.textContent = "";
  }

  render();
}

function saveFinalScore() {
  if (savedCurrentGame || score <= 0) return;
  savedCurrentGame = true;

  const playerName = localStorage.getItem("playerName2048") || "player";
  saveScore(score, playerName);
}

function move(direction) {
  if (messageEl.hidden === false && (!won || !keepPlaying)) return;

  const { nextBoard, gained } = calculateMove(direction);
  if (boardsEqual(board, nextBoard)) return;

  board = nextBoard;
  score += gained;
  addRandomTile();
  finishTurn();
}

function startGame() {
  board = emptyBoard();
  score = 0;
  won = false;
  keepPlaying = false;
  savedCurrentGame = false;
  statusEl.textContent = "";
  hideMessage();
  addRandomTile();
  addRandomTile();
  render();
}

function directionFromKey(key) {
  return {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  }[key];
}

window.addEventListener("keydown", (event) => {
  const direction = directionFromKey(event.key);
  if (!direction) return;

  event.preventDefault();
  move(direction);
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => move(button.dataset.dir));
});

newGameBtn.addEventListener("click", startGame);

keepPlayingBtn.addEventListener("click", () => {
  keepPlaying = true;
  hideMessage();
  statusEl.textContent = "계속 진행 중";
});

createCells();
bestScoreEl.textContent = String(bestScore);
startGame();
