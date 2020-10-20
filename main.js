//let x = 0;

let notes = []; // ノーツを管理する配列

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');

const LEFT_OFFSET = 100;
const TOP_OFFSET = 30;
const NOTE_WIDTH = 150; // ノーツの横幅
const NOTE_HEIGHT = 50; // ノーツの高さ
const NOTE_SCREEN_HEIGHT = 800; // ノーツを表示する領域の高さ

canvas.width = 1920;
canvas.height = 1080;

notes.push({
  lane: 0, // 左端のレーン
  progress: 0 // 進み具合
});



function notu() {
    document.body.appendChild(canvas);
    draw();
    window.setTimeout("hoge()", 1000);
    window.setTimeout("hoge1()", 2000);
    window.setTimeout("hoge2()", 3000);
    window.setTimeout("hoge3()", 4000);
    window.setTimeout("hoge4()", 5000);
}

function hoge(){
  notes.push({
    lane: 1, // 左端のレーン
    progress: 0 // 進み具合
  });
}

function hoge1(){
  notes.push({
    lane: 2, // 左端のレーン
    progress: 0 // 進み具合
  });
}
function hoge2(){
  notes.push({
    lane: 3, // 左端のレーン
    progress: 0 // 進み具合
  });
}
function hoge3(){
  notes.push({
    lane: 4, // 左端のレーン
    progress: 0 // 進み具合
  });
}function hoge4(){
  notes.push({
    lane: 0, // 左端のレーン
    progress: 0 // 進み具合
  });
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillRect(600, x++, 100, 10);
    
    notes.forEach(note => {
        // 例えば fillRect で描く場合
        ctx.fillRect(
          LEFT_OFFSET + note.lane * NOTE_WIDTH, // X座標
          TOP_OFFSET + note.progress * NOTE_SCREEN_HEIGHT, // Y座標
          NOTE_WIDTH, NOTE_HEIGHT);
          note.progress += 0.005;

          notes = notes.filter(note => note.progress < 1.0);
      });

    
      // 画面外のノーツを削除
     
    window.requestAnimationFrame(draw);
}
