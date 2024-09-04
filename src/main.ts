import './style.css'

//Variables

const rows = 6;
const cols = 7;
let board: string[][] = [];
let currentPlayer = 'red';
let gameOver = false;

//Initiate Board

function initBoard() {
    board = Array(rows).fill(null).map(() => Array(cols).fill(''));
    renderBoard();
    document.getElementById('message')!.textContent = "Player 1's turn (Red)";
}

//Render Board 

function renderBoard() {
  const boardElement = document.querySelector('.board') as HTMLElement;
    boardElement.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board[r][c] !== '') {
                cell.classList.add(board[r][c]);
            }
            cell.dataset.row = r.toString();
            cell.dataset.col = c.toString();
            boardElement.appendChild(cell);
        }
    }
}

//Cell Clicks

function handleCellClick(event: Event) {
    if (gameOver) return;

    const target = event.target as HTMLElement;
    const col = parseInt(target.dataset.col as string);

    if (isNaN(col)) return;

    const row = findEmptyRow(col);

    if (row !== -1) {
        board[row][col] = currentPlayer;
        renderBoard();
        if (checkWin(row, col)) {
            endGame(`Player ${currentPlayer === 'red' ? '1' : '2'} wins!`);
        } else if (isDraw()) {
            endGame('Draw!');
        } else {
            switchPlayer();
        }
    }
}

//Finding Empty Rows

function findEmptyRow(col: number): number {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][col] === '') {
            return r;
        }
    }
    return -1;
}

//Switching Players

function switchPlayer() {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    document.getElementById('message')!.textContent = `Player ${currentPlayer === 'red' ? '1' : '2'}'s turn (${(currentPlayer)})`;
}

//Checking Wins

function checkWin(row: number, col: number): boolean {
    return checkDirection(row, col, 1, 0) || 
           checkDirection(row, col, 0, 1) || 
           checkDirection(row, col, 1, 1) || 
           checkDirection(row, col, 1, -1);  
}

//Checking Directions

function checkDirection(row: number, col: number, deltaRow: number, deltaCol: number): boolean {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i * deltaRow;
        const c = col + i * deltaCol;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

//Draw

function isDraw(): boolean {
    return board.every(row => row.every(cell => cell !== ''));
}

//End Game

function endGame(message: string) {
    gameOver = true;
    document.getElementById('message')!.textContent = message;
}

// Reset Game 

function resetGame() {
    gameOver = false;
    currentPlayer = 'red';
    initBoard();
}

//Event Listeners

document.addEventListener('DOMContentLoaded', () => {
    initBoard();
    const boardElement = document.querySelector('.board')!;
    boardElement.addEventListener('click', handleCellClick);
    document.getElementById('resetButton')!.addEventListener('click', resetGame);
});