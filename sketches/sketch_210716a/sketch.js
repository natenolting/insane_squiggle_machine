let cols = 0;
let rows = 0;
let cW = 25;
let cH = 25;
let wW = 0;
let wH = 0;
function setup() {
  wW = windowWidth * 0.9;
  wH = windowHeight * 0.9;
  createCanvas(wW, wH);
  colorMode(HSB, 359, 100, 100, 100);
  cols = floor(wW / cW);
  rows = floor(wH / cH);
  if ((cW * cols) % wW !== 0) {
    cW += (wW - cW * cols) / cols;
  }

  if ((cH * rows) % wH !== 0) {
    cH += (wH - cH * rows) / rows;
  }
}

function draw() {
  noLoop();
  background(0, 0, 100, 100);
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (c % 2 === 0) {
        bezier(
          r * cW + cW,
          c * cH,
          r * cW + cW,
          c * cH + cH / 2,
          r * cW,
          c * cH + cH / 2,
          r * cW,
          c * cW + cH
        );
      } else {
        bezier(
          r * cW,
          c * cH,
          r * cW,
          c * cH + cH / 2,
          r * cW + cW,
          c * cH + cH / 2,
          r * cW + cW,
          c * cW + cH
        );
      }
    }
  }
}
