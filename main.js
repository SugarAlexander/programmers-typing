//let x = 0;

let notes = []; // ノーツを管理する配列
const TEST_NOTES = [
  { lane: 0, time: 0 },
  { lane: 1, time: 1000 },
  { lane: 2, time: 2000 },
  { lane: 3, time: 3000 },
  { lane: 4, time: 4000 },
];

//let progress;
let canvas;
let ctx;

const LEFT_OFFSET = 100;
const TOP_OFFSET = 30;
const NOTE_WIDTH = 150; // ノーツの横幅
const NOTE_HEIGHT = 50; // ノーツの高さ
const NOTE_SCREEN_HEIGHT = 800; // ノーツを表示する領域の高さ


function init() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
  
    
    
    testNotes();

    tick();
}

function testNotes(){
 
  TEST_NOTES.forEach(note => {
    setTimeout(() => {
      notes.push({
        lane: note.lane,
        progress: 0
      });
    },note.time);
  });
  
}

addEventListener("DOMContentLoaded", init);

let lastTime = null;
function tick(time) {
    const delta = lastTime == null ? 0 : time - lastTime;
    lastTime = time;

    update(delta);
    render();
    
    requestAnimationFrame(tick);
}

/**
 * 更新
 */
function update(delta) {
  
  notes.forEach(note => {
    note.progress += (200 / 0.5) * (delta / 1000) / NOTE_SCREEN_HEIGHT;
  });
  notes = notes.filter(note => note.progress < 1.0);
}

/**
 * 描画
 */
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 800 ,1980, 20);
    notes.forEach(note => {
      // 例えば fillRect で描く場合
      ctx.fillRect(
        LEFT_OFFSET + note.lane * NOTE_WIDTH, // X座標
        TOP_OFFSET + note.progress * NOTE_SCREEN_HEIGHT, // Y座標
        NOTE_WIDTH, NOTE_HEIGHT);
    });
}

