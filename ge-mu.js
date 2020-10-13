let x = 0;

const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');

function notu() {
    

    //ctx.strokeRect(0,0,80,80);
   // ctx.fillRect(100,0,80,80);
   ctx.clearRect(0,0,canvas.width,canvas.height);
    

   

    document.body.appendChild(canvas);

    draw();
}



function draw() {

    ctx.fillRect(x++,50, 100, 100);

    window.requestAnimationFrame(draw); 

    
}
