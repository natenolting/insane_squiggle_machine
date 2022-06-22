// 8x10 2400 X 3000"
// 9x16 3840 X 2160 @200%
const PROJECT_WIDTH = 3000;
const PROJECT_HEIGHT = 3000;
const DO_MARGIN = false;
const MARGIN = PROJECT_WIDTH * .04;
const HELPER = new Helpers();
const COLORS = new Colors();
const TRANSFORM = new Transform();
const BW_OR_MONO = fxrand();


const CONFIG = {
    noiseSeed: (fxrand() * 100_000) >> 0,

    rainbow: BW_OR_MONO >.15 && BW_OR_MONO < .16 ? true : false,

    /** is this monochrome? **/
    monochrome: BW_OR_MONO < .05 ? true : false,
};

window.$fxhashFeatures = {
    ...CONFIG,
};

const pos = {
    /** width */
    w: null,
    /** height */
    h: null,
    /** canvas width */
    cW: null,
    /** canvas height */
    cH: null,
};

function setupPosition() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w > h) {
      pos.cW = h;
      pos.cH = h;
  } else {
    pos.cW = w;
    pos.cH = w;
  }

  pos.w = PROJECT_WIDTH;
  pos.h = PROJECT_HEIGHT;
}

let colors = [];
let saveId = HELPER.makeid(10);
let saveCount = 0;
let squiggles = [];
let palletData;
let pallets;
let hexColors;
let cells;
let cg;
let lastImageIndex = null;
let lastColorIndex = null;
const pallet = {
    // pallet index
    i: null,
    // pallet hex colors
    h: [],
    // pallet rgb colors
    rgb: [],
    // pallet hsl colors
    hsl: [],
}

function setupPallet() {
  // setup colors
  let pallets = palletData.pallets;

  if (CONFIG.rainbow) {
      pallet.i = 0;
      pallet.h = ['ff0000', 'ffa500', 'ffff00', '008000', '0000ff', '4b0082', 'ee82ee'];
    setupPalletRGAndHSL();
    return;
  }

  pallet.i = floor(map(fxrand(), 0, 1, 0, pallets.length - 1));
  pallet.h = pallets[pallet.i];
  setupPalletRGAndHSL();

  if(CONFIG.monochrome) {
    let randColor = floor(map(fxrand(), 0, 1, 0, pallet.h.length));
    let randHSL = {h: pallet.hsl[randColor].h, s: pallet.hsl[randColor].s, l: pallet.hsl[randColor].l}

    pallet.h = [
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 15),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 35),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 55),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 75),
      COLORS.HSLtoHEX(randHSL.h, randHSL.s, 95),
    ];
    setupPalletRGAndHSL();
  }
  return;

}

function setupPalletRGAndHSL(){
  pallet.rgb = [];
  pallet.hsl = [];
  for (var i = 0; i < pallet.h.length; i++) {
      let h = pallet.h[i];
      pallet.rgb.push(COLORS.HEXtoRGB(h));
      let rgb = pallet.rgb[pallet.rgb.length - 1];
      pallet.hsl.push(COLORS.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

window.preload = () => {

  palletData = loadJSON("./data/palettes.json");

}

window.setup = () => {
  setupPosition();
  pallets = palletData.pallets
  setupPallet();
  createCanvas(pos.cW, pos.cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
  noiseSeed(CONFIG.noiseSeed);
  cg = createGraphics(pos.w - (DO_MARGIN ? MARGIN * 2 : 0), pos.h - (DO_MARGIN ? MARGIN * 2 : 0));
  if (DO_MARGIN) {
    cg.translate(MARGIN, MARGIN);
  }
  cg.colorMode(HSL, 359, 100, 100, 100);
  TRANSFORM.cg = cg;
}

window.windowResized = () => {}

function buildInitialCells(w, h) {
  let rows = [];
  let cells = [];
  let rowsTotalHeight = 0;
  let rowsIndex = 0;
  while(rowsTotalHeight < h) {
    let currentRowHeight = fxrand() * map(fxrand(), 0, 1, h * .125, h);
    rows.push({i: rowsIndex, h: currentRowHeight});
    rowsTotalHeight += currentRowHeight;
    rowsIndex++;
  }

  if (rowsTotalHeight > h) {
      rows[rows.length - 1].h = rows[rows.length - 1].h - (rowsTotalHeight - h)
  }

  let rowY = 0;
  for (var i = 0; i < rows.length; i++) {
    let totalColumnWidth = 0;
    let columnIndex = 0;
    while (totalColumnWidth < w) {
      let currentColumnWidth = fxrand() * map(fxrand(), 0, 1, w * .125, w);
      cells.push(new Cell(i, columnIndex, totalColumnWidth, rowY, currentColumnWidth, rows[i].h));
      totalColumnWidth += currentColumnWidth;
      columnIndex++;
    }
    if (totalColumnWidth > w) {
        cells[cells.length - 1].w = cells[cells.length - 1].w - (totalColumnWidth - w)
    }

    rowY += rows[i].h;
  }

  return cells
}

function buildCells(lcg) {
  for (var l = 0; l < 3; l++) {
  let cells = buildInitialCells(PROJECT_WIDTH, PROJECT_HEIGHT);
  for (var i = 0; i < cells.length; i++) {
    c = cells[i];
    let subColumns = floor(map(fxrand(), 0, 1, 3, 10));
    let subRows = floor(map(fxrand(), 0, 1, 3, 10));
    let subcells = (new Cells(
      subColumns,
      subRows,
      c.w / subColumns,
      c.h / subRows
    )).populateCells(false)[0];
    for (var s = 0; s < subcells.length; s++) {
      let sc = subcells[s];
      let subSubColumns = floor(map(fxrand(), 0, 1, 3, 10));
      let subSubRows = floor(map(fxrand(), 0, 1, 3, 10));
      let subSubCells = (new Cells(
        subSubColumns,
        subSubRows,
        sc.w / subSubColumns,
        sc.h / subSubRows
      )).populateCells(false)[0];

      for (var b = 0; b < subSubCells.length; b++) {
        ssc = subSubCells[b];
        if (HELPER.rollADie(6) === 6) {
          lcg.blendMode(OVERLAY);
          lcg.fill(0, 0, map(l, 0, 2, 0, 100), map(fxrand(), 0, 1, 45, 90));
          lcg.strokeWeight(.25);
          lcg.rect(ssc.x + sc.x + c.x, ssc.y + sc.y + c.y, ssc.w, ssc.h, HELPER.mean([ssc.w, ssc.h])/32);

        }
      }
    }
  }
}
}

window.draw = () => {
  noLoop();
  doBackground(cg);
  let randColors = HELPER.shuffleArray(pallet.hsl);

  // ------------
  // Loop 1
  cg.blendMode(BLEND);
  cg.fill(randColors[0].h, randColors[0].s, randColors[0].l, map(fxrand(), 0, 1, 50, 100));
  cg.ellipse(
    map(fxrand(), 0, 1, 0, cg.width),
    map(fxrand(), 0, 1, 0, cg.height),
    map(fxrand(), 0, 1, cg.width, cg.width * 1.5),
  );
  buildCells(cg);

  // ------------
  // Loop 2
  cg.blendMode(BLEND);
  cg.fill(randColors[1].h, randColors[1].s, randColors[1].l, map(fxrand(), 0, 1, 15, 30));
  cg.ellipse(
    map(fxrand(), 0, 1, 0, cg.width),
    map(fxrand(), 0, 1, 0, cg.height),
    map(fxrand(), 0, 1, cg.width/2, cg.width * 1.25),
  );
  cg.push();

  // ------------
  // Loop 3
  cg.blendMode(BLEND);
  cg.fill(randColors[2].h, randColors[2].s, randColors[2].l, map(fxrand(), 0, 1, 15, 30));
  cg.ellipse(
    map(fxrand(), 0, 1, 0, cg.width),
    map(fxrand(), 0, 1, 0, cg.height),
    map(fxrand(), 0, 1, cg.width/3, cg.width * .75),
  );
  cg.rotate(radians(90));
  cg.translate(0, -PROJECT_HEIGHT);
  buildCells(cg);
  cg.pop();

  // ------------
  // Loop 4
  cg.blendMode(OVERLAY);
  cg.fill(randColors[3].h, randColors[3].s, randColors[3].l, map(fxrand(), 0, 1, 15, 30));
  cg.ellipse(
    map(fxrand(), 0, 1, 0, cg.width),
    map(fxrand(), 0, 1, 0, cg.height),
    map(fxrand(), 0, 1, cg.width/4, cg.width * .75),
  );
  buildCells(cg);
  cg.push();
  cg.rotate(radians(90));
  cg.translate(0, -PROJECT_HEIGHT);
  buildCells(cg);
  cg.pop();


  image(cg, 0, 0, pos.cW, pos.cH);
}

function doBackground(lcg) {
  lcg.background(0, 0, 100, 100);
  let randColors = HELPER.shuffleArray(pallet.hsl);
  let bgColor1 = color(randColors[0].h, randColors[0].s, randColors[0].l, 100);
  let bgColor2 = color(randColors[1].h, randColors[1].s, randColors[1].l, 100);
  // give the canvas a muted background
  for (var i = 1; i <= cg.height; i++) {
    let lerpAmount = i/cg.height;
    let bgColor3 = lerpColor(bgColor1, bgColor2, lerpAmount);
    lcg.stroke(bgColor3);
    lcg.strokeWeight(1);
    lcg.noFill()
    lcg.line(0, i, cg.width, i);
    lcg.noStroke();

  }
}

function getRandPalletIndex(rand = null) {
  if (!rand) {
    rand = fxrand();
  }
  return floor(map(rand, 0, 1, 0, pallet.hsl.length));
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.jpg`;
  saveCount++;
  return fileName;
}

function keyPressed() {

  if (key === 's') {
    save(saveFileName());
  }
  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
        clear();
        redraw();
        save(saveFileName());
    }

    return false;
  }
}
