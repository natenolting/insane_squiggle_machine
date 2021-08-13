let cols = 10;
let rows = 10;
let cW = 65;
let cH = 65;
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
  populateCells();
  noFill();
  stroke(0, 0, 50, 100);
  for (var i = 0; i < cells.length; i++) {
    rect(cells[i].x, cells[i].y, cells[i].w, cells[i].h);
  }

  for (var c = 0; c < 4; c++) {

    let shape = new CreateShape(c * cW, cW * (5 + c), c * cH, cH * (2 + c)).pill();
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
      0.005
    ).findOverlap();

    noFill();
    stroke(0, 0, 0, 100);
    for (var i = 0; i < shapeOverlap.length; i++) {

      if (i % 2 === 0) {
        strokeWeight(
          map(
            (shapeOverlap[i].y + shapeOverlap[i].x) / 2,
            (shapeCon.y + shapeCon.x) / 2,
            ((shapeCon.y + shapeCon.h) + (shapeCon.x + shapeCon.w)) / 2,
            .5,
            3
          )
        );
        point(shapeOverlap[i].x, shapeOverlap[i].y);
      }
    }
  }





  // var n = 4;
  // var points = Math.pow(10, n);
  // //points 			= 100 					//number of points
  // pointAngle = 360 / points; //angle between points
  // radius = 100; //length of each line from centre to edge of circle
  // let v = [];
  // for (angle = 180; angle < 360; angle = angle + pointAngle) {
  //   let x = cos(radians(angle)) * radius; //convert angle to radians for x and y coordinates
  //   let y = sin(radians(angle)) * radius;
  //   //line(radius, radius, x+radius, y+radius); //draw a line from each point back to the centre
  //   v.push(createVector(x + radius + 10, y + radius + 10));
  // }
  // v.push(createVector(v[v.length - 1].x, v[v.length - 1].y + 110));
  // for (angle = 0; angle < 180; angle = angle + pointAngle) {
  //   let x = cos(radians(angle)) * radius; //convert angle to radians for x and y coordinates
  //   let y = sin(radians(angle)) * radius;
  //   //line(radius, radius, x+radius, y+radius); //draw a line from each point back to the centre
  //   v.push(createVector(x + radius + 10, y + radius + 110));
  // }
  //
  // v.push(createVector(v[0].x, v[0].y));
  //
  // c = (new Overlap([], v)).getShapeBoundingBox();
  // con = [
  //   createVector(c.x - 10, c.y - 10),
  //   createVector(c.x + c.w + 10, c.y - 10),
  //   createVector(c.x + c.w + 10, c.y + c.h + 10),
  //   createVector(c.x, c.y + c.h + 10),
  //   createVector(c.x - 10, c.y + c.h + 10),
  // ];
  //
  // noFill();
  //
  // let o = new Overlap(con, v, 0.025).findOverlap();
  //
  // noFill();
  // stroke(0,0,0,100);

  // for (var i = 0; i < o.length; i++) {
  //
  //   if (i % 2 === 0) {
  //     strokeWeight(map(o[i].y, con[0].y, con[con.length - 1].y, 1, 3));
  //     point(o[i].x, o[i].y);
  //   }
  // }

}
