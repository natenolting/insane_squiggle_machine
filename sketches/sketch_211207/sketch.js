let canvasWidth = 2400;
let canvasHeight = 2400;
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
let strokeVariance = .15;

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
    //const flip = (new Helpers()).coinFlip();
    //const flip = (new Helpers()).rollADie(20) >= 10 ? true : false;

    if (c.x === 0 || c.y === 0 || c.col + 1 === cols || c.row + 1 === rows) {
      continue;
    }

    noFill();

    //stroke(0, 0, 0, 10);
    //rect(c.x, c.y, c.w, c.h);

    stroke(0, 0, 0, 100);
    strokeWeight(cellVariance * strokeVariance * strokeVariance);
    strokeCap(ROUND);

    //rect(c.x, c.y, c.w, c.h);
    if ((new Helpers()).coinFlip()) {
      // forward slash
      stroke(0, 0, 0, 100);
      noFill();

      //line(c.x, c.y, c.x + c.w, c.y + c.h);

      line(
        lerp(c.x, c.x + c.w, strokeVariance),
        lerp(c.y, c.y + c.h, strokeVariance),
        lerp(c.x, c.x + c.w, 1 - strokeVariance),
        lerp(c.y, c.y + c.h, 1 - strokeVariance),
      );

    } else {

      // back slash
      stroke(0, 0, 0, 100);
      noFill();

      //line(c.x + c.w, c.y, c.x, c.y + c.h);

      line(
        lerp(c.x + c.w, c.x, strokeVariance),
        lerp(c.y, c.y + c.h, strokeVariance),
        lerp(c.x + c.w, c.x, 1 - strokeVariance),
        lerp(c.y, c.y + c.h, 1 - strokeVariance),
      );
    }

    //stroke(357, 100, 54, 100);
    if ((new Helpers()).coinFlip()) {
      // forward slash
      stroke(0, 0, 0, 100);
      noFill();
      arc(c.cX, c.cY, c.w, c.h, radians(90), radians(180));
      arc(c.cX, c.cY, c.w, c.h, radians(270), radians(0));
    } else {
      // back slash
      stroke(0, 0, 0, 100);
      noFill();
      arc(c.cX, c.cY, c.w, c.h, radians(180), radians(270));
      arc(c.cX, c.cY, c.w, c.h, radians(0), radians(90));
    }

    if ((new Helpers()).coinFlip()) {
      // forward slash
      noStroke();
      fill(0, 0, 0, 100);
      ellipse(c.cX, c.cY, c.w / 2, c.h / 2);
    } else {
      // back slash
      stroke(0, 0, 0, 100);
      fill(0, 0, 100, 100);
      ellipse(c.cX, c.cY, c.w / 1.5, c.h / 1.5);
    }

    if ((new Helpers()).coinFlip()) {
      // forward slash
      stroke(0, 0, 0, 100);
      fill(0, 0, 100, 100);
      ellipse(c.cX, c.cY, c.w / 6, c.h / 6);
    } else {
      // back slash
      stroke(0, 0, 0, 100);
      fill(0, 0, 100, 100);
      ellipse(c.cX, c.cY, c.w / 3, c.h / 3);
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

// ------------------------------------------------------

function mousePressed() {

}
