
let cols = 6;
let rows = 7;
let cW = 100;
let cH = 100;
let extraLargeChance = 20;
let cells = [];
let extraLargeCells = [];
let pallets = [
  ['f72585', 'b5179e', '7209b7', '560bad', '480ca8', '3a0ca3', '3f37c9', '4361ee', '4895ef', '4cc9f0'],
  ["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"],
  ["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
  ["ffbe0b","fb5607","ff006e","8338ec","3a86ff"],
  ["011627","fdfffc","2ec4b6","e71d36","ff9f1c"],
  ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
  ["ffffff","8ecae6","219ebc","023047","ffb703","fb8500"],
  ["3d5a80","98c1d9","e0fbfc","ee6c4d","293241"],
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

function populateCells() {
  // extra large multiple
  let eM = 1;

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
      cells.push(newCell);
      if (
        helpers.rollADie(extraLargeChance) === extraLargeChance
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
        extraLargeCells.push(extraLargeCell);
      }
    }
  }

  // check for large cells that overlap others down the line
  for (var i = 0; i < extraLargeCells.length; i++) {
    extraLargeCells[i];
    for (var e = i + 1; e < extraLargeCells.length; e++) {
      if (intersection(extraLargeCells[i], extraLargeCells[e])) {
        extraLargeCells[e].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(extraLargeCells, function (o) { return o.used; });

  // check for normal cells that are overlapped by the large cells
  for (var i = 0; i < cells.length; i++) {
    for (var e = 0; e < extraLargeCells.length; e++) {
      if (intersection(cells[i], extraLargeCells[e])) {
        cells[i].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(cells, function (o) { return o.used; });
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

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}


function draw() {
  noLoop();
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    colors.push(colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]));
  }
  cells = [];
  extraLargeCells = [];
  populateCells();

  let bgColor = random(colors);
  background(bgColor.h, bgColor.s, bgColor.l, 100);

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
