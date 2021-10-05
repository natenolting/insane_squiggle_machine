let canvasWidth = 1000;
let canvasHeight = 1000;
let cols = 15;
let rows = 15;
let cW = canvasWidth / cols;
let cH = canvasHeight / rows;
let baseStroke = 4;
let cells;
let helpers = new Helpers();
let colorClass = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
let pallets = [
  // https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51
  ["264653","2a9d8f","e9c46a","f4a261","e76f51"],
  // https://coolors.co/22223b-4a4e69-9a8c98-c9ada7-f2e9e4
  ["22223b","4a4e69","9a8c98","c9ada7","f2e9e4"],
  // https://coolors.co/ffbe0b-fb5607-ff006e-8338ec-3a86ff
  ["ffbe0b","fb5607","ff006e","8338ec","3a86ff"]

];
let hexColors;
let colorA;
let colorB;
let colorC;
let colorD;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);
  pixelDensity(1);
  cells = (new Cells(cols, rows, cW, cH)).populateCells();

}

function draw() {
  let current;
  let circles = [];

  noLoop();
  background(0, 0, 100, 100);


  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  colors = [];
  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  cColors = helpers.shuffleArray(colors);
  colorA = cColors[0];
  colorB = cColors[1];
  colorC = cColors[2];
  colorD = cColors[3];

  //stroke(0, 0, 90, 100);
  //strokeWeight(1);
  noStroke();
  fill(colorD.h, colorD.s, colorD.l, 100);
  rect(1, 1, canvasWidth - 2, canvasHeight - 2);

  for (var i = 0; i < cells[0].length; i++) {
    current = cells[0][i];
    let x1 = current.x + current.w / 2;
    let y1 = current.y + current.h / 2;
    let w1;
    let h1;
    let inter;

    // skip ourside cells
    if (
      current.row === 0
      || current.col === 0
      || current.row === rows - 1
      || current.col === cols - 1
    ) {
      continue;
    }

    // skip second inner col/row
    if (
      current.row === 1
      || current.col === 1
      || current.row === rows - 2
      || current.col === cols - 2
    ) {
      continue;
    }

    // let f = helpers.coinFlip();
    // if (f) {
    //   fill(0, 0, 100, 100);
    // } else {
    //   noFill();
    // }

    let circRoll = helpers.rollADie(10);
    switch (circRoll) {
      case (1):
        w1 = current.w / 2;
        h1 = current.h / 2;

        if (intersectOthers(x1, y1, w1, circles)) {
          continue;
        }

        circles.push(new Cell(
          current.row,
          current.col,
          x1,
          y1,
          w1,
          h1,
          false,
        ));
        break;

      case (2):
        w1 = current.w;
        h1 = current.h;

        if (intersectOthers(x1, y1, w1, circles)) {
          continue;
        }

        circles.push(new Cell(
          current.row,
          current.col,
          x1,
          y1,
          w1,
          h1,
          false,
        ));
        break;

      case (3):
        w1 = current.w * 2;
        h1 = current.h * 2;

        if (intersectOthers(x1, y1, w1, circles)) {
          continue;
        }

        circles.push(new Cell(
          current.row,
          current.col,
          x1,
          y1,
          w1,
          h1,
          false,
        ));
        break;

      case (4):
        w1 = current.w * 4;
        h1 = current.h * 4;

        if (intersectOthers(x1, y1, w1, circles)) {
          continue;
        }

        circles.push(new Cell(
          current.row,
          current.col,
          x1,
          y1,
          w1,
          h1,
          false,
        ));
        break;
    }
  }

  for (var i = 0; i < circles.length; i++) {
    current = circles[i];
    let cf = helpers.coinFlip();
    noStroke();
    if (cf) {
      fill(colorA.h, colorA.s, colorA.l, 100);
    } else {
      fill(colorB.h, colorB.s, colorB.l, 100);
    }

    ellipse(current.x, current.y, current.w, current.h);
  }

  stroke(colorC.h, colorC.s, colorC.l, 100);
  noFill();
  for (var i = 0; i < cells[0].length; i++) {
    current = cells[0][i];

    // skip ourside cells
    if (
      current.row === 0
      || current.col === 0
      || current.row === rows - 1
      || current.col === cols - 1
    ) {
      continue;
    }

    // skip second inner col/row
    if (
      current.row === 1
      || current.col === 1
      || current.row === rows - 2
      || current.col === cols - 2
    ) {
      continue;
    }

    noFill();
    strokeCap(ROUND);
    let strokeVariance = helpers.rollADie(6);
    switch (strokeVariance) {
      case (1):
        strokeWeight(baseStroke);
        break;
      case (2):
        strokeWeight(baseStroke * 2);
        break;
      case (3):
        strokeWeight(baseStroke / 2);
        break;
      case (4):
        strokeWeight(baseStroke * 4);
        break;
      case (5):
        strokeWeight(baseStroke / 4);
        break;
      default:
        strokeWeight(baseStroke);
        break;
    }

    let direction = helpers.rollADie(8);
    noFill();
    beginShape(LINES);
    switch (direction) {
      case (1):
        vertex(current.x - current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w + current.w / 2, current.y + current.h / 2);
        break;
      case (2):
        vertex(current.x, current.y + current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w, current.y + current.h / 2);
        break;
      case (3):
        vertex(current.x + current.w / 2, current.y - current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h + current.h / 2);
        break;
      case (4):
        vertex(current.x + current.w / 2, current.y);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        break;
      case (5):
        vertex(current.x + current.w + current.w / 2, current.y - current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x - current.w / 2, current.y + current.h + current.h / 2);
      case (6):
        vertex(current.x + current.w, current.y);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x, current.y + current.h);
        break;
      case (7):
        vertex(current.x - current.w / 2, current.y - current.h / 2);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w + current.w / 2, current.y + current.h + current.h / 2);
        break;
      case (8):
        vertex(current.x, current.y);
        vertex(current.x + current.w / 2, current.y + current.h / 2);
        vertex(current.x + current.w, current.y + current.h);
        break;
      default:
        break;

    }
    endShape(CLOSE);
  }

  for (var i = 0; i < circles.length; i++) {
    current = circles[i];
    let cf = helpers.coinFlip();
    let ff = helpers.coinFlip();
    let roll = helpers.rollADie(4);
    noStroke();
    if (cf) {
      if (ff) {
        switch (roll) {
          case (1):
              fill(colorA.h, colorA.s, colorA.l, 100);
            break;
          case (2):
              fill(colorB.h, colorB.s, colorB.l, 100);
            break;
          case (3):
              fill(colorC.h, colorC.s, colorC.l, 100);
            break;
          case (4):
              fill(colorD.h, colorD.s, colorD.l, 100);
            break;
          default:
            fill(0, 0, 100, 100);
            break;

        }
        stroke(colorC.h, colorC.s, colorC.l, 100);
        strokeWeight(baseStroke);
      } else {
        noFill();
        noStroke();
      }

      ellipse(current.x, current.y, current.w, current.h);
    }
  }

}

function intersect(x1, y1, r1, x2, y2, r2) {
  let d = dist(x1, y1, x2, y2);
  if (d < r1 + r2) {
    return true;
  } else {
    return false;
  }
}

function intersectOthers(x1, y1, w1, others) {
  let inter = false;
  for (var i = 0; i < others.length; i++) {
    if (intersect(x1, y1, w1 / 2, others[i].x, others[i].y, others[i].w / 2)) {
      inter = true;
      break;
    }
  }

  return inter;
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
