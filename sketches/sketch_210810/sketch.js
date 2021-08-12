let cols = 6;
let rows = 8;
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

function setup() {
  createCanvas(cols * cW, rows * cH);
  colorMode(HSL, 359, 100, 100, 100);
}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

// Draws bounding-box around
// the given polygon!
function getBBox(x, y) {
  //stroke(255, 0, 0);
  //noFill();
  let rx = min(x), ry = min(y);
  let w = max(x) - rx, h = max(y) - ry;
  return { x: rx, y: ry, w: w, h: h };
  //rect(rx, ry, w, h);
}

function draw() {
  let newColors = [];
  noLoop();
  noFill();
  hexColors = pallets[Math.floor(_.random(pallets.length - 1))];
  let colors = [];
  hexColors.forEach((item) => {
    let rgb = colorClass.HEXtoRGB(item);
    let hsl = colorClass.RGBtoHSL(rgb[0], rgb[1], rgb[2]);
    colors.push(hsl);
  });
  newColors = helpers.shuffleArray(colors);

  let container = [
    createVector(100, 100),
    createVector(200, 100),
    createVector(300, 100),
    createVector(200, 200),
    createVector(100, 200),
    createVector(100, 100),
  ];

  beginShape();
  for (let i = 0; i < container.length; i++) {
    vertex(container[i].x, container[i].y);
  }

  endShape();

  let shape = [
    createVector(150, 150),
    createVector(160, 140),
    createVector(250, 250),
    createVector(100, 250),
    createVector(50, 100),
    createVector(150, 150),
  ];

  let shapeX = [];
  let shapeY = [];

  beginShape();

  for (let i = 0; i < shape.length; i++) {
    vertex(shape[i].x, shape[i].y);
    shapeX.push(shape[i].x);
    shapeY.push(shape[i].y);
  }

  endShape();

  let newShape = (new Overlap(container, shape)).findOverlap();
  console.log(newShape);

  //beginShape();
  noFill();
  stroke(0,0,50,50);
  strokeWeight(1);
  for (let i = 0; i < newShape.length; i++) {
    if (i % 1 === 0) {
      point(newShape[i].x, newShape[i].y);
    }
  }

  endShape();

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

// /**
//   Borroed from https://stackoverflow.com/a/29915728/405758
//   array of coordinates of each vertex of the polygon
//   var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
//   inside([ 1.5, 1.5 ], polygon); // true
// */
// function inside(point, vs) {
//   // ray-casting algorithm based on
//   // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
//
//   const x = point[0];
//   const y = point[1];
//   let ins = false;
//
//   for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
//     const xi = vs[i][0];
//     const yi = vs[i][1];
//     const xj = vs[j][0];
//     const yj = vs[j][1];
//
//     let intersect = ((yi > y) != (yj > y))
//         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//     if (intersect) ins = !ins;
//   }
//
//   return ins;
// };
