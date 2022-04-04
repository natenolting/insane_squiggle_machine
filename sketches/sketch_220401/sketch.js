const helper = new Helpers();
let margin = 25;
let data;
let canvasWidth = window.innerHeight - margin;
let canvasHeight = window.innerHeight - margin;
let cols = 5;
let rows = 5;
let cw = canvasWidth / cols;
let ch = canvasHeight / rows;
let cells = (new Cells(cols, rows, cw, ch)).populateCells()[0];
let saveId = helper.makeid(10);
let saveCount = 0;
let g, mk, gc;


function preload() {
    data = loadJSON("../../data/palettes.json");


}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    colorMode(HSL, 359, 100, 100, 100);

}

function draw() {
    noLoop();
    background(0, 0, 100, 100);
    fill(0, 0, 100, 100);
    noStroke();
    //rect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < cells.length; i++) {
        let c = cells[i];
        stroke(0, 0, 0, 100);

        // g = createGraphics(canvasWidth, canvasHeight);
        // g.noFill();
        // g.translate(c.cX,c.cY);
        // for (var i = 0; i < 100; i++) {
        //   var circleX = random(2, 50);
        //   var circleY = random(2, 50);
        //   g.ellipse(circleX, circleY, c.w, c.h);
        // }
        // mk = createGraphics(canvasWidth, canvasHeight);
        // mk.translate(c.x, c.y);
        // mk.rect(0,0,c.w, c.h);
        // gc = g.get();
        // gc.mask(mk.get());
        // image(gc, 0,0);
        // mk.remove();
        // g.remove();
        ellipse(c.cX, c.cY, 10)
    };


}

function saveFileName() {
    let fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

function keyPressed() {
    if (key === "r") {
        window.location.reload(false);
    }

    if (key === "Enter") {
        clear();
        redraw();
    }

    if (key === "s") {
        save(saveFileName());
    }

    if (key === "g") {
        // generate stack of images
        for (var i = 0; i < 10; i++) {
            clear();
            redraw();
            save(saveFileName());
        }

        return false;
    }
}

// https://editor.p5js.org/kirkjerk/sketches/qyfoMaVt0
// dir is a number between -1 and 1 inclusive
// indicating placement of circle relative to center
function makeMaskedImage(img, dir){
      const circleMask = createGraphics(img.width,img.height);
  // fill a soft mask so we see the whole frame,
  // for educational purposes
    circleMask.fill('rgba(0, 0, 0, 0)');
    circleMask.rect(0,0,img.width,img.height);

    const sz = min(img.width,img.height);
    const wRatio = img.width/sz;
    const hRatio = img.height/sz;

  //hard circle mask
    circleMask.fill('rgba(0, 0, 0, 1)');
    circleMask.circle(
        (sz * wRatio) / 2 + (dir * ((sz  * wRatio - sz)/2))        ,
        (sz * hRatio) / 2 + (dir * ((sz  * hRatio - sz)/2))        ,
    sz);
    img.mask(circleMask);
  return {img, wRatio, hRatio, dir};
}

//https://editor.p5js.org/kirkjerk/sketches/qyfoMaVt0
function drawMaskedImage(maskedImg, cx, cy, sz ){
    const {img, wRatio, hRatio, dir} = maskedImg;
    const trueWidth = sz * wRatio;
    const trueHeight =  sz * hRatio;
    const xCenter = cx - (trueWidth/2);
    const yCenter = cy - (trueHeight/2)

    const xWiggle = ((trueWidth - sz) / 2) * dir;
    const yWiggle = ((trueHeight - sz) / 2) * dir;
    image(img,xCenter - xWiggle,yCenter - yWiggle,trueWidth,trueHeight);
}
