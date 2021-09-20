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
  background(0,0,100,100);

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
  noLoop();
  background(0, 0, 100, 100);
  populateCells();
  noFill();
  stroke(0, 0, 0, 10);
  for (var i = 0; i < cells.length; i++) {
    rect(cells[i].x, cells[i].y, cells[i].w, cells[i].h);
  }

  stroke(0, 0, 0, 100);
  noFill();

  let shape = new VectorShape(0, width, 0, height).ellipse();
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
    0.1
  ).findOverlap([]);

  let triangles = [];
  let maxTries = 1000000;
  let tries = 0;
  let totalTries = 0;
  while (tries < maxTries) {
    totalTries++;
    if (totalTries > maxTries * 3) {
      break;
    }

    let first = shapeOverlap[floor(random(shapeOverlap.length - 3))];
    let second = shapeOverlap[floor(random(shapeOverlap.length - 3))];
    let third = shapeOverlap[floor(random(shapeOverlap.length - 3))];

    // check it doesn't collide with existing elements
    let collide = false;
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

    // console.log('--------------------------------');
    // console.log(`Try: ${totalTries}`);
    // console.log(`Semi Perim: ${semiP}`);
    // console.log(`Area: ${area}`);
    // console.log('--------------------------------');

    //triangle(first.x, first.y, second.x, second.y, third.x, third.y)
    strokeWeight(5);

    let firstA = createVector(lerp(first.x, second.x, .125), lerp(first.y, second.y, .125));
    let firstB = createVector(lerp(first.x, second.x, .875), lerp(first.y, second.y, .875));
    let secondA = createVector(lerp(second.x, third.x, .125), lerp(second.y, third.y, .125));
    let secondB = createVector(lerp(second.x, third.x, .875), lerp(second.y, third.y, .875));
    let thirdA = createVector(lerp(third.x, first.x, .125), lerp(third.y, first.y, .125));
    let thirdB = createVector(lerp(third.x, first.x, .875), lerp(third.y, first.y, .875));

    point(firstA);
    point(firstB);
    point(secondA);
    point(secondB);
    point(thirdA);
    point(thirdB);

    strokeWeight(1);
    beginShape();
    vertex(firstA.x, firstA.y);
    //vertex(firstB.x, firstB.y);
    bezierVertex(second.x, second.y, firstB.x, firstB.y, firstB.x, firstB.y);
    bezierVertex(second.x, second.y, secondA.x, secondA.y, secondA.x, secondA.y);
    vertex(secondA.x, secondA.y);
    //vertex(secondB.x, secondB.y);
    bezierVertex(third.x, third.y, secondB.x, secondB.y, secondB.x, secondB.y);
    bezierVertex(third.x, third.y, thirdA.x, thirdA.y, thirdA.x, thirdA.y);
    vertex(thirdA.x, thirdA.y);
    //vertex(thirdB.x, thirdB.y);
    bezierVertex(first.x, first.y, thirdB.x, thirdB.y, thirdB.x, thirdB.y);
    bezierVertex(first.x, first.y, firstA.x, firstA.y, firstA.x, firstA.y);
    vertex(firstA.x, firstA.y);
    endShape(CLOSE);

    triangles.push([first, second, third]);
    tries++;

    //console.log(tries);
  }

  // push();
  // translate(0, height / 2);
  // let shape3 = new CreateShape(cW, width - cW, cH * -4.5, cH * 4.5).pill();
  // let hole3 = [];
  //
  // fillShape(shape3, hole3, 0.005, 2);
  // pop();
  //
  // push();
  // translate(cW * 5, cH * 5);
  // rotate(radians(-45));
  // let shape = new CreateShape(cW * -2, cW * 2, cH * -2, cH * 2).ellipse();
  // let hole = new CreateShape(cW * -.5, cW * .5, cH * -.5, cH * .5).ellipse();
  // fillShape(shape, hole, 0.004, 2);
  // pop();
  //
  //
  // push();
  // translate(width - cW * 5, cH * 5);
  // rotate(radians(45));
  // let shape2 = new CreateShape(cW * -2, cW * 2, cH * -2, cH * 2).ellipse();
  // let hole2 = new CreateShape(cW * -.5, cW * .5, cH * -.5, cH * .5).ellipse();
  // fillShape(shape2, hole2, 0.004, 2);
  //
  // pop();
  //
  // push();
  // translate(cW * 5, cH * 5);
  // fill(0,0,100,100);
  // ellipse(0, 0, cW, cH);
  // pop();
  //
  // push();
  // translate(width - cW * 5, cH * 5);
  // fill(0,0,100,100);
  // ellipse(0, 0, cW, cH);
  // pop();
  //
  // push();
  //   translate(0, height / 2);
  //   fillShape([],[], 0.004, 2);
  // pop();






}

function fillShape(shape, hole = [], density = 0.005, skip = 2, shadow = 'none') {
  let strokeLow = ((cW + cH) / 2) * density;
  let strokeHigh = ((cW + cH) / 2) * (density * 10);
  let shapeCon = new Overlap([], shape).getShapeBoundingBox();
  let shapeOverlap = new Overlap(
    [
        createVector(shapeCon.x - 10, shapeCon.y - 10),
        createVector(shapeCon.x + shapeCon.w + 10, shapeCon.y - 10),
        createVector(shapeCon.x + shapeCon.w + 10, shapeCon.y + shapeCon.h + 10),
        createVector(shapeCon.x, shapeCon.y + shapeCon.h + 10),
        createVector(shapeCon.x - 10, shapeCon.y + shapeCon.h + 10),
    ],
    shape,
    density
  ).findOverlap(hole);

  for (var i = 0; i < shapeOverlap.length; i++) {

    if (i % skip === 0) {

      switch (shadow) {
        case ('south east'):
          strokeWeight(
            map(
              (shapeOverlap[i].y + shapeOverlap[i].x) / 2,
              (shapeCon.y + shapeCon.x) / 2,
              ((shapeCon.y + shapeCon.h) + (shapeCon.x + shapeCon.w)) / 2,
              strokeLow,
              strokeHigh
            )
          );
          break;

        default:
          noStroke();
          fill(0, 0, 0, 100);
          ellipse(shapeOverlap[i].x, shapeOverlap[i].y, (strokeLow + strokeHigh) / 2);
          break;
      }
    }
  }
}
