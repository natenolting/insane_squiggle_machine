import "./p5.min.js";

const COLOR = new Colors();
const HELPER = new Helpers();

function mapScale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const CONFIG = {
    noiseSeed: fxrand() * 999999,
    randomSeed: fxrand() * 999999,
    pallet: Math.floor(mapScale(fxrand(), 0, 1, 0, 4257)),
    density: fxrand(),
};

let palletData;
let pallets = [];
let pallet = {};
let cg;
let cells;
let columns = 1;
let rows = 1;
let cellWidth = 100;
let cellHeight = 100;

function setupPallet() {

  pallet.h = pallets[CONFIG.pallet];
  pallet.i = CONFIG.pallet;
  pallet.rgb = [];
  pallet.hsl = [];
  let colorAverages = [];
  for (const element of pallet.h) {
      pallet.rgb.push(COLOR.HEXtoRGB(element));
      let rgb = pallet.rgb[pallet.rgb.length - 1];
      colorAverages.push(HELPER.mean(rgb))
      pallet.hsl.push(COLOR.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }

}

function init() {
  pallets = palletData.pallets;
  setupPosition();
  setupPallet();
  prepCells();
}
const POS = {};
const ENLARGED_CANVAS_WIDTH = 2048;
const ENLARGED_CANVAS_HEIGHT = 2048;
const CANVAS_WIDTH_MULTIPLIER = 1
const CANVAS_HEIGHT_MULTIPLIER = 1
function setupPosition() {
    let cW = window.innerWidth;
    let cH = window.innerHeight;

    if (cW > cH) {
        POS.cW = cH;
        POS.cH = cH;
    } else {
        POS.cW = cW;
        POS.cH = cW;
    }

    let w = ENLARGED_CANVAS_WIDTH;
    let h = ENLARGED_CANVAS_HEIGHT;
    if (w > h) {
        POS.w = h;
        POS.h = h;
    } else {
        POS.w = w;
        POS.h = w;
    }
    POS.w = w * CANVAS_WIDTH_MULTIPLIER;
    POS.h = h * CANVAS_HEIGHT_MULTIPLIER;
}

function prepCells() {
  let rowColDiv =  map(CONFIG.density, 0, 1, POS.w/15, POS.w/2.5);
  // if(CONFIG.density > 0.2) {
  //   rowColDiv = map(CONFIG.density, 0, 1, 100, 200);
  // } else if (CONFIG.density <= 0.2 && CONFIG.density > 0.4) {
  //   rowColDiv = map(CONFIG.density, 0, 1, 200, 300);
  // } else if (CONFIG.density <= 0.4 && CONFIG.density > 0.6) {
  //   rowColDiv = map(CONFIG.density, 0, 1, 250, 300);
  // } else if (CONFIG.density <= 0.6 && CONFIG.density > 0.8) {
  //   rowColDiv = map(CONFIG.density, 0, 1, 350, 400);
  // } else if(CONFIG.density >= 0.8) {
  //   rowColDiv = map(CONFIG.density, 0, 1, 450, 500);
  // }

  columns = Math.floor(POS.w / rowColDiv);
  rows = Math.floor(POS.h / rowColDiv);
  cellWidth = POS.w / columns;
  cellHeight = POS.h / rows;
  cells = (new Cells(columns, rows, cellWidth, cellHeight)).populateCells()[0];
}

window.preload = () => {
  palletData = loadJSON("./palettes.json");

}

window.$fxhashFeatures = {
    ...CONFIG,
};

window.setup = () => {
    init();
    pixelDensity(1);
    colorMode(RGB, 255, 255, 255, 1);
    createCanvas(POS.cW, POS.cH);
    noiseSeed(CONFIG.noiseSeed);
    randomSeed(CONFIG.randomSeed);
};

window.windowResized = () => {
    // clear();
    // init();
};

window.draw = () => {
    noLoop();
    //console.log(CONFIG, pallet, POS);
    cg = createGraphics(POS.w, POS.h);
    cg.colorMode(RGB, 255, 255, 255, 1);
    cg.fill(255, 255, 255, 1);
    cg.noStroke();
    cg.rect(0, 0, POS.w, POS.h);
    let rColor;
    let p = cells[HELPER.rollADie(cells.length) - 1];
    let pv = createVector(p.cX,p.cY);
    cg.blendMode(BLEND);
    for (var i = 0; i < cells.length; i++) {
      let c = cells[i];
      rColor = pallet.rgb[HELPER.rollADie(pallet.rgb.length) - 1];
      let rcAverage = HELPER.mean(rColor);
      let lerpPerc = map(rcAverage/255, 0, 1, 0, .75);

      cg.strokeWeight(floor(map(CONFIG.density, 0, 1, 1, 5)));
      cg.strokeCap(SQUARE);

      let v1 = createVector(c.x, c.y);
      let v1p = p5.Vector.lerp(v1, pv, lerpPerc)
      let v2 = createVector(c.x + c.w, c.y);
      let v2p = p5.Vector.lerp(v2, pv, lerpPerc)
      let v3 = createVector(c.x + c.w, c.y + c.h);
      let v3p = p5.Vector.lerp(v3, pv, lerpPerc)
      let v4 = createVector(c.x, c.y + c.h);
      let v4p = p5.Vector.lerp(v4, pv, lerpPerc)
      let lineGap = map(CONFIG.density, 0, 1, 0.05, 0.1);
      cg.blendMode(BLEND);
      cg.fill(rColor[0], rColor[1], rColor[2], 1);
      //cg.stroke(rColor[0], rColor[1], rColor[2], 1);
      cg.beginShape();
      cg.vertex(v1.x,v1.y);
      cg.vertex(v2.x,v2.y);
      cg.vertex(v3.x,v3.y);
      cg.vertex(v4.x,v4.y);
      cg.vertex(v1.x,v1.y);
      cg.endShape(CLOSE)

      cg.stroke(rColor[0] * 1.1, rColor[1] * 1.1, rColor[2] * 1.1, 1);
      for (var l = 0; l <= 1; l+=lineGap) {
        let p1 = p5.Vector.lerp(v1, v2, l);
        let p2 = p5.Vector.lerp(v4, v3, l);
        cg.line(p1.x, p1.y, p2.x, p2.y);
      }
      cg.noStroke();


      cg.fill(rColor[0] * .3, rColor[1] * .3, rColor[2] * .3, 1);
      //cg.stroke(rColor[0] * .3, rColor[1] * .3, rColor[2] * .3, 1);
      cg.beginShape();
      cg.vertex(v1.x, v1.y);
      cg.vertex(v1p.x, v1p.y);
      cg.vertex(v2p.x, v2p.y);
      cg.vertex(v2.x, v2.y);
      cg.vertex(v1.x, v1.y);
      cg.endShape(CLOSE);

      cg.stroke(rColor[0] * .4, rColor[1] * .4, rColor[2] * .4, 1);
      for (var l = 0; l <= 1; l+=lineGap) {
        let p1 = p5.Vector.lerp(v1p, v2p, l);
        let p2 = p5.Vector.lerp(v1, v2, l);
        cg.line(p1.x, p1.y, p2.x, p2.y);
      }
      cg.noStroke();

      cg.fill(rColor[0] * .6, rColor[1] * .6, rColor[2] * .6, 1);
      //cg.stroke(rColor[0] * .6, rColor[1] * .6, rColor[2] * .6, 1);
      cg.beginShape();
      cg.vertex(v2.x, v2.y);
      cg.vertex(v2p.x, v2p.y);
      cg.vertex(v3p.x, v3p.y);
      cg.vertex(v3.x, v3.y);
      cg.vertex(v2.x, v2.y);
      cg.endShape(CLOSE);

      cg.stroke(rColor[0] * .7, rColor[1] * .7, rColor[2] * .7, 1);
      for (var l = 0; l <= 1; l+=lineGap) {
        let p1 = p5.Vector.lerp(v2p, v3p, l);
        let p2 = p5.Vector.lerp(v2, v3, l);
        cg.line(p1.x, p1.y, p2.x, p2.y);
      }
      cg.noStroke();

      cg.fill(rColor[0] * .9, rColor[1] * .9, rColor[2] * .9, 1);
      //cg.stroke(rColor[0] * .9, rColor[1] * .9, rColor[2] * .9, 1);
      cg.beginShape();
      cg.vertex(v3.x, v3.y);
      cg.vertex(v3p.x, v3p.y);
      cg.vertex(v4p.x, v4p.y);
      cg.vertex(v4.x, v4.y);
      cg.vertex(v3.x, v3.y);
      cg.endShape(CLOSE);

      cg.stroke(rColor[0] * 1, rColor[1] * 1, rColor[2] * 1, 1);
      for (var l = 0; l <= 1; l+=lineGap) {
        let p1 = p5.Vector.lerp(v3p, v4p, l);
        let p2 = p5.Vector.lerp(v3, v4, l);
        cg.line(p1.x, p1.y, p2.x, p2.y);
      }
      cg.noStroke();

      cg.fill(rColor[0] * 1.2, rColor[1] * 1.2, rColor[2] * 1.2, 1);
      //cg.stroke(rColor[0] * 1.2, rColor[1] * 1.2, rColor[2] * 1.2, 1);
      cg.beginShape();
      cg.vertex(v4.x, v4.y);
      cg.vertex(v4p.x, v4p.y);
      cg.vertex(v1p.x, v1p.y);
      cg.vertex(v1.x, v1.y);
      cg.vertex(v4.x, v4.y);
      cg.endShape(CLOSE);

      cg.stroke(rColor[0] * 1.3, rColor[1] * 1.3, rColor[2] * 1.3, 1);
      for (var l = 0; l <= 1; l+=lineGap) {
        let p1 = p5.Vector.lerp(v4p, v1p, l);
        let p2 = p5.Vector.lerp(v4, v1, l);
        cg.line(p1.x, p1.y, p2.x, p2.y);
      }
      cg.noStroke();



    }
    let dots = [];
    for (let x = 0; x < cg.width; x++) {
    for (let y = 0; y < cg.height; y++) {
      if(HELPER.rollADie(15) === 15) {
        dots.push(createVector(x,y));
      }
    }
  }
  cg.blendMode(OVERLAY);

  cg.noFill();
  for (var i = 0; i < dots.length; i++) {
    let dot = dots[i];
    cg.strokeWeight(1);
    if(HELPER.flipACoin()) {
        cg.stroke(0, 0, 0, 1);
    } else {
        cg.stroke(255, 255, 255, 1);
    }
    cg.point(dot.x, dot.y);
  }

    // cg.fill(0,0,0,1);
    // cg.ellipse(p.cX, p.cY, p.w/2, p.h/2);
    //
    // // shape
    // let cgs = createGraphics(100, 300);
    // // mask
    // let cgm = createGraphics(100, 300);
    // cgs.colorMode(RGB, 255, 255, 255, 1);
    // cgm.colorMode(RGB, 255, 255, 255, 1);
    // cgs.fill(rColor[0], rColor[1], rColor[2], 1);
    // cgs.noStroke();
    // cgs.ellipse(cgs.width/2, cgs.height/2, cgs.width, cgs.height);
    // cgs.loadPixels();
    // cgm.loadPixels();
    // for (let x = 0; x < cgs.width; x++) {
    //   for (let y = 0; y < cgs.height; y++) {
    //     let index = (x + y * cgs.width) * 4;
    //     cgm.pixels[index] = 255;
    //     cgm.pixels[index + 1] = 255;
    //     cgm.pixels[index + 2] = 255;
    //     cgm.pixels[index + 3] = cgs.pixels[index + 3];
    //   }
    // }
    // cgm.updatePixels();
    //
    // cgs.rect(0,0,cgs.width, cgs.height);
    // let masked;
    // ( masked = cgs.get() ).mask(cgm);
    //
    //
    // cg.image(masked, 100, 100, cgs.width, cgs.height);

    image(cg, 0, 0, POS.cW, POS.cH);
    fxpreview();
}

let saveCount = 0;
let saveId = HELPER.makeid(10);

function saveFileName() {
    let fileName;
    fileName = `${saveId}_${saveCount}.png`;
    saveCount++;
    return fileName;
}

window.keyPressed = () => {

    if (key === "s") {
        save(saveFileName());
    }
}
