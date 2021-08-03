let cols = 20;
let rows = 20;
let cW = 25;
let cH = 11;
let wW = 0;
let wH = 0;
let tSize = 6;
let max = 500;
let result;
let cells = [];
let saveCount = 0;
let cellsWidthTotal;
let cellsHeightTotal;

function setup() {
  createCanvas(4000, 4000);
  wW = width;
  wH = height;
  colorMode(HSB, 359, 100, 100, 100);

  for (var i = 0; i < cols * rows; i++) {
    let newCell = {
      w: int(random(cols * cW)),
      h: int(random(rows * cH)),
    };
    cells.push(newCell);



  }

  results = { w, h } =  potpack(cells);
  cellsWidthTotal = w;
  cellsHeightTotal = h;
  console.log(cellsWidthTotal);
  console.log(cellsHeightTotal);
  console.log(cells);
}

function saveFileName() {
  let fileName = `screenshot_i_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function doTexture(coodinates, size, max, hu=0, s=0, b=0) {
  x1 = coodinates[0];
  y1 = coodinates[1];
  x2 = coodinates[2];
  y2 = coodinates[3];
  for (var i = 0; i < max; i++) {
    let tx1 = floor(random(x1, x2));
    let ty1 = floor(random(y1, y2));
    noStroke();
    fill(hu, s, b, map(i, 0, max, 0, 100));

    if (i % 2 == 0) {
      ellipse(tx1, ty1, size, map(size, 0, max, size, size * 3));
    } else {
      ellipse(tx1, ty1, map(size, 0, max, size, size * 3), size);
    }
  }
}

function draw() {
  noLoop();
  background(0,0,100,100);
  translate(width / 1.125, height / 9);
  scale(0.95);
  rotate(HALF_PI);

  let hu = int(random(359));
  let s = 100;
  let b = 100;
  for (var i = 0; i < cells.length; i++) {

    if (cells[i].x === 0) {
      b = int(random(100));
    }

    let x1 = cells[i].x;
    let y1 = cells[i].y;
    let x2 = cells[i].x + cells[i].w;
    let y2 = cells[i].y + cells[i].h;

    doTexture([x1, y1, x2, y2], tSize, max, hu, s, b);
    // fill(hu, s, b, 100);
    // noStroke();
    // rect(x1, y1, cells[i].w, cells[i].h);
  }

}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }
}
