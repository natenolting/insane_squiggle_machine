let helpers = new Helpers();
let colorClass = new Colors();
let canvasWidth = 1000;
let canvasHeight = 1000;
let cellVariance = 50;
let cols;
let rows;
let cW;
let cH;

let cells;
let saveId = helpers.makeid(10);
let saveCount = 0;

let pallets = [
  // https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
  ["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"],
  // https://coolors.co/f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0
  ["f72585","b5179e","7209b7","560bad","480ca8","3a0ca3","3f37c9","4361ee","4895ef","4cc9f0"],
  // https://coolors.co/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08
  ["03071e","370617","6a040f","9d0208","d00000","dc2f02","e85d04","f48c06","faa307","ffba08"],
  // https://coolors.co/ff6d00-ff7900-ff8500-ff9100-ff9e00-240046-3c096c-5a189a-7b2cbf-9d4edd
  ["ff6d00","ff7900","ff8500","ff9100","ff9e00","240046","3c096c","5a189a","7b2cbf","9d4edd"],

];

let hexColors;

function setup() {
  cols = ceil(canvasWidth / cellVariance);
  rows = ceil(canvasHeight / cellVariance);
  cW = canvasWidth / cols;
  cH = canvasHeight / rows;
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);

}

function draw() {
  let current;
  let next;
  let finalStrokeWeight = helpers.average([cW, cH]) / 4;
  let rawCells = (new Cells(cols, rows, cW, cH)).populateCells();
  let entranceStart;
  let entranceEnd;
  let exitStart;
  let exitEnd;
  let currentColor;
  let colors = [];
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  cells = _.shuffle(rawCells[0]);

  noLoop();
  background(0, 0, 100, 100);

  //stroke(0, 0, 80, 100);
  //strokeWeight(1);
  noStroke();
  currentColor = random(colors);
  fill(currentColor.h, currentColor.s, currentColor.l, 2.5);
  rect(1, 1, canvasWidth - 2, canvasHeight - 2);

  // find an enterance and exit
  // for (var i = 3; i < rows - 2; i++) {
  //   line(0, cH * i - cH / 2, canvasWidth, cH * i - cH / 2);
  // }
  strokeWeight(finalStrokeWeight);
  noFill();

  // ellipse(entranceStart.x, entranceStart.y, finalStrokeWeight * 1.5);
  // ellipse(enteranceEnd.x, enteranceEnd.y, finalStrokeWeight * 1.5);
  //
  // ellipse(exitStart.x, exitStart.y, finalStrokeWeight * 1.5);
  // ellipse(exitEnd.x, exitEnd.y, finalStrokeWeight * 1.5);

  //rect(cW * 1.5, cH * 1.5, canvasWidth - cW * 3, canvasHeight - cH * 3);

  for (var i = 0; i < cells.length; i++) {
    cells[i].index = i;
    current = cells[i];

    // skip outer row
    if (current.row <= 1
    || current.col <= 1
    || current.row >= rows - 2
    || current.col >= cols - 2) {
      continue;
    }

    //ellipse(current.cX, current.cY, 10, 10);
  }



  let paths = generatePaths();

  push();

  for (var i = 0; i < paths.length; i++) {
    currentColor = random(colors);
    stroke(currentColor.h, currentColor.s, currentColor.l, 100);
    beginShape();
    for (var p = 0; p < paths[i].length; p++) {
      vertex(paths[i][p].cX, paths[i][p].cY);
      //curveVertex(paths[i][p].cX, paths[i][p].cY);
    }

    endShape();
  }

  pop();


  currentColor = random(colors);
  stroke(currentColor.h, currentColor.s, currentColor.l, 100);

  // draw outer border and entrance/exit
  switch (helpers.rollADie(3)) {
    case (1):

      // north entrance, east exit
      entranceStart = createVector(ceil(random(2, cols - 3)) * cW - cW / 2, cH * 2 - cH / 2);
      enteranceEnd = createVector(entranceStart.x + cW, entranceStart.y);

      exitStart = createVector((cols - 1) * cW - cW / 2,  ceil(random(2, rows - 3)) * cH - cW / 2);
      exitEnd = createVector(exitStart.x, exitStart.y + cH);

      beginShape();
      vertex(exitEnd.x, exitEnd.y);
      vertex(exitEnd.x, canvasHeight - cH - cH / 2);
      vertex(cW * 2 - cW / 2, canvasHeight - cH - cH / 2);
      vertex(cW * 2 - cW / 2, entranceStart.y);
      vertex(entranceStart.x, entranceStart.y);
      endShape();

      beginShape();
      vertex(enteranceEnd.x, enteranceEnd.y);
      vertex(canvasWidth - cW - cW / 2, enteranceEnd.y);
      vertex(exitStart.x, exitStart.y);
      endShape();

      break;
    case (2):

      // east entrance, south exit
      entranceStart = createVector((cols - 1) * cW - cW / 2,  ceil(random(2, rows - 3)) * cH - cW / 2);
      enteranceEnd = createVector(entranceStart.x, entranceStart.y + cH);

      exitStart = createVector(ceil(random(2, cols - 3)) * cW - cW / 2, canvasHeight - cH - cH / 2);
      exitEnd = createVector(exitStart.x + cW, exitStart.y);


      beginShape();
      vertex(enteranceEnd.x, enteranceEnd.y);
      vertex(enteranceEnd.x, exitEnd.y);
      vertex(exitEnd.x, exitEnd.y);
      endShape();

      beginShape();
      vertex(exitStart.x, exitStart.y);
      vertex(cW * 2 - cW / 2, exitStart.y);
      vertex(cW * 2 - cW / 2, cH * 2 - cH / 2);
      vertex(entranceStart.x, cH * 2 - cH / 2);
      vertex(entranceStart.x, entranceStart.y);
      endShape();

      break;

    case (3):

      // south entrance, west exit
      entranceStart = createVector(ceil(random(2, cols - 3)) * cW - cW / 2, canvasHeight - cH - cH / 2);
      enteranceEnd = createVector(entranceStart.x + cW, entranceStart.y);

      exitStart = createVector(cW * 2 - cW / 2,  ceil(random(2, rows - 3)) * cH - cW / 2);
      exitEnd = createVector(exitStart.x, exitStart.y + cH);


      beginShape();
      vertex(entranceStart.x, entranceStart.y);
      vertex(cW * 2 - cW / 2, entranceStart.y);
      vertex(exitEnd.x, exitEnd.y);
      endShape();

      beginShape();
      vertex(exitStart.x, exitStart.y);
      vertex(cW * 2 - cW / 2, cH * 2 - cH / 2);
      vertex(canvasWidth - cW - cW / 2, cH * 2 - cH / 2);
      vertex(canvasWidth - cW - cW / 2, enteranceEnd.y);
      vertex(enteranceEnd.x, enteranceEnd.y);
      endShape();

    default:

  }


}

function generatePaths() {
  let paths = [];
  for (var i = 0; i < cells.length; i++) {
    let currentPath = [];
    let last;
    current = cells[i];

    // skip the outer row
    if (current.row <= 1
    || current.col <= 1
    || current.row >= rows - 2
    || current.col >= cols - 2) {
      continue;
    }

    if (!cells[i].used) {

      cells[i].used = true;
      currentPath.push(cells[i]);

      next = nextDirection(cells[i]);

      if (next === undefined
      || next.row <= 1
      || next.col <= 1
      || next.row >= rows - 2
      || next.col >= cols - 2) {
        continue;
      }

      if (cells[next.index] !== undefined) {

        cells[next.index].used = true;
        currentPath.push(cells[next.index]);

        while (next !== undefined) {
          next = nextDirection(cells[next.index]);
          if (next === undefined
          || next.row <= 1
          || next.col <= 1
          || next.row >= rows - 2
          || next.col >= cols - 2) {
            break;
          }

          if (cells[next.index] !== undefined) {

            cells[next.index].used = true;
            currentPath.push(cells[next.index]);
          }
        }

      }

      // add a blocking wall in a cardinal directions
      last = currentPath[currentPath.length - 1];
      if (last.col === 2) {
        currentPath.push(_.find(cells, { col: last.col - 1, row: last.row }));
      } else if (last.col === cols - 3) {
        currentPath.push(_.find(cells, { col: last.col + 1, row: last.row }));
      } else if (last.row === 2) {
        currentPath.push(_.find(cells, { col: last.col, row: last.row - 1 }));
      } else if (last.row === rows - 3) {
        currentPath.push(_.find(cells, { col: last.col, row: last.row + 1 }));
      }

      paths.push(currentPath);
    }
  }

  return _.filter(paths, function (o) { return o.length > 1; });

}

function directions(cell) {
  let output = [];

  output.push({ direction: 'n', cell: _.find(cells, { col: cell.col, row: cell.row - 1, }) });
  output.push({ direction: 'ne', cell: _.find(cells, { col: cell.col + 1, row: cell.row - 1 }) });
  output.push({ direction: 'e', cell: _.find(cells, { col: cell.col + 1, row: cell.row }) });
  output.push({ direction: 'se', cell: _.find(cells, { col: cell.col + 1, row: cell.row + 1 }) });
  output.push({ direction: 's', cell: _.find(cells, { col: cell.col, row: cell.row + 1 }) });
  output.push({ direction: 'sw', cell: _.find(cells, { col: cell.col - 1, row: cell.row + 1 }) });
  output.push({ direction: 'w', cell: _.find(cells, { col: cell.col - 1, row: cell.row }) });
  output.push({ direction: 'nw', cell: _.find(cells, { col: cell.col - 1, row: cell.row - 1 }) });

  return output;
}

function nextDirection(cell) {
  let output;

  // possible directions
  let d = _.shuffle(directions(cell));
  let n = _.find(d, { direction: 'n' });
  let s = _.find(d, { direction: 's' });
  let e = _.find(d, { direction: 'e' });
  let w = _.find(d, { direction: 'w' });

  for (var i = 0; i < d.length; i++) {
    if (d[i].cell === undefined) {
      continue;
    }

    // current direction
    let cD = d[i];

    switch (cD.direction) {
      case ('n'):
      case ('e'):
      case ('s'):
      case ('w'):
        if (!cells[cD.cell.index].used) {
          output = cD.cell;
        }

        break;
      case ('ne'):
        if (!cells[cD.cell.index].used && !cells[n.cell.index].used && !cells[e.cell.index].used) {
          output = cD.cell;
        }

        break;
      case ('se'):
        if (!cells[cD.cell.index].used && !cells[s.cell.index].used && !cells[e.cell.index].used) {
          output = cD.cell;
        }

        break;
      case ('sw'):
        if (!cells[cD.cell.index].used && !cells[s.cell.index].used && !cells[w.cell.index].used) {
          output = cD.cell;
        }

        break;
      case ('nw'):
        if (!cells[cD.cell.index].used && !cells[n.cell.index].used && !cells[w.cell.index].used) {
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
