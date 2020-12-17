let notes = []; // ノーツを管理する配列

let canvas;
let ctx;

const LEFT_OFFSET = 100;
const NOTE_FIRST_Y = -30;
const NOTE_WIDTH = 150; // ノーツの横幅
const NOTE_HEIGHT = 50; // ノーツの高さ
const NOTES_DISTANCE = 120;
const NOTE_GOOD_TOP = 750;
const NOTE_GOOD_BOTTOM = 846;

let notearray;

let playing = false;

let nextNoteLine = 0;

let score = 0;

const Music = new Audio();

let bpm = 115;
let noteVelocity = NOTES_DISTANCE / (60 / bpm);

//対応しているキーがどこのキーなのかを表示する。
//document.write("D");



function init() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  document.body.appendChild(Music);
  Music.preload = "auto";
  Music.src = "./nitizyou.wav"
  Music.load();
  getCSV(function () {
    tick();

  });
}

//window.addEventListener("DOMContentLoaded", init);

var countUpValue = 0;
function Songtime(delta) {
  // countUpValue += delta;
  countUpValue = Music.currentTime;
}

addEventListener("DOMContentLoaded", init);


function startMusic() {
  if (playing == true) {

    Music.currentTime = 0;

    Music.play()

    placementFirstNotes();

  }
}


const getkey = {
  "d": 0,
  "f": 1,
  "g": 2,
  "h": 3,
  "j": 4,
};

addEventListener("keydown", function (e) {

  if (playing == false) {
    playing = true;
    console.log("再生！");
    startMusic();
  }
  if (playing) {
    notes = notes.filter(note => {
      const 範囲外 = note.y < NOTE_GOOD_TOP || NOTE_GOOD_BOTTOM < note.y;
      const 入力キーが違う = note.lane != getkey[e.key];
      if (note.y >= NOTE_GOOD_TOP && NOTE_GOOD_BOTTOM >= note.y && note.lane == getkey[e.key]) {
        score += 100;
      }
      return 範囲外 || 入力キーが違う;
    })



    /*
    if (notes[0].y <= NOTE_GOOD_BOTTOM && notes[0].y >= NOTE_GOOD_TOP && notes[0].lane == getkey[e.key]) {
      console.log("パーフェクト！");
      notes = notes.filter((note, index) => index != 0);
    }
    */
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
function getCSV(onload) {
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", "notedata.csv", true); // アクセスするファイルを指定
  req.send(); // HTTPリクエストの発行
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onreadystatechange = function () {
    if (req.status == 200 && req.readyState == XMLHttpRequest.DONE) {
      notearray = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
      onload();
    }
  }
}

function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for (var i = 0; i < tmp.length; ++i) {

    result[i] = tmp[i].split(',');
  }
  return result;
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
    if (countUpValue + NOTE_GOOD_TOP / noteVelocity >= (60 / bpm / 4 * nextNoteLine) - 0.25 && notearray.length > nextNoteLine) {
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
  ctx.fillText("Score: " + score, 1000, 1000);
  //対応しているキーを表示する
  ctx.strokeText('D', 150, 1000);
  ctx.strokeText('F', 300, 1000);
  ctx.strokeText('G', 450, 1000);
  ctx.strokeText('H', 600, 1000);
  ctx.strokeText('J', 750, 1000);
  notes.forEach(note => {
    // 例えば fillRect で描く場合
    if (NOTE_GOOD_TOP <= note.y && note.y <= NOTE_GOOD_BOTTOM) {
      ctx.fillStyle = "blue";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.fillRect(
      LEFT_OFFSET + note.lane * NOTE_WIDTH, // X座標
      note.y, // Y座標
      NOTE_WIDTH, NOTE_HEIGHT);
  });
}

