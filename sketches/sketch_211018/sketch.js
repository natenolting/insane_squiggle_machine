let canvasWidth = 1000;
let canvasHeight = 1000;
let cellVariance = 25;
let cells;
let cellsWidth;
let cellsHeight;
let saveId = (new Helpers).makeid(10);
let saveCount = 0;

function setup() {
  cols = ceil(canvasWidth / cellVariance);
  rows = ceil(canvasHeight / cellVariance);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  cellsWidth = (cols - 2) * cW;
  cellsHeight = (rows - 2) * cH;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
}

function draw() {
  noLoop();
  background(0, 0, 0, 100);
  cells = [];

  push();
  translate(cW, cH);

  fill(0, 0, 100, 100);
  rect(0, 0, cellsWidth, cellsHeight);

  let initialCellNw = new Cell(1, 1, 0, 0, cellsWidth / 2, cellsHeight / 2);
  let initialCellNe = new Cell(1, 1, cellsWidth / 2, 0, cellsWidth / 2, cellsHeight / 2);
  let initialCellSw = new Cell(1, 1, 0, cellsHeight / 2, cellsWidth / 2, cellsHeight / 2);
  let initialCellSe = new Cell(1, 1, cellsWidth / 2, cellsHeight / 2, cellsWidth / 2, cellsHeight / 2);

  splitCell(initialCellNw);
  splitCell(initialCellNe);
  splitCell(initialCellSw);
  splitCell(initialCellSe);
  stroke(0, 0, 0, 100);

  noFill();
  for (var i = 0; i < cells.length; i++) {
    let cc = cells[i];
    stroke(0, 0, 0, 100);
    strokeWeight(1);
    noFill();
    //rect(cc.x, cc.y, cc.w, cc.h);
    strokeWeight((((cc.w + cc.h) / 2) / ((cellsWidth + cellsHeight) / 2)) * 100);

    let roll = (new Helpers).rollADie(6);

    //roll = 5;
    switch (roll) {
      case 1:
        arc(cc.x, cc.y, cc.w, cc.h, radians(0), radians(90));
        arc(cc.x + cc.w, cc.y + cc.h, cc.w, cc.h, radians(180), radians(270));
        ellipse(cc.x, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w, cc.y + cc.h, cc.w / 4, cc.h / 4);
        noStroke();
        fill(0, 0, 100, 100);
        ellipse(cc.x, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w, cc.y + cc.h, cc.w / 4, cc.h / 4);
        break;

      case 2:
        arc(cc.x + cc.w, cc.y, cc.w, cc.h, radians(90), radians(180));
        arc(cc.x, cc.y + cc.h, cc.w, cc.h, radians(270), radians(0));
        ellipse(cc.x + cc.w, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x, cc.y + cc.h, cc.w / 4, cc.h / 4);
        noStroke();
        fill(0, 0, 100, 100);
        ellipse(cc.x + cc.w, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x, cc.y + cc.h, cc.w / 4, cc.h / 4);
        break;

      case 3:
        line(cc.x + cc.w / 2, cc.y, cc.x + cc.w / 2, cc.y + cc.h);
        line(cc.x, cc.y + cc.h / 2, cc.x + cc.w, cc.y + cc.h / 2);
        break;

      case 4:
        arc(cc.x, cc.y, cc.w, cc.h, radians(0), radians(90));
        arc(cc.x + cc.w, cc.y + cc.h, cc.w, cc.h, radians(180), radians(270));
        arc(cc.x + cc.w, cc.y, cc.w, cc.h, radians(90), radians(180));
        arc(cc.x, cc.y + cc.h, cc.w, cc.h, radians(270), radians(0));
        break;

      case 5:
        noStroke();
        fill(0, 0, 0, 100);
        ellipse(cc.cX, cc.cY, cc.w / 4, cc.h / 4);
        ellipse(cc.cX, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.cX, cc.y + cc.h, cc.w / 4, cc.h / 4);
        ellipse(cc.x, cc.cY, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w, cc.cY, cc.w / 4, cc.h / 4);
        ellipse(cc.x, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w, cc.y, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w, cc.y + cc.h, cc.w / 4, cc.h / 4);
        ellipse(cc.x, cc.y + cc.h, cc.w / 4, cc.h / 4);


        ellipse(cc.x + cc.w / 4, cc.y + cc.h / 4, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4 + cc.w / 2, cc.y + cc.h / 4, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4 + cc.w / 2, cc.y + cc.h / 4 + cc.h / 2, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4, cc.y + cc.h / 4 + cc.h / 2, cc.w / 4, cc.h / 4);
        break;

      case 6:
        noStroke();
        fill(0, 0, 0, 100);

        ellipse(cc.x + cc.w / 4, cc.y + cc.h / 4, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4 + cc.w / 2, cc.y + cc.h / 4, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4 + cc.w / 2, cc.y + cc.h / 4 + cc.h / 2, cc.w / 4, cc.h / 4);
        ellipse(cc.x + cc.w / 4, cc.y + cc.h / 4 + cc.h / 2, cc.w / 4, cc.h / 4);
        break;

      default:

    }
  }

  pop();

}

splitCell = function (cell) {
  let flip = (new Helpers).coinFlip();
  if (flip && cell.w / 2 >= cW && cell.h / 2 >= cH) {
    let cellNw = new Cell(1, 1, cell.x, cell.y, cell.w / 2, cell.h / 2);
    let cellNe = new Cell(1, 1, cell.x + cell.w / 2, cell.y, cell.w / 2, cell.h / 2);
    let cellSw = new Cell(1, 1, cell.x, cell.y + cell.h / 2, cell.w / 2, cell.h / 2);
    let cellSe = new Cell(1, 1, cell.x + cell.w / 2, cell.y + cell.h / 2, cell.w / 2, cell.h / 2);
    splitCell(cellNw);
    splitCell(cellNe);
    splitCell(cellSw);
    splitCell(cellSe);
  } else {
    cells.push(cell);
  }
};

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
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
    for (var i = 0; i < 10; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
