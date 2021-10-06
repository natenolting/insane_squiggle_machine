let helpers = new Helpers();
let canvasWidth = 700;
let canvasHeight = 700;
let cols;
let rows;
let cW;
let cH;

let cells;
let saveId = helpers.makeid(10);
let saveCount = 0;

function setup() {
  cols = ceil(canvasWidth / 10);
  rows = ceil(canvasHeight / 10);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
  let rawCells = (new Cells(cols, rows, cW, cH)).populateCells();
  cells = _.shuffle(rawCells[0]);

  //cells = _.sortBy(rawCells[0], [function (o) { return o.index; }]);
}

function draw() {
  let current;
  let next;

  noLoop();
  background(0, 0, 100, 100);

  stroke(0, 0, 80, 100);
  strokeWeight(1);
  fill(0, 0, 100, 100);
  rect(1, 1, canvasWidth - 2, canvasHeight - 2);

  for (var i = 0; i < cells.length; i++) {
    cells[i].index = i;
    current = cells[i];
    if (current.row <= 1
    || current.col <= 1
    || current.row >= rows - 2
    || current.col >= cols - 2) {
      continue;
    }

    //rect(current.x, current.y, current.w, current.h);
    //ellipse(current.cX, current.cY, 1);
  }

  let close = false;
  for (var i = 0; i < cells.length; i++) {
    current = cells[i];

    // skip the outer two rows
    if (current.row <= 1
    || current.col <= 1
    || current.row >= rows - 2
    || current.col >= cols - 2) {
      continue;
    }

    //console.log(`Cell Index: ${i}, total cells ${cells.length}`);
    if (!cells[i].used) {
      stroke(355, 78, 56, 100);
      noFill();
      //ellipse(cells[i].cX, cells[i].cY, 10);
      //ellipse(current.cX, current.cY, 1);
      beginShape();
      vertex(cells[i].cX, cells[i].cY);
      cells[i].used = true;
      next = nextDirection(cells[i]);

      if (next === undefined || next.row <= 1
      || next.col <= 1
      || next.row >= rows - 2
      || next.col >= cols - 2) {
        continue;
      }

      if (cells[next.index] !== undefined) {
        vertex(next.cX, next.cY);
        cells[next.index].used = true;

        while (next !== undefined) {
          next = nextDirection(cells[next.index]);
          if (next === undefined || next.row <= 1
          || next.col <= 1
          || next.row >= rows - 2
          || next.col >= cols - 2) {
            break;
          }

          if (cells[next.index] !== undefined) {
            vertex(next.cX, next.cY);
            cells[next.index].used = true;
          }
        }

      }

      endShape();
    };


  }
}

function directions(cell) {
  let output = [];

  output.push({ direction: 'n', cell: _.find(cells, { col: cell.col, row: cell.row - 1, }) });
  //output.push({ direction: 'ne', cell: _.find(cells, { col: cell.col + 1, row: cell.row - 1 }) });
  output.push({ direction: 'e', cell: _.find(cells, { col: cell.col + 1, row: cell.row }) });
  //output.push({ direction: 'se', cell: _.find(cells, { col: cell.col + 1, row: cell.row + 1 }) });
  output.push({ direction: 's', cell: _.find(cells, { col: cell.col, row: cell.row + 1 }) });
  //output.push({ direction: 'sw', cell: _.find(cells, { col: cell.col - 1, row: cell.row + 1 }) });
  output.push({ direction: 'w', cell: _.find(cells, { col: cell.col - 1, row: cell.row }) });
  //output.push({ direction: 'nw', cell: _.find(cells, { col: cell.col - 1, row: cell.row - 1 }) });

  return output;
}

function nextDirection(cell) {
  let output;

  // possible directions
  let d = _.shuffle(directions(cell));
  for (var i = 0; i < d.length; i++) {
    if (d[i].cell === undefined) {
      continue;
    }

    // current direction
    let cD = d[i];
    console.log(cD.cell.index, cells[cD.cell.index]);
    switch (cD.direction) {
      case ('n'):
      case ('e'):
      case ('s'):
      case ('w'):
        if (!cells[cD.cell.index].used) {
          output = cD.cell;
        }

        break;
      default:
    }

    if (output !== undefined) {
      break;
    }
  }

  return output;
}

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
