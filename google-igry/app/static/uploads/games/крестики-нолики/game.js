const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridImg = new Image();
gridImg.src = "assets/grid.png";

const xImg = new Image();
xImg.src = "assets/x.png";

const oImg = new Image();
oImg.src = "assets/o.png";

let board = Array(9).fill(null);
let player = "X";

function drawGrid() {
    ctx.drawImage(gridImg, 0, 0, 300, 300);
}

function drawMarks() {
    for (let i = 0; i < 9; i++) {
        let x = (i % 3) * 100;
        let y = Math.floor(i / 3) * 100;

        if (board[i] === "X") ctx.drawImage(xImg, x, y, 100, 100);
        if (board[i] === "O") ctx.drawImage(oImg, x, y, 100, 100);
    }
}

function render() {
    ctx.clearRect(0, 0, 300, 300);
    drawGrid();
    drawMarks();
}

canvas.addEventListener("click", (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((e.clientX - rect.left) / 100);
    let y = Math.floor((e.clientY - rect.top) / 100);

    let index = y * 3 + x;

    if (!board[index]) {
        board[index] = player;
        player = player === "X" ? "O" : "X";
    }

    render();
});

function loop() {
    render();
    requestAnimationFrame(loop);
}

loop();