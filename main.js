let notes = []; // ノーツを管理する配列

let canvas;
let ctx;

const LEFT_OFFSET = 100;
const TOP_OFFSET = 30;
const NOTE_WIDTH = 150; // ノーツの横幅
const NOTE_HEIGHT = 50; // ノーツの高さ
const NOTE_SCREEN_HEIGHT = 800; // ノーツを表示する領域の高さ



let notearray ;

let nextNoteLine = 0;


function init() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    getCSV(function (){
        tick();
      });
}

window.addEventListener("DOMContentLoaded", init);

var countUpValue = 0;
function Songtime(delta){
  countUpValue += delta;
}

addEventListener("DOMContentLoaded", init);

let lastTime = null;
function tick(time) {
  
    const delta = lastTime == null ? 0 : (time - lastTime) / 1000;
    lastTime = time;
    update(delta);
    render();
    
    requestAnimationFrame(tick);
}

//CSVファイルを読み込む関数getCSV()の定義
function getCSV(onload){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", "notedata.csv", true); // アクセスするファイルを指定
  req.send(); // HTTPリクエストの発行
 // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
 req.onreadystatechange = function(){
   if(req.status == 200 && req.readyState == XMLHttpRequest.DONE){
  notearray = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
  onload();
   }
  }
}

function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for(var i=0;i<tmp.length;++i){
   
      result[i] = tmp[i].split(',');
    }
  return result;
}


/**
 * 更新
 */
function update(delta) {
  Songtime(delta);
  notes.forEach(note => {
    note.progress += (60 / 0.5) * delta / NOTE_SCREEN_HEIGHT;
  });
  notes = notes.filter(note => note.progress < 1.0);
  if(countUpValue >= 60 / 60 / 4 * nextNoteLine && notearray.length > nextNoteLine){
    for(j = 0; j <= 4; j++){
      if(notearray[nextNoteLine][j] == 1){
        notes.push({
          lane: j,
          progress: 0
        });
      }
    }
    nextNoteLine++;
  }
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

