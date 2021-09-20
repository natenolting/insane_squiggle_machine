let cols = 13;
let rows = 13;
let cW = 100;
let cH = 100;
let pallets = [
  ['f72585', 'b5179e', '7209b7', '560bad', '480ca8', '3a0ca3', '3f37c9', '4361ee', '4895ef', '4cc9f0'],
  ['d9ed92', 'b5e48c', '99d98c', '76c893', '52b69a', '34a0a4', '168aad', '1a759f', '1e6091', '184e77'],
  ['f94144', 'f3722c', 'f8961e', 'f9844a', 'f9c74f', '90be6d', '43aa8b', '4d908e', '577590', '277da1'],
  ['ffbe0b', 'fb5607', 'ff006e', '8338ec', '3a86ff'],
  ['011627', 'fdfffc', '2ec4b6', 'e71d36', 'ff9f1c'],
  ['2b2d42', '8d99ae', 'edf2f4', 'ef233c', 'd90429'],
];
let hexColors;
let helpers = new Helpers();
let colorClass = new Colors();
let saveId = helpers.makeid(10);
let saveCount = 0;
let cells = [];
function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
  background(0, 0, 100, 100);

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

function populateCells() {
  cells = [];
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      cells.push({
          x: c * cW,
          y: r * cH,
          w: cW,
          h: cH,
        });
    }
  }
}

function draw() {
  let colors = [];
  let colorA;
  let colorB;
  let colorC;
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];

  for (var i = 0; i < hexColors.length; i++) {
    let rgb = colorClass.HEXtoRGB(hexColors[i]);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  }

  newColors = helpers.shuffleArray(colors);
  colorA = newColors[0];
  colorB = newColors[1];
  colorC = newColors[2];

  noLoop();
  background(0, 0, 100, 100);
  populateCells();

  stroke(colorA.h, colorA.s, colorA.l, 100);
  noFill();

  let shape = new VectorShape(10, width - 10, 10, height - 10).ellipse();
  let shapeFill = [];

  let shapeCon = new Overlap([], shape).getShapeBoundingBox();
  let shapeOverlap = new Overlap(
    [
        createVector(shapeCon.x - 2, shapeCon.y - 2),
        createVector(shapeCon.x + shapeCon.w + 2, shapeCon.y - 2),
        createVector(shapeCon.x + shapeCon.w + 2, shapeCon.y + shapeCon.h + 2),
        createVector(shapeCon.x, shapeCon.y + shapeCon.h + 2),
        createVector(shapeCon.x - 2, shapeCon.y + shapeCon.h + 2),
    ],
    shape,
    0.005
  ).findOverlap();

  // draw the ellipse
  beginShape();

  stroke(colorA.h, colorA.s, colorA.l, 100);
  strokeWeight(10);
  fill(colorA.h, colorA.s, colorA.l, 100);
  for (var i = 0; i < shape.length; i++) {
    vertex(shape[i].x, shape[i].y);
  }

  endShape(CLOSE);

  fill(colorB.h, colorB.s, colorB.l, 100);
  noStroke();
  let triangles = [];
  let maxTries = 10000000;
  let tries = 0;
  while (tries < maxTries) {
    tries++;

    let first = shapeOverlap[floor(random(shapeOverlap.length - 3))];
    let second = shapeOverlap[floor(random(shapeOverlap.length - 3))];
    let third = shapeOverlap[floor(random(shapeOverlap.length - 3))];
    let collide = false;

    // check that it doesn't collide with the hole
    // if (collidePolyPoly(hole, [first, second, third, first])) {
    //   continue;
    // }

    // check it doesn't collide with existing elements
    for (var s = 0; s < triangles.length; s++) {
      if (
        collidePolyPoly(triangles[s], [first, second, third, first])
        || collidePointPoly(first.x, first.y, triangles[s])
        || collidePointPoly(second.x, second.y, triangles[s])
        || collidePointPoly(third.x, third.y, triangles[s])
      ) {
        collide = true;
        break;
      }
    }

    if (collide) {
      continue;
    }

    // Check the area and see if it's anm empty shape.
    // Usinging Heron's formula - https://en.wikipedia.org/wiki/Heron%27s_formula
    let distA = dist(first.x, first.y, second.x, second.y);
    let distB = dist(second.x, second.y, third.x, third.y);
    let distC = dist(third.x, third.y, first.x, first.y);
    let semiP = (distA + distB + distC) / 2;
    let area = sqrt(semiP * (semiP - distA) * (semiP - distB) * (semiP - distC));

    if (semiP < 1 || area < 1 || isNaN(area)) {
      continue;
    }
    //
    // console.log('--------------------------------');
    // console.log(`Try: ${totalTries}`);
    // console.log(`Semi Perim: ${semiP}`);
    // console.log(`Area: ${area}`);
    // console.log('--------------------------------');

    // points on the sides to create the curved corners
    let lStart = 1 / 16;
    let lEnd = 1 - lStart;
    let firstA = createVector(lerp(first.x, second.x, lStart), lerp(first.y, second.y, lStart));
    let firstB = createVector(lerp(first.x, second.x, lEnd), lerp(first.y, second.y, lEnd));
    let secondA = createVector(lerp(second.x, third.x, lStart), lerp(second.y, third.y, lStart));
    let secondB = createVector(lerp(second.x, third.x, lEnd), lerp(second.y, third.y, lEnd));
    let thirdA = createVector(lerp(third.x, first.x, lStart), lerp(third.y, first.y, lStart));
    let thirdB = createVector(lerp(third.x, first.x, lEnd), lerp(third.y, first.y, lEnd));


    beginShape();
    vertex(firstA.x, firstA.y);
    bezierVertex(second.x, second.y, firstB.x, firstB.y, firstB.x, firstB.y);
    bezierVertex(second.x, second.y, secondA.x, secondA.y, secondA.x, secondA.y);
    vertex(secondA.x, secondA.y);
    bezierVertex(third.x, third.y, secondB.x, secondB.y, secondB.x, secondB.y);
    bezierVertex(third.x, third.y, thirdA.x, thirdA.y, thirdA.x, thirdA.y);
    vertex(thirdA.x, thirdA.y);
    bezierVertex(first.x, first.y, thirdB.x, thirdB.y, thirdB.x, thirdB.y);
    bezierVertex(first.x, first.y, firstA.x, firstA.y, firstA.x, firstA.y);
    vertex(firstA.x, firstA.y);
    endShape(CLOSE);

    triangles.push([first, second, third]);

  }

  let variance = floor(random(12, 64));
  for (var i = 0; i < shapeOverlap.length; i++) {
    fill(colorA.h, colorA.s, colorA.l, 100);
    if (i % variance) {
      // ellipse(shapeOverlap[i].x, shapeOverlap[i].y, cW / 8, cH / 8);
      // ellipse(shapeOverlap[i].x, shapeOverlap[i].y, cW / 16, cH / 16);
      // ellipse(shapeOverlap[i].x, shapeOverlap[i].y, cW / 32, cH / 32);
      ellipse(shapeOverlap[i].x, shapeOverlap[i].y, cW / 42, cH / 42);
    }
  }
}
