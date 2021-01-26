let notes = []; // ノーツを管理する配列

let canvas;
let ctx;

const LEFT_OFFSET = 100;
const NOTE_FIRST_Y = -30;
const NOTE_WIDTH = 150; // ノーツの横幅
const NOTE_HEIGHT = 50; // ノーツの高さ
const NOTES_DISTANCE = 300;
const NOTE_GOOD_TOP = 750;
const NOTE_GOOD_BOTTOM = 846;
const NOTE_GOOD_HALF = (NOTE_GOOD_BOTTOM - NOTE_GOOD_TOP) / 2;
const SHOW_PROGRAM_LINES = 18;
const SHOW_PROGRAM_LINE_HEIGHT = 40;
const HIT_ADD_PROGRAM_LINE = 5;

const PROGRAM_FONT = "normal 30pt monospace";

let notearray;

let program;

let playing = false;

let nextNoteLine = 0;

let score = 0;

let typed = {
  line: 0,
  letter: 0
}

let showStartLine = 0;

let particles = [];

const Music = new Audio();

let SE = new Audio();

let bpm = 115;
let noteVelocity = NOTES_DISTANCE / (60 / bpm);

function init() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  ctx.textBaseline = "top"

  document.body.appendChild(Music);
  Music.preload = "auto";
  Music.src = "./nitizyou.wav"
  Music.load();

  document.body.appendChild(SE);
  SE.preload = "auto";
  SE.src = "./keyboard1.mp3"
  SE.load();

  const roadpromise1 = getCSV();
  const roadpromise2 = program_response();
  Promise.all([roadpromise1, roadpromise2]).then(array => {
    notearray = convertCSVtoArray(array[0]);
    program = array[1];

    tick();
  })
}

var countUpValue = 0;
function Songtime(delta) {
  countUpValue = Music.currentTime;
}

addEventListener("DOMContentLoaded", init);


function startMusic() {
  if (playing == true) {

    Music.currentTime = 0;
    Music.volume = 0.5;

    Music.play()

    placementFirstNotes();

  }
}


const getkey = {
  "s": 0,
  "d": 1,
  "f": 2,
  "j": 3,
  "k": 4,
};

addEventListener("keydown", function (e) {
  SE.currentTime = 0;
  SE.play();

  if (playing == false) {
    playing = true;
    console.log("再生！");
    startMusic();
  }
  if (playing) {
    notes.forEach(note => {
      if (note.y + NOTE_HEIGHT >= NOTE_GOOD_TOP && NOTE_GOOD_BOTTOM >= note.y && note.lane == getkey[e.key]) {
        score += 100;

        do {
          typed.letter += HIT_ADD_PROGRAM_LINE;
          if (typed.letter >= program[typed.line].length) {
            typed.line++;
            typed.letter = 0;
          }
          if (typed.line > program.length) {
            typed.line = 0;
            typed.letter = 0;
          }
        } while (program[typed.line] === "" || program[typed.line][typed.letter] === " ");

        particles.push({
          x: LEFT_OFFSET + getkey[e.key] * NOTE_WIDTH + NOTE_WIDTH / 2,
          y: NOTE_GOOD_TOP + NOTE_GOOD_HALF,
          life: 1
        });
      }
    });
    notes = notes.filter(note => {
      const 範囲外 = note.y + NOTE_HEIGHT < NOTE_GOOD_TOP || NOTE_GOOD_BOTTOM < note.y;
      const 入力キーが違う = note.lane != getkey[e.key];
      return 範囲外 || 入力キーが違う;
    })
  }
});

let lastTime = null;
function tick(time) {

  const delta = lastTime == null ? 0 : (time - lastTime) / 1000;
  lastTime = time;
  update(delta);
  render();

  requestAnimationFrame(tick);
}

//CSVファイルを読み込む関数getCSV()の定義
function getCSV() {
  const fetchPromise = fetch("notedata.csv");
  const thenPromise = fetchPromise.then(response => {
    return response.text();
  });
  return thenPromise;
}



function convertCSVtoArray(array) { // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = array.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for (var i = 0; i < tmp.length; ++i) {

    result[i] = tmp[i].split(',');
  }
  return result;
}

function program_response() {
  ctx.font = PROGRAM_FONT;
  return fetch("main.js").then(response => {
    return response.text();
  }).then(text => text.split("\n"))
    .then(lines => lines.flatMap(line =>
      [...line].reduce((p, v) =>
        ctx.measureText((p[p.length - 1] ?? "") + v).width < 1720
          ? [...(p.slice(0, p.length - 1)), (p[p.length - 1] ?? "") + v]
          : [...p, v], [""])
    ));
}
/**
 * 音楽再生開始時のノーツ配置
 */
function placementFirstNotes() {
  let line = 0;
  while (NOTE_GOOD_TOP / noteVelocity >= (60 / bpm / 4 * line)) {
    for (lane = 0; lane <= 4; lane++) {
      if (notearray[line][lane] == 1) {
        notes.push({
          lane: lane,
          y: NOTE_GOOD_TOP - (NOTES_DISTANCE / 4 * line)
        });
      }
    }
    line++;
  }
  nextNoteLine = line;
}


/**
 * 更新
 */
function update(delta) {
  if (playing) {
    Songtime(delta);
    notes.forEach(note => {
      note.y += noteVelocity * delta;
    });
    notes = notes.filter(note => note.y < canvas.height);
    if (countUpValue + (NOTE_GOOD_TOP - NOTE_FIRST_Y + NOTE_GOOD_HALF) / noteVelocity >= (60 / bpm / 4 * nextNoteLine) && notearray.length > nextNoteLine) {
      for (lane = 0; lane <= 4; lane++) {
        if (notearray[nextNoteLine][lane] == 1) {
          notes.push({
            lane: lane,
            y: NOTE_FIRST_Y
          });
        }
      }
      nextNoteLine++;
    }
  }

  // パーティクルの更新
  particles = particles.map(particle => ({
    ...particle,
    life: particle.life - delta * 4
  })).filter(particle => particle.life > 0);
}

/**
 * 描画
 */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "darkred";
  ctx.fillRect(0, NOTE_GOOD_TOP, 1980, NOTE_GOOD_BOTTOM - NOTE_GOOD_TOP);
  ctx.fillStyle = "black";
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 3;
  ctx.font = 'normal 80pt "メイリオ"';
  ctx.strokeStyle = '#f00';
  ctx.fillStyle = "#0005DD";
  ctx.fillText("Score: " + score, 1000, 900);
  //対応しているキーを表示する
  ctx.strokeText('S', 150, 900);
  ctx.strokeText('D', 300, 900);
  ctx.strokeText('F', 450, 900);
  ctx.strokeText('J', 600, 900);
  ctx.strokeText('K', 750, 900);

  if (typed.line >= showStartLine + SHOW_PROGRAM_LINES) {
    showStartLine += SHOW_PROGRAM_LINES;
  }

  ctx.font = PROGRAM_FONT;
  program.slice(showStartLine, typed.line + 1).forEach((line, index) => {
    ctx.fillStyle = "#57f542";
    if (typed.line % SHOW_PROGRAM_LINES === index) {
      // 現在入力中の行
      const showLine = line.substring(0, typed.letter);
      ctx.fillText(showLine, 100, SHOW_PROGRAM_LINE_HEIGHT * index);
    } else {
      // 入力済みの行
      ctx.fillText(line, 100, SHOW_PROGRAM_LINE_HEIGHT * index);
    }
  });

  notes.forEach(note => {
    // 例えば fillRect で描く場合
    if (NOTE_GOOD_TOP <= note.y + NOTE_HEIGHT && note.y <= NOTE_GOOD_BOTTOM) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.fillRect(
      LEFT_OFFSET + note.lane * NOTE_WIDTH, // X座標
      note.y, // Y座標
      NOTE_WIDTH, NOTE_HEIGHT);
  });

  // プレイ開始前の説明表示
  if (playing === false) {
    ctx.font = 'normal 60pt "メイリオ"';
    ctx.fillStyle = "white";
    ctx.fillText("PRESS ANY KEY TO START", 100, 600);
  }

  // パーティクルの表示
  
  ctx.strokeStyle = "white";
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.lineWidth = 30;
    ctx.globalAlpha = particle.life;
    ctx.arc(particle.x, particle.y, (1 - particle.life) * 100, 0, Math.PI * 2);
    ctx.stroke();
  })
  ctx.globalAlpha = 1;
}
