let cols = 100;
let rows = 100;
let cW = 0;
let cH = 0;
let wW = 0;
let wH = 0;

let cells = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  wW = width;
  wH = height;
  cW = wW / cols;
  cH = wH / rows;
  colorMode(HSB, 359, 100, 100, 100);
  let protection = 0;

  //for (var i = 0; i < cols * rows; i++) {
  while (cells.length < cols * 3) {
    let newCell = {
      x: int(random(cols * cW)),
      y: int(random(rows * cH)),
      r: int(random(cW, cW * 10)),
    };
    let overlap = false;
    for (var o = 0; o < cells.length; o++) {
      let other = cells[o];

      // if (
      //   newCell.x + newCell.r + 1 < other.x - other.r
      //   && newCell.x - newCell.r - 1 > other.x + other.r
      //   && newCell.y + newCell.r + 1 < other.y - other.r
      //   && newCell.y - newCell.r - 1 > other.y + other.r
      //
      // ) {
      //   overlap = false;
      //   break;
      // }

      var d = dist(newCell.x, newCell.y, other.x, other.y);
      if (d < newCell.r + other.r) {
        overlap = true;
        break;
      }
    }

    if (!overlap) {
      cells.push(newCell);
    }

    protection++;
    if (protection > cols * rows * 3) {
      break;
    }

  }

  console.log(cells);
}

function doTexture(coodinates, size, max) {
  x1 = coodinates[0];
  y1 = coodinates[1];
  x2 = coodinates[2];
  y2 = coodinates[3];
  for (var i = 0; i < max; i++) {
    let tx1 = floor(random(x1, x2));
    let ty1 = floor(random(y1, y2));
    noStroke();
    fill(0, 0, 0, map(i, 0, max, 0, 100));

    if (i % 2 == 0) {
      ellipse(tx1, ty1, size, map(size, 0, max, size, size * 3));
    } else {
      ellipse(tx1, ty1, map(size, 0, max, size, size * 3), size);
    }
  }
}

function draw() {
  noLoop();
  let x1 = windowWidth / 4;
  let y1 = windowHeight / 4;
  let x2 = x1 + windowWidth / 2;
  let y2 = y1 + windowHeight / 2;
  let tSize = 6;
  let max = 75000;

  //doTexture([x1, y1, x2, y2], tSize, max);

  stroke(0, 0, 0, 100);
  strokeWeight(1);
  noFill();
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      //rect(c * cW, r * cH, cW, cH);
    }
  }

  for (var i = 0; i < cells.length; i++) {
    fill(0,0,50,50);
    noStroke();
    ellipse(cells[i].x, cells[i].y, cells[i].r * 2, cells[i].r * 2);
  }

}
