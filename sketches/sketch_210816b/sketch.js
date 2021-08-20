let cols = 100;
let rows = 100;
let cW = 20;
let cH = 20;
let helpers = new Helpers();
let colors = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
let extraLargeChance = 100;
let paperHexColors = ["ffe699","ffebae","fff0c2"]
let paperColors = [];
let pallets = [
  ["e63946","f1faee","a8dadc","457b9d","1d3557"],
  ["000000","14213d","fca311","e5e5e5","ffffff"],
  ["f72585","b5179e","7209b7","560bad","480ca8","3a0ca3","3f37c9","4361ee","4895ef","4cc9f0"],
  ["003049","d62828","f77f00","fcbf49","eae2b7"],
  ["006d77","83c5be","edf6f9","ffddd2","e29578"],
  ["2b2d42","8d99ae","edf2f4","ef233c","d90429"],
  ["f4f1de","e07a5f","3d405b","81b29a","f2cc8f"],
  ["d8f3dc","b7e4c7","95d5b2","74c69d","52b788","40916c","2d6a4f","1b4332","081c15"],
  ["f94144","f3722c","f8961e","f9c74f","90be6d","43aa8b","577590"],
  ["7400b8","6930c3","5e60ce","5390d9","4ea8de","48bfe3","56cfe1","64dfdf","72efdd","80ffdb"],
  ["f94144","f3722c","f8961e","f9c74f","90be6d","43aa8b","577590"],
  ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"],
  ["007f5f","2b9348","55a630","80b918","aacc00","bfd200","d4d700","dddf00","eeef20","ffff3f"],
]
let palletHexColors = ["8ecae6","219ebc","023047","ffb703","fb8500"];
let palletColors = [];

function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);

  paperHexColors.forEach(item => {
    let rgb = colors.HEXtoRGB(item);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    paperColors.push(hsl);
  });

  palletHexColors.forEach(item => {
    let rgb = colors.HEXtoRGB(item);
    let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    palletColors.push(hsl);
  });

  for (var i = 0; i < pallets.length; i++) {
    palletColors[i] = [];
    pallets[i].forEach(item => {
      let rgb = colors.HEXtoRGB(item);
      let hsl = colors.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
      palletColors[i].push(hsl);
    });
  }

}

function paper(dots = 10000) {
  let paperColor = {
    h: paperColors[0].h,
    s: paperColors[0].s,
    l: paperColors[0].l + Math.random() * 8,
  };

  fill(paperColor.h, paperColor.s, paperColor.l, 100);
  rect(0,0,width, height);

  noFill();
  for (let i = 0; i < dots; i++) {
    let x1 = Math.random() * width;
    let y1 = Math.random() * height;
    let theta = Math.random() * 2 * Math.PI;
    let segmentLength = Math.random() * 5 + 2;
    let x2 = Math.cos(theta) * segmentLength + x1;
    let y2 = Math.sin(theta) * segmentLength + y1;
    stroke(
      paperColors[1].h,
      paperColors[1].s - Math.random() * 5,
      paperColors[1].l - Math.random() * 50,
      Math.random() * 10
    );

    line(x1, y1, x2, y2);
  }
}

function draw() {
  noLoop();
  const NUM_DOTS = 250000;
  paperColors = helpers.shuffleArray(paperColors);
  palletColors = helpers.shuffleArray(palletColors);
  background(paperColors[0].h, paperColors[0].h, paperColors[0].l, 100);

  paper(NUM_DOTS);

  stroke(0,0,0,100);
  noFill();
  strokeCap(ROUND);
  strokeJoin(ROUND);
  let startX = width / 2;
  let startY = height / 2;
  let vectors = [];

  let pallet = random(palletColors);
  drawDeflection(width * .125, height * .125, random(100, 200), pallet);
  drawDeflection(width * .5, height * .125, random(100, 200), pallet);
  drawDeflection(width * .875, height * .125, random(100, 200), pallet);

  drawDeflection(width * .125, height * .5, random(100, 200), pallet);
  drawDeflection(width * .5, height * .5, random(100, 200), pallet);
  drawDeflection(width * .875, height * .5, random(100, 200), pallet);

  drawDeflection(width * .125, height * .875, random(100, 200), pallet);
  drawDeflection(width * .5, height * .875, random(100, 200), pallet);
  drawDeflection(width * .875, height * .875, random(100, 200), pallet);

}

function drawDeflection(centerX, centerY, radius = 20, pallet, existing = []) {
  let thisVectors = [];
  thisVectors.push(deflection(centerX, centerY, radius, existing));
  for (var i = 0; i < 1000; i++) {
    if (!thisVectors[thisVectors.length - 1]) {
      break;
    }

    thisVectors.push(
      deflection(
        thisVectors[thisVectors.length - 1].end.x,
        thisVectors[thisVectors.length - 1].end.y,
        radius,
        existing.concat(thisVectors)
      )
    );
  }


  let c = random(pallet);
  let loops = ceil(random(250, 500));
  push();
  if (helpers.coinFlip()) {
    translate(width, height);
    rotate(radians(180));
  }

  for (var d = 0; d < loops; d++) {
    stroke(c.h, c.s, c.l, random(.25, 2));
    strokeWeight(loops - d);
    //ellipse(thisVectors[0].start.x, thisVectors[0].start.y, 20);
    beginShape();
    if (d % 2) {
      rotate(d * .00125);
    } else {
      rotate(d * -.00125);
    }
    //
    // if (helpers.rollADie(20) === 20) {
    //     translate(0, d);
    // }

    //stroke(0,0,0,100);
    for (var i = 0; i < thisVectors.length; i++) {

      if (!thisVectors[i]) {
        break;
      }

      if (typeof thisVectors[i + 1] === 'undefined') {
        vertex(thisVectors[i].start.x, thisVectors[i].start.y);
        vertex(thisVectors[i].end.x, thisVectors[i].end.y);
      } else {

        let lStart = .45;
        let lEnd = 1 - lStart;
        let firstA = createVector(
          lerp(
            thisVectors[i].start.x,
            thisVectors[i].end.x,
            lStart
          ),
          lerp(
            thisVectors[i].start.y,
            thisVectors[i].end.y,
            lStart)
          );
        let firstB = createVector(
          lerp(
            thisVectors[i].start.x,
            thisVectors[i].end.x,
            lEnd
          ),
          lerp(
            thisVectors[i].start.y,
            thisVectors[i].end.y,
            lEnd)
          );
        let secondA = createVector(
          lerp(
            thisVectors[i + 1].start.x,
            thisVectors[i + 1].end.x,
            lStart
          ),
          lerp(
            thisVectors[i + 1].start.y,
            thisVectors[i + 1].end.y,
            lStart)
          );
        let secondB = createVector(
          lerp(
            thisVectors[i + 1].start.x,
            thisVectors[i + 1].end.x,
            lEnd
          ),
          lerp(
            thisVectors[i + 1].start.y,
            thisVectors[i + 1].end.y,
            lEnd)
          );

        vertex(firstA.x, firstA.y);
        bezierVertex(
          thisVectors[i].end.x,
          thisVectors[i].end.y,
          firstB.x,
          firstB.y,
          firstB.x,
          firstB.y
        );
        bezierVertex(
          thisVectors[i + 1].start.x,
          thisVectors[i + 1].start.y,
          secondA.x,
          secondA.y,
          secondA.x,
          secondA.y
        );
        vertex(secondA.x, secondA.y);

      }

    }

    endShape();
  }

  pop();
  return thisVectors;
}

function deflection(centerX = 0, centerY = 0, radius = 20, existing = []) {

  let lowSide = 0.001;
  let highSide = 1 - lowSide;

  //number of points
  let points = 24;

  //angle between points
  let pointAngle = 360 / points;

  let directions = [];
  let validDirection;
  for (let angle = 270; angle < 630; angle = angle + pointAngle) {
    //convert angle to radians for x and y coordinates
    let x1 = cos(radians(angle)) * radius;
    let y1 = sin(radians(angle)) * radius;

    // //draw a line from each point back to the centre
    // line(centerX, centerY, x1 + centerX, y1 + centerY);
    //
    // ellipse(centerX, centerY, 5);
    // ellipse(x1 + centerX, y1 + centerY, 3);
    directions.push({
      start: createVector(centerX, centerY),
      end: createVector(x1 + centerX, y1 + centerY),
    });
  }

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    let current = directions[floor(random(points))];

    // don't allow off screen vectors
    if (
      current.end.x < 0
      || current.end.x > width
      || current.end.y < 0
      || current.end.y > height
    ) {
      continue;
    }

    // not allow vectors that cross existing
    let collide = false;
    for (var e = 0; e < existing.length; e++) {

      // stroke(0,100,72,100)
      // line(lerp(current.start.x, current.end.x, 0.05),
      // lerp(current.start.y, current.end.y, 0.05),
      // lerp(current.start.x, current.end.x, 0.95),
      // lerp(current.start.y, current.end.y, 0.95));
      // stroke(0, 0, 0, 100);

      if (collideLineLine(
        lerp(current.start.x, current.end.x, lowSide),
        lerp(current.start.y, current.end.y, lowSide),
        lerp(current.start.x, current.end.x, highSide),
        lerp(current.start.y, current.end.y, highSide),
        existing[e].start.x, existing[e].start.y, existing[e].end.x, existing[e].end.y)
      ) {
        collide = true;
        break;
      }
    }

    if (collide) {
      continue;
    }

    validDirection = {
      start: createVector(
        lerp(current.start.x, current.end.x, lowSide),
        lerp(current.start.y, current.end.y, lowSide)
      ),
      end: createVector(
        lerp(current.start.x, current.end.x, highSide),
        lerp(current.start.y, current.end.y, highSide)
      ),
    };

    break;
  }

  return validDirection;

}

function populateCells(genExtraLarge = false) {
  // extra large multiple
  let eM = 1;
  let newCells = [];
  let newExtraLargeCells = [];
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      let newCell = {
        row: r,
        col: c,
        x: c * cW,
        y: r * cH,
        w: cW,
        h: cH,
        used: false,
      };

      // extra large multiple
      eM = ceil(random(3));
      newCells.push(newCell);
      if (
      genExtraLarge
      && helpers.rollADie(extraLargeChance) === extraLargeChance
      && newCell.x + newCell.w + (cW * eM) < width
      && newCell.y + newCell.h + (cH * eM) < height
      ) {
        let extraLargeCell = {
          row: r,
          col: c,
          x: c * cW,
          y: r * cH,
          w: newCell.w + (cW * eM),
          h: newCell.h + (cH * eM),
          used: false,
        };
        newExtraLargeCells.push(extraLargeCell);
      }
    }
  }

  // check for large cells that overlap others down the line
  for (var i = 0; i < newExtraLargeCells.length; i++) {
    for (var e = i + 1; e < newExtraLargeCells.length; e++) {
      if (intersection(newExtraLargeCells[i], newExtraLargeCells[e])) {
        newExtraLargeCells[e].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(newExtraLargeCells, function (o) { return o.used; });

  // check for normal cells that are overlapped by the large cells
  for (var i = 0; i < newCells.length; i++) {
    for (var e = 0; e < newExtraLargeCells.length; e++) {
      if (intersection(newCells[i], newExtraLargeCells[e])) {
        newCells[i].used = true;
      }
    }
  }

  // filter out overlapping
  _.remove(newCells, function (o) { return o.used; });

  return [newCells, newExtraLargeCells];
}

// https://editor.p5js.org/eric/sketches/HkW2DRKnl
function intersection(rect1, rect2) {
  let x1 = rect2.x;
  let y1 = rect2.y;
  let x2 = x1 + rect2.w;
  let y2 = y1 + rect2.h;
  if (rect1.x > x1) { x1 = rect1.x; }

  if (rect1.y > y1) {
    y1 = rect1.y;
  }

  if (rect1.x + rect1.w < x2) {
    x2 = rect1.x + rect1.w;
  }

  if (rect1.y + rect1.h < y2) {
    y2 = rect1.y + rect1.h;
  }

  return (x2 <= x1 || y2 <= y1) ? false : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
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
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
