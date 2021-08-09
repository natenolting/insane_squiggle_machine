
let cols = 6;
let rows = 8;
let cW = 100;
let cH = 100;
let extraLargeChance = 20;
let cells = [];
let extraLargeCells = [];
let pallets = [
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  ["000000","14213d","fca311","e5e5e5","ffffff"],
  ["f72585","b5179e","7209b7","560bad","480ca8","3a0ca3","3f37c9","4361ee","4895ef","4cc9f0"],
  ["003049","d62828","f77f00","fcbf49","eae2b7"],
  ["006d77","83c5be","edf6f9","ffddd2","e29578"],
  ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
  ["f4f1de","e07a5f","3d405b","81b29a","f2cc8f"],
  ["d8f3dc","b7e4c7","95d5b2","74c69d","52b788","40916c","2d6a4f","1b4332","081c15"],
  ["f94144","f3722c","f8961e","f9c74f","90be6d","43aa8b","577590"],
  ["7400b8","6930c3","5e60ce","5390d9","4ea8de","48bfe3","56cfe1","64dfdf","72efdd","80ffdb"],
  ["f94144","f3722c","f8961e","f9c74f","90be6d","43aa8b","577590"],
  ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"],
  ["007f5f","2b9348","55a630","80b918","aacc00","bfd200","d4d700","dddf00","eeef20","ffff3f"],
]

let hexColors;
let colors = [];
let helpers = new Helpers();
let colorClass = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
}

function populateCells(genExtraLarge = false) {
  // extra large multiple
  let eM = 1;
  let newCells = [];
  let newExtraLargeCells = [];
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      let newCell = {
        row: r,
        col: c,
        x: c * cW,
        y: r * cH,
        w: cW,
        h: cH,
        used: false,
      };

      // extra large multiple
      eM = ceil(random(3));
      newCells.push(newCell);
      if (
        genExtraLarge
        && helpers.rollADie(extraLargeChance) === extraLargeChance
        && newCell.x + newCell.w + (cW * eM) < width
        && newCell.y + newCell.h + (cH * eM) < height
      ) {
        let extraLargeCell = {
          row: r,
          col: c,
          x: c * cW,
          y: r * cH,
          w: newCell.w + (cW * eM),
          h: newCell.h + (cH * eM),
          used: false,
        };
        newExtraLargeCells.push(extraLargeCell);
      }
    }
  }

  // check for large cells that overlap others down the line
  for (var i = 0; i < newExtraLargeCells.length; i++) {
    for (var e = i + 1; e < newExtraLargeCells.length; e++) {
      if (intersection(newExtraLargeCells[i], newExtraLargeCells[e])) {
        newExtraLargeCells[e].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(newExtraLargeCells, function (o) { return o.used; });

  // check for normal cells that are overlapped by the large cells
  for (var i = 0; i < newCells.length; i++) {
    for (var e = 0; e < newExtraLargeCells.length; e++) {
      if (intersection(newCells[i], newExtraLargeCells[e])) {
        newCells[i].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(newCells, function (o) { return o.used; });

  return [newCells, newExtraLargeCells];
}

function saveFileName() {
  let formattedSaveCount = FormatNumberLength(saveCount-90,4);
  let fileName = `${saveId}_${formattedSaveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }

  if (key === 'g') {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }
    return false;

  }
}

// https://editor.p5js.org/ChrisOrban/sketches/ryXx1hjWZ
function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}


function draw() {
  noLoop();
  let backgroundCells = [];
  let currentCells = [];
  let newColors = []
  // reset the columns and rows
  cols = ceil(random(2,10));
  rows = ceil(random(cols, cols + cols / 2));
  cW = width / cols;
  cH = height / rows;

  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    let hShift = ceil(random(-25, 25));
    let oH = hsl.h;
    if (oH + hShift > 360) {
      hsl.h = oH + hShift - 360;
    } else if (oH + hShift < 0) {
      hsl.h = oH + hShift + 360;
    } else {
      hsl.h = oH + hShift;
    }
    colors.push(hsl);
  }

  newColors = helpers.shuffleArray(colors);
  background(newColors[0].h, newColors[0].s, newColors[0].l, 100);

  // To ensure there is no graps in the grid, make an initial
  // set of background cells. These will be covered by the currentCells
  // array but any gaps will be filled with a default size cell
  backgroundCells = populateCells(false);
  for (var i = 0; i < backgroundCells[0].length; i++) {
    if (backgroundCells[0][i].used === true) {
      continue;
    }

    doCell(backgroundCells[0][i]);
  }

  // Build the current cells and display
  currentCells = populateCells(true);
  cells = currentCells[0];
  extraLargeCells = currentCells[1];

  for (var i = 0; i < cells.length; i++) {
    if (cells[i].used === true) {
      continue;
    }

    doCell(cells[i]);
  }

  for (var i = 0; i < extraLargeCells.length; i++) {
    if (extraLargeCells[i].used === true) {
      continue;
    }

    doCell(extraLargeCells[i]);
  }
}

// https://editor.p5js.org/eric/sketches/HkW2DRKnl
function intersection(rect1, rect2) {
  let x1 = rect2.x;
  let y1 = rect2.y;
  let x2 = x1 + rect2.w;
  let y2 = y1 + rect2.h;
  if (rect1.x > x1) { x1 = rect1.x; }

  if (rect1.y > y1) { y1 = rect1.y; }

  if (rect1.x + rect1.w < x2) { x2 = rect1.x + rect1.w; }

  if (rect1.y + rect1.h < y2) { y2 = rect1.y + rect1.h; }

  return (x2 <= x1 || y2 <= y1) ? false : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

function doCell(cell) {

  cell.used = true;
  let newColors = helpers.shuffleArray(colors);
  let bgColor = newColors[0];
  let bodyColor = newColors[1];
  let facialColor = newColors[2];
  let accentColor = newColors[3];

  let character = new Character(cell, bgColor, bodyColor, facialColor, accentColor);
  push();
  translate(cell.x, cell.y);
  character.buildCharacter();
  pop();

}
