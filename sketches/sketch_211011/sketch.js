let canvasWidth = 1000;
let canvasHeight = 750;
let cellVariance = 5;
let cells;
let smallCells;
let largeCells;
let pathGroups;
let darkGreen = { h: 142, s: 97, l: 27 };
let lightGreen = { h: 135, s: 99, l: 56 };
let saveId = (new Helpers).makeid(10);
let saveCount = 0;

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
  noLoop();
  background(0, 0, 100, 100);
  let finalStrokeWeight = (new Helpers).average([cW, cH]) / 4;
  fill(lightGreen.h, lightGreen.s, lightGreen.l, 100);
  noStroke();
  rect(0, 0, canvasWidth, canvasHeight);

  // texturaize the base
  for (var w1 = 0; w1 <= canvasWidth; w1++) {
    for (var h1 = 0; h1 <= canvasHeight; h1++) {
      if (
        w1 % 8 === 0
        && h1 % 8 === 0
      ) {
        fill(darkGreen.h, darkGreen.s, darkGreen.l, 50);
        ellipse(w1, h1, finalStrokeWeight / 4);
      }

      if (
        w1 % 4 === 0
        && h1 % 4 === 0
      ) {
        fill(darkGreen.h, darkGreen.s, darkGreen.l, 50);
        ellipse(w1, h1, finalStrokeWeight / 8);
      }

    }
  }

  pathGroups = [];

  cells = (new Cells(cols - 2, rows - 2, cW, cH)).populateCells(true, 50, 10);
  smallCells = cells[0];
  largeCells = cells[1];

  let adjacentCells = [];
  for (var i = 0; i < largeCells.length; i++) {

    for (var a = 0; a < largeCells[i].adjacentCells.length; a++) {
      let adj = largeCells[i].adjacentCells[a];

      adjacentCells.push(adj);
    }
  }

  for (var i = 0; i < adjacentCells.length; i++) {
    let currentPaths = [];
    let dir = _.shuffle(_.filter(directions(adjacentCells[i]), function (o) {
      return o.cell !== undefined;
    }));

    let adj = _.findIndex(
      smallCells,
      { row: adjacentCells[i].row, col: adjacentCells[i].col, used: false }
    );
    if (smallCells[adj] === undefined
      || smallCells[adj].used
    ) {
      continue;
    }

    currentPaths.push(smallCells[adj]);
    smallCells[adj].used = true;
    let next = -1;
    for (var d = 0; d < dir.length; d++) {
      next = _.findIndex(
        smallCells,
        { row: dir[d].cell.row, col: dir[d].cell.col, used: false }
      );

      if (smallCells[next] !== undefined) {
        break;
      }

    }

    if (next > -1 && smallCells[next] !== undefined && !smallCells[next].used) {
      currentPaths.push(smallCells[next]);
      smallCells[next].used = true;

    }

    while (next > -1) {
      dir = _.shuffle(_.filter(directions(smallCells[next]), function (o) {
        return o.cell !== undefined;
      }));

      if (dir.length === 0) {
        next = -1;
      }

      for (var d = 0; d < dir.length; d++) {
        next = _.findIndex(smallCells, { row: dir[d].cell.row, col: dir[d].cell.col, used: false });
        if (smallCells[next] !== undefined) {
          currentPaths.push(smallCells[next]);
          smallCells[next].used = true;
          break;
        }
      }
    }

    pathGroups.push(currentPaths);

  }

  push();
  translate(cW, cH);

  // outline of paths
  for (var i = 0; i < pathGroups.length; i++) {
    if (pathGroups[i].length > 1) {
      for (var p = 0; p < pathGroups[i].length; p++) {
        fill(darkGreen.h, darkGreen.s, darkGreen.l, 75);
        stroke(darkGreen.h, darkGreen.s, darkGreen.l, 75);
        strokeWeight(finalStrokeWeight * random([1, 2]));
        if (p === 0 || p === pathGroups[i].length - 1) {
          ellipse(pathGroups[i][p].cX, pathGroups[i][p].cY, finalStrokeWeight * random([3, 4]));
        }
      }
    }

    noFill();
    stroke(darkGreen.h, darkGreen.s, darkGreen.l, 75);
    strokeWeight(finalStrokeWeight * random([2, 4, 8]));
    strokeJoin(ROUND);
    beginShape();
    for (var p = 0; p < pathGroups[i].length; p++) {
      vertex(pathGroups[i][p].cX, pathGroups[i][p].cY);
    }

    endShape();
  }

  // inside paths
  for (var i = 0; i < pathGroups.length; i++) {
    if (pathGroups[i].length > 1) {
      for (var p = 0; p < pathGroups[i].length; p++) {
        fill(lightGreen.h, lightGreen.s, lightGreen.l, 100);
        noStroke();
        if (p === 0 || p === pathGroups[i].length - 1) {
          ellipse(pathGroups[i][p].cX, pathGroups[i][p].cY, finalStrokeWeight * 2);
        }
      }
    }

    noFill();
    stroke(lightGreen.h, lightGreen.s, lightGreen.l, 100);
    strokeWeight(finalStrokeWeight);
    strokeJoin(ROUND);
    beginShape();
    for (var p = 0; p < pathGroups[i].length; p++) {
      vertex(pathGroups[i][p].cX, pathGroups[i][p].cY);
    }

    endShape();

    if (pathGroups[i].length > 1) {
      for (var p = 0; p < pathGroups[i].length; p++) {
        push();
        translate(pathGroups[i][p].cX, pathGroups[i][p].cY);
        noStroke();
        if (p === 0 || p === pathGroups[i].length - 1) {
          noStroke();
          fill(darkGreen.h, darkGreen.s, darkGreen.l, 100);
          //arc(0, 0, finalStrokeWeight * 2.125, finalStrokeWeight * 2, radians(270), radians(135));
          //fill(lightGreen.h, lightGreen.s, lightGreen.l, 100);
          ellipse(0, 0, finalStrokeWeight);
        }

        pop();
      }
    }

  }

  // large cells / "chips"
  for (var i = 0; i < largeCells.length; i++) {
    let currentLarge = largeCells[i];

    // don't let this touch other containers
    for (var o = 0; o < largeCells.length; o++) {
      if (o === i) {
        continue;
      }

      if (largeCells[o].x + largeCells[o].w === currentLarge.x) {
        //currentLarge.x += cW;
        //currentLarge.w -= cW;
        continue;
      }

      if (largeCells[o].y + largeCells[o].h === currentLarge.y) {
        //currentLarge.y += cH;
        //currentLarge.h -= cH;
        continue;
      }

      if (largeCells[o].x === currentLarge.x + currentLarge.w) {
        //currentLarge.w -= cW;
        continue;
      }

    }

    fill(lightGreen.h, lightGreen.s, lightGreen.l, 100);
    stroke(darkGreen.h, darkGreen.s, darkGreen.l, 100);
    strokeWeight(finalStrokeWeight);
    rect(currentLarge.x + cW / 2, currentLarge.y + cH / 2, currentLarge.w - cW, currentLarge.h - cH);
    noStroke();
    fill(darkGreen.h, darkGreen.s, darkGreen.l, 100);
    arc(
      currentLarge.cX,
      currentLarge.cY,
      currentLarge.w - currentLarge.w / 8 - cW,
      currentLarge.h - currentLarge.h / 8 - cH,
      radians(random([-90, 0, 90, 180])),
      radians(random([90, 180, 270, 360]))
    );

    ellipse(
      currentLarge.cX + currentLarge.w / 8,
      currentLarge.cY - currentLarge.h / 8,
      currentLarge.w / 8,
      currentLarge.h / 8
    );

    ellipse(
      currentLarge.cX - currentLarge.w / 8,
      currentLarge.cY - currentLarge.h / 8,
      currentLarge.w / 8,
      currentLarge.h / 8
    );

    ellipse(
      currentLarge.cX + currentLarge.w / 8,
      currentLarge.cY + currentLarge.h / 8,
      currentLarge.w / 8,
      currentLarge.h / 8
    );

    ellipse(
      currentLarge.cX - currentLarge.w / 8,
      currentLarge.cY + currentLarge.h / 8,
      currentLarge.w / 8,
      currentLarge.h / 8
    );

    // top && bottom connections
    for (var c = cW / 2; c < currentLarge.w - cW; c += cW / 2) {
      noFill();
      strokeWeight(finalStrokeWeight / 2);
      stroke(darkGreen.h, darkGreen.s, darkGreen.l, 100);

      // top
      line(
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2,
        currentLarge.x + cW / 2 + c,
        currentLarge.y - cH / 2
      );

      //bottom
      line(
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2 + currentLarge.h - cH,
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2 + currentLarge.h
      );

      noStroke();
      fill(darkGreen.h, darkGreen.s, darkGreen.l, 100);

      // top
      ellipse(
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2,
        finalStrokeWeight
      );

      ellipse(
        currentLarge.x + cW / 2 + c,
        currentLarge.y - cH / 2,
        finalStrokeWeight
      );

      //bottom
      ellipse(
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2 + currentLarge.h - cH,
        finalStrokeWeight
      );

      ellipse(
        currentLarge.x + cW / 2 + c,
        currentLarge.y + cH / 2 + currentLarge.h,
        finalStrokeWeight
      );
    }

    // left && right connections
    for (var c = cH / 2; c < currentLarge.h - cH; c += cH / 2) {
      noFill();
      strokeWeight(finalStrokeWeight / 2);
      stroke(darkGreen.h, darkGreen.s, darkGreen.l, 100);

      // left
      line(
        currentLarge.x + cW / 2,
        currentLarge.y + cH / 2 + c,
        currentLarge.x + cW / 2 - cW,
        currentLarge.y + cH / 2 + c
      );

      // right
      line(
        currentLarge.x + cW / 2 + currentLarge.w - cW,
        currentLarge.y + cH / 2 + c,
        currentLarge.x + cW / 2 + currentLarge.w,
        currentLarge.y + cH / 2 + c
      );

      noStroke();
      fill(darkGreen.h, darkGreen.s, darkGreen.l, 100);

      // left
      ellipse(
        currentLarge.x + cW / 2,
        currentLarge.y + cH / 2 + c,
        finalStrokeWeight
      );

      ellipse(
        currentLarge.x + cW / 2 - cW,
        currentLarge.y + cH / 2 + c,
        finalStrokeWeight
      );

      // right
      ellipse(
        currentLarge.x + cW / 2 + currentLarge.w - cW,
        currentLarge.y + cH / 2 + c,
        finalStrokeWeight,
      );

      ellipse(
        currentLarge.x + cW / 2 + currentLarge.w,
        currentLarge.y + cH / 2 + c,
        finalStrokeWeight
      );
    }

    fill(darkGreen.h, darkGreen.s, darkGreen.l, 100);
    noStroke();
    ellipse(currentLarge.x + cW / 2, currentLarge.y + cH / 2, finalStrokeWeight * 2);
    ellipse(currentLarge.x + currentLarge.w - cW / 2, currentLarge.y + cH / 2, finalStrokeWeight * 2);
    ellipse(currentLarge.x + currentLarge.w - cW / 2, currentLarge.y + currentLarge.h - cH / 2, finalStrokeWeight * 2);
    ellipse(currentLarge.x + cW / 2, currentLarge.y + currentLarge.h - cH / 2, finalStrokeWeight * 2);
  }

  pop();

  //console.log(adjacentCells);

}

function directions(cell) {
  let output = [];

  output.push({ direction: 'n', cell: _.find(smallCells, { col: cell.col, row: cell.row - 1, }) });
  //output.push({ direction: 'ne', cell: _.find(smallCells, { col: cell.col + 1, row: cell.row - 1 }) });
  output.push({ direction: 'e', cell: _.find(smallCells, { col: cell.col + 1, row: cell.row }) });
  //output.push({ direction: 'se', cell: _.find(smallCells, { col: cell.col + 1, row: cell.row + 1 }) });
  output.push({ direction: 's', cell: _.find(smallCells, { col: cell.col, row: cell.row + 1 }) });
  //output.push({ direction: 'sw', cell: _.find(smallCells, { col: cell.col - 1, row: cell.row + 1 }) });
  output.push({ direction: 'w', cell: _.find(smallCells, { col: cell.col - 1, row: cell.row }) });
  //output.push({ direction: 'nw', cell: _.find(smallCells, { col: cell.col - 1, row: cell.row - 1 }) });

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
