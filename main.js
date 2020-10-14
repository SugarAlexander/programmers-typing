let x = 0;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 1080;

function notu() {
    document.body.appendChild(canvas);
    draw();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(600, x++, 100, 10);
    window.requestAnimationFrame(draw);
}
