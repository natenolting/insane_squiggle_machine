let cols = 0;
let rows = 0;
let cW = 100;
let cH = 100;
let wW = 0;
let wH = 0;
let opac = 0;
let r = 0;
let saveCount = 0;
function setup() {
  wW = windowWidth * 0.95;
  wH = windowHeight * 0.95;
  createCanvas(wW, wH);
  colorMode(HSB, 359, 100, 100, 100);
  cols = floor(wW / cW);
  rows = floor(wH / cH);
}

function element(object) {
  push();
  // properties
  variance = _.has(object, 'variance') ? object.variance : 0.01;
  positionX = _.has(object, 'positionX') ? object.positionX : wW / 2;
  positionY = _.has(object, 'positionY') ? object.positionY : wH / 2;
  cellW = _.has(object, 'cellW') ? object.cellW : cW;
  cellH = _.has(object, 'cellH') ? object.cellH : cH;
  rotation = _.has(object, 'rotation') ? object.rotation : 4.0;
  size = _.has(object, 'size') ? object.size : 1.0;
  columns = _.has(object, 'columns') ? object.columns : cols;

  noFill();
  translate(positionX, positionY);
  rotate(rotation);
  opac = map(variance, float(rows), 0.0, 0.0, 5.0);
  stroke(0, 0, 0, opac);
  scale(size);
  for (var c = 0; c < columns; c++) {
    if (c % 2 === 0) {
      bezier(
        variance * cellW + cellW,
        c * cellH,
        variance * cellW + cellW,
        c * cellH + cellH / 2,
        variance * cellW,
        c * cellH + cellH / 2,
        variance * cellW,
        c * cellW + cellH
      );
    } else {
      bezier(
        variance * cellW,
        c * cellH,
        variance * cellW,
        c * cellH + cellH / 2,
        variance * cellW + cellW,
        c * cellH + cellH / 2,
        variance * cellW + cellW,
        c * cellW + cellH
      );
    }
  }
  pop();
}

function draw() {
  element({
    variance: r,
    rotation: r / 10,
    positionX: wW / 2,
    positionY: 0,
    cellW: 50,
    cellH: 50,
    columns: 250,
  });
  element({
    variance: r,
    rotation: r / 3,
    positionX: wW / 2,
    positionY: 0,
    cellW: 500,
    cellH: 50,
    columns: 250,
  });
//
//   element({
//     variance: r,
//     rotation: r / 11,
//     positionX: wW / 2,
//     positionY: wH / 2,
//     cellW: 30,
//     cellH: 30,
//     columns: 250,
//     size: r * 0.01,
//   });

  // element({
  //   variance: r,
  //   cellW: 100,
  //   cellH: 100,
  // });
  //
  // element({
  //   variance: r,
  //   cellW: 500,
  //   cellH: 200,
  // });
  //
  // element({
  //   variance: r,
  //   cellW: 100,
  //   cellH: 100,
  //   columns: 1000,
  //   rotation: r,
  //   positionX: wW / 4,
  //   positionY: wH / 4,
  //   size: r * 0.1,
  // });

  r -= 0.01;
}

function keyPressed() {
  if (key == 's') {
    save(`screenshot_${saveCount}.png`);
    saveCount++;
  }
}
