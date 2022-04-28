const helper = new Helpers();
let palletData;
let settingsData;
let cols;
let rows;
let cW;
let cH;
let canvasWidth;
let canvasHeight;
let margin;
let cyan;
let magenta;
let yellow;
let black;
let absCenter;
let baseOpacity;

let saveId = helper.makeid(10);
let saveCount = 0;

function preload() {
    palletData = loadJSON("../../data/palettes.json");
    settingsData = loadJSON("./settings.json");
}

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  pallets = palletData.palettes;
  settings = settingsData.settings;
  cols = settings.columns;
  rows = settings.rows;
  cW = settings.cellWidth;
  cH = settings.cellHeight;
  canvasWidth = cols * cW;
  canvasHeight = rows * cH;
  absCenter = {x: canvasWidth / 2, y: canvasHeight / 2 }
  margin = settings.margin;
  createCanvas(canvasWidth, canvasHeight);
  pixelDensity(settings.pixelDensity);
  cyan =    {r: 0, g: 174, b: 239};
  magenta = {r: 236, g: 0, b: 140};
  yellow =  {r: 255, g: 242, b: 0};
  black =   {r: 0, g: 0, b: 5};
  baseOpacity = settings.baseOpacity;

}

function doDots(ell, i) {
  let maxDots = 25000 / (i + 1);
  for (let j = 0; j < maxDots; j++) {
    let dt = {
      x: random(ell.x - ell.w / 2, ell.x + ell.w / 2),
      y: random(ell.y - ell.h / 2, ell.y + ell.h / 2)
    };
    if(dist(ell.x, ell.y, dt.x, dt.y) > dist(ell.x, ell.y, ell.x - ell.w / 2, ell.y)) {
      continue;
    }
    ellipse(dt.x, dt.y, 2, 2);

  }
}

function doDotsAndEllipse(ell, i, c) {
  fill(c.r, c.g, c.b, baseOpacity * i * 2);
  doDots(ell, i);
  fill(c.r, c.g, c.b, baseOpacity * i);
  ellipse(ell.x, ell.y, ell.w, ell.h);
}


function draw() {
  noLoop();
  noStroke();
  fill(255, 255, 255, 1);
  rect(0,0,canvasWidth, canvasHeight);

  for (let i = 0; i < 1000; i++) {
    noStroke();
    let ell = {
      x: absCenter.x ,
      y: absCenter.y + cH * i,
      w: canvasWidth - (cW * (2 + 2 * i)) - cW * margin,
      h: canvasHeight - (cH * (2 + 2 * i)) - cH * margin
    };
    if (ell.y > canvasHeight - margin * cH  || baseOpacity * i >= 1) {
      break;
    }
    doDotsAndEllipse(ell, i, black);
  }

  for (let i = 0; i < 1000; i++) {
    noStroke();
    let ell = {
      x: absCenter.x - cW * i ,
      y: absCenter.y ,
      w: canvasWidth - (cW * (2 + 2 * i)) - cW * margin,
      h: canvasHeight - (cH * (2 + 2 * i)) - cH * margin
    };
    if (ell.x < margin * cH  || baseOpacity * i >= 1) {
      break;
    }
    doDotsAndEllipse(ell, i, yellow);
  }

  for (let i = 0; i < 1000; i++) {
    noStroke();
    let ell = {
      x: absCenter.x + cW * i ,
      y: absCenter.y ,
      w: canvasWidth - (cW * (2 + 2 * i)) - cW * margin,
      h: canvasHeight - (cH * (2 + 2 * i)) - cH * margin
    };
    if (ell.x > canvasWidth - margin * cH  || baseOpacity * i >= 1) {
      break;
    }
    doDotsAndEllipse(ell, i, magenta);
  }

  for (let i = 0; i < 1000; i++) {

    noStroke();
    let ell = {
      x: absCenter.x ,
      y: absCenter.y - cH * i,
      w: canvasWidth - (cW * (2 + 2 * i)) - cW * margin,
      h: canvasHeight - (cH * (2 + 2 * i)) - cH * margin
    };
    if (ell.y < margin * cH  || baseOpacity * i >= 1) {
      break;
    }

    doDotsAndEllipse(ell, i, cyan);
  }
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === 'Enter') {
    for (const item of cells) {
      item.used = false;
    }

    for (const item of extraLargeCells) {
      item.used = false;
    }

    redraw();
  }
  if (key === 's') {
    save(saveFileName());
  }
  if (key === "g") {
    // generate stack of images
    for (let i = 0; i < 10; i++) {
      clear();
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
