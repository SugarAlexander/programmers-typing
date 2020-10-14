let x = 0;

let canvas;
let ctx;

function init() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    tick();

}
window.addEventListener("DOMContentLoaded", init);

function tick() {
    update();
    render();
    window.requestAnimationFrame(tick);
}

/**
 * 更新
 */
function update() {
    x++;
}

/**
 * 描画
 */
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(600, x, 100, 10);

}
