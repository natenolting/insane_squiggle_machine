let canvasWidth = 1000;
let canvasHeight = 1000;
let cellVariance = 25;
let cells;
let cellsWidth;
let cellsHeight;
let saveId = new Helpers().makeid(10);
let saveCount = 0;
let cW;
let cH;
let cols;
let rows;

// largest cell width
let lcW = 0;

// largest cell height
let lcH = 0;

// smallest cell width
let scW = canvasWidth;

// smalest cell height
let scH = canvasHeight;

function setupCells(cv) {
  cols = ceil(canvasWidth / cv);
  rows = ceil(canvasHeight / cv);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  cellsWidth = (cols - 2) * cW;
  cellsHeight = (rows - 2) * cH;

}

function setup() {
  cellVariance = ceil(random(5, 50));
  setupCells(cellVariance);
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
}

function arcNW(cc, c) {
  arc(
      cc.x,
      cc.y,
      dist(cc.x, cc.y, cc.x + (c - 1) * 2 * scW + scW, cc.y),
      dist(cc.x, cc.y, cc.x, cc.y + (c - 1) * 2 * scH + scH),
      radians(0),
      radians(90)
  );
}

function arcNE(cc, c) {
  arc(
      cc.x + cc.w,
      cc.y,
      dist(cc.x, cc.y, cc.x + (c - 1) * 2 * scW + scW, cc.y),
      dist(cc.x, cc.y, cc.x, cc.y + (c - 1) * 2 * scH + scH),
      radians(90),
      radians(180)
  );
}

function arcSE(cc, c) {
  arc(
      cc.x + cc.w,
      cc.y + cc.h,
      dist(cc.x, cc.y, cc.x + (c - 1) * 2 * scW + scW, cc.y),
      dist(cc.x, cc.y, cc.x, cc.y + (c - 1) * 2 * scH + scH),
      radians(180),
      radians(270)
  );
}

function arcSW(cc, c) {
  arc(
      cc.x,
      cc.y + cc.h,
      dist(cc.x, cc.y, cc.x + (c - 1) * 2 * scW + scW, cc.y),
      dist(cc.x, cc.y, cc.x, cc.y + (c - 1) * 2 * scH + scH),
      radians(270),
      radians(0)
  );
}

function draw() {
  let c;
  let i;
  noLoop();
  background(0, 0, 100, 100);
  strokeWeight(cellVariance / 4);
  stroke(0, 0, 0, 100);
  rect(
    cellVariance / 4,
    cellVariance / 4,
    canvasWidth - cellVariance / 2,
    canvasHeight - cellVariance / 2
  );

  cells = [];
  let cc;
  let flip;
  push();
  translate(cW, cH);
  lcW = cellsWidth / 2;
  lcH = cellsHeight / 2;

  let initialCellNw = new Cell(
    1,
    1,
    0,
    0,
    cellsWidth / 2, cellsHeight / 2
  );
  let initialCellNe = new Cell(
    1,
    1,
    cellsWidth / 2,
    0,
    cellsWidth / 2,
    cellsHeight / 2
  );
  let initialCellSw = new Cell(
    1,
    1,
    0,
    cellsHeight / 2,
    cellsWidth / 2,
    cellsHeight / 2
  );
  let initialCellSe = new Cell(
    1,
    1,
    cellsWidth / 2,
    cellsHeight / 2,
    cellsWidth / 2,
    cellsHeight / 2
  );

  splitCell(initialCellNw);
  splitCell(initialCellNe);
  splitCell(initialCellSw);
  splitCell(initialCellSe);
  stroke(0, 0, 0, 100);
  noFill();

  // console.log(scW, scH);
  // console.log(lcW, lcH);
  // console.log(lcW / scW, lcH / scH);
  for (i = 0; i < cells.length; i++) {
    cc = cells[i];
    flip = (new Helpers).rollADie(4);

    //flip = 1;
    cells[i].flip = flip;

    // for (c = 1; c <= cc.w / scW; c++) {
    //   for (var r = 1; r <= cc.h / scH; r++) {
    //     stroke(215, 29, 86, 100);
    //     rect(cc.x + (c - 1) * scW, cc.y + (r - 1) * scH, scW, scH);
    //   }
    // }
  }

  strokeWeight(cellVariance / 4);
  stroke(0, 0, 0, 100);
  fill(0, 0, 100, 100);

  // background arcs
  for (i = 0; i < cells.length; i++) {
    cc = cells[i];



    for (c = cc.w / scW; c >= 1; c--) {


      switch (cc.flip) {
        case 1:
          arcSE(cc, c);

          break;

        case 2:
          arcSW(cc, c);
          break;

        case 3:
          arcNW(cc, c);
          break;

        case 4:
          arcNE(cc, c);
          break;
        default:

      }
    }
  }


  // Arcs
  for (i = 0; i < cells.length; i++) {
    cc = cells[i];

    for (c = cc.w / scW; c >= 1; c--) {
      stroke(0, 0, 0, 100);
      fill(0, 0, 100, 100);

      switch (cc.flip) {
        case 1:
          arcNW(cc, c);

          break;

        case 2:
          arcNE(cc, c);
          break;

        case 3:
          arcSE(cc, c);
          break;

        case 4:
          arcSW(cc, c);
          break;
        default:

      }
    }
  }

  pop();
}

splitCell = function (cell) {
  let flip = new Helpers().coinFlip();
  if (flip && cell.w / 2 >= cW && cell.h / 2 >= cH) {
    const halfWidth = cell.w * 0.5;
    const halfHeight = cell.h * 0.5;
    let cellNw = new Cell(1, 1, cell.x, cell.y, halfWidth, halfHeight);
    let cellNe = new Cell(
      1,
      1,
      cell.x + halfWidth,
      cell.y,
      halfWidth,
      halfHeight
    );
    let cellSw = new Cell(
      1,
      1,
      cell.x,
      cell.y + halfHeight,
      halfWidth,
      halfHeight
    );
    let cellSe = new Cell(
      1,
      1,
      cell.x + halfWidth,
      cell.y + halfHeight,
      halfWidth,
      halfHeight
    );
    splitCell(cellNw);
    splitCell(cellNe);
    splitCell(cellSw);
    splitCell(cellSe);
  } else {
    cells.push(cell);
    if (cell.w > lcW) {
      lcW = cell.w;
    }

    if (cell.h > lcH) {
      lcH = cell.h;
    }

    if (cell.w < scW) {
      scW = cell.w;
    }

    if (cell.h < scH) {
      scH = cell.h;
    }
  }
};

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
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
