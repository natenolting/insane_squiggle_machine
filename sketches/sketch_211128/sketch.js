let canvasWidth = 800;
let canvasHeight = 800;
let cells;
let cellsWidth;
let cellsHeight;
let saveId = new Helpers().makeid(10);
let saveCount = 0;
let cW;
let cH;
let cols;
let rows;

// lower number = tighter design
let cellVariance = 100;

function setupCells(cv) {
  cols = ceil(canvasWidth / cv);
  rows = ceil(canvasHeight / cv);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  cellsWidth = (cols - 2) * cW;
  cellsHeight = (rows - 2) * cH;
}

function setup() {
  setupCells(cellVariance);
  createCanvas(canvasWidth, canvasHeight, P2D);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  cells = _.shuffle(new Cells(cols, rows, cW, cH).populateCells(false)[0]);

  for (var i = 0; i < cells.length; i++) {
    const c = cells[i];
    const flip = (new Helpers()).coinFlip();
    const roll = (new Helpers()).rollADie(20);

    if (c.x === 0 || c.y === 0 || c.col + 1 === cols || c.row + 1 === rows) {
      continue;
    }

    stroke(0, 0, 0, 100);
    strokeWeight(2);
    strokeCap(ROUND);
    noFill();
    //rect(c.x, c.y, c.w, c.h);
    if (flip) {
      line(c.x, c.y, c.x + c.w, c.y + c.h);
    } else {
      line(c.x + c.w, c.y, c.x, c.y + c.h);

    }

  }
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
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 10; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
