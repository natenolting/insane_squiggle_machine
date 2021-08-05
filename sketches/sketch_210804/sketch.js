
let cols = 9;
let rows = 9;
let cW = 80;
let cH = 80;
let cells = [];
let extraLargeCells = [];
let hexColors = ['f72585', 'b5179e', '7209b7', '560bad', '480ca8', '3a0ca3', '3f37c9', '4361ee', '4895ef', '4cc9f0'];
//let hexColors = ["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"];
//let hexColors = ["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"];
//let hexColors = ["ffbe0b","fb5607","ff006e","8338ec","3a86ff"];
//let hexColors = ["011627","fdfffc","2ec4b6","e71d36","ff9f1c"];
//let hexColors = ["2b2d42","8d99ae","edf2f4","ef233c","d90429"];
let colors = [];
let colorClass = new Colors();
let saveId = (new Cells).makeid(10);
let saveCount = 0;
function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

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
      cells.push(newCell);
      if (
        (new Cells).rollADie(20) === 20
        && newCell.x + newCell.w + cW < width
        && newCell.y + newCell.h + cH < height
      ) {
        let extraLargeCell = {
          row: r,
          col: c,
          x: c * cW,
          y: r * cH,
          w: cW * 2,
          h: cH * 2,
          used: false,
        };
        extraLargeCells.push(extraLargeCell);
      }
    }
  }
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === 'Enter') {
    for (var i = 0; i < cells.length; i++) {
      cells[i].used = false;
    }

    for (var i = 0; i < extraLargeCells.length; i++) {
      extraLargeCells[i].used = false;
    }

    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }
}

function draw() {
  noLoop();
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

function doCell(cell) {

  cell.used = true;
  let fc = random(colors);
  let cellClass = new Cells(cell, colors);
  let randCell = int(random(6));
  fill(fc.h, fc.s, fc.l, 100);
  noStroke();
  rect(cell.x, cell.y, cell.w, cell.h);

  if (randCell === 0) {
    cellClass.pixelated(int(cols * .5), int(rows * .5));
  }

  if (randCell === 1) {
    cellClass.target();
  }

  if (randCell === 2) {
    cellClass.diceRoll();
  }

  if (randCell === 3) {
    cellClass.triangle();
  }

  if (randCell === 4) {
    cellClass.or();
  }

  if (randCell === 5) {
    cellClass.equal();
  }
}
