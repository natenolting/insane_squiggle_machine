let helpers = new Helpers();
let saveId = helpers.makeid(10);
let saveCount = 0;
let artW = 2400;
let artH = 3000;
console.log(saveId);
function setup() {
	createCanvas(2400 * 2, 3000 * 2);
	// put setup code here
}

function draw() {
  noLoop();
  background(256);
  stroke(0);
  strokeWeight(2);
  noFill();
  //rect(1, 1, artW - 2, artH - 2);
  translate(width / 3.25, height / 12);
  push();
  strokeWeight(1);
  translate(artW * (1 / 2), artH * (1 / 8));
  for (var i = 0; i < 1200; i++) {
    strokeWeight(map(i, 1, 1000, 1, 2));
    push();
    scale(i * (1 / 560));
    translate(-i * (1 / 32), i);

    //stroke(map(i, 0, 360, 0, 100), map(i, 0, 360, 0, 100));
    rotate(radians(i));
    wavy(0, 0, artW * (1 / 4), artH * (1 / 3));

    //ellipse(artW * (1 / 4), artH * (1 / 3), 12);

    pop();
  }

  pop();
  strokeWeight(1);
  push();
  translate(0, artH - (artH * (1/24)));
  rotate(radians(-90));
  for (var rot = 0; rot < 0; rot++) {
    push();
    translate(rot / 10, 0);
    stroke(0);
    //rotate(rot / 10);
    let offset = 10;
    for (var i = offset; i < artW - (artW * (1 / 8)); i += offset) {
      push();
      translate(i, 0);
      wavy(0, 0, artW * (1 / 8), artH * (1 / 2));
      pop();
    }

    for (var i = offset; i < artW - (artW * (1 / 8)); i += offset) {
      push();
      translate(i, artH * (1 / 2));
      wavy(0, 0, artW * (1 / 8), artH * (1 / 4));
      pop();
    }

    for (var i = offset; i < artW - (artW * (1 / 8)); i += offset) {
      push();
      translate(i, artH * (3 / 4));
      wavy(0, 0, artW * (1 / 8), artH * (1 / 8));
      pop();
    }

    for (var i = offset; i < artW - (artW * (1 / 8)); i += offset) {
      push();
      translate(i, artH * (7 / 8));
      wavy(0, 0, artW * (1 / 8), artH * (1 / 8));
      pop();
    }

    pop();
  }

  pop();
}

function wavy(x1, y1, w, h) {

  let x2 = x1 + w;
  let y2 = y1 + h;
  //rect(x1, y1, w, h);


  // ellipse(x2, y1 + h * (1 / 4), 10);
  // ellipse(x1, y1 + h * (1 / 4), 10);
  // ellipse(x1 + w * (1 / 2), y1 + h * (1 / 4), 10);
  //
  // ellipse(x1, y1 + h * (1 / 2), 10);
  //
  // ellipse(x1 + w * (1 / 2), y1 + h * .625, 10);
  // ellipse(x2, y1 + h * (3 / 4), 10);
  //
  // ellipse(x1 + w * (1 / 2), y1 + (h * (25 / 32)), 10);
  // ellipse(x1, y1 + (h * (7 / 8)), 10);
  //
  // ellipse(x1 + w * (1 / 2), y1 + (h * (29 / 32)), 10);
  beginShape();
  vertex(x2, y1);
  bezierVertex(
    x2,
    y1 + h * (1 / 4),
    x1 + w * (1 / 2),
    y1 + h * (1 / 4),
    x1 + w * (1 / 2),
    y1 + h * (1 / 4)
  );
  bezierVertex(
    x1,
    y1 + h * (1 / 4),
    x1,
    y1 + h * (1 / 2),
    x1,
    y1 + h * (1 / 2)
  );
  //vertex(x1, y1 + h * (1 / 2));

  bezierVertex(
    x1,
    y1 + h * (5 / 8),
    x1 + w * (1 / 2),
    y1 + h * (5 / 8),
    x1 + w * (1 / 2),
    y1 + h * (5 / 8)
  );

  bezierVertex(
    x2,
    y1 + h * (5 / 8),
    x2,
    y1 + h * (3 / 4),
    x2,
    y1 + h * (3 / 4)
  );

  //vertex(x2, y1 + h * (3 / 4));

  bezierVertex(
    x2,
    y1 + (h * (25 / 32)),
    x1 + w * (1 / 2),
    y1 + (h * (25 / 32)),
    x1 + w * (1 / 2),
    y1 + (h * (25 / 32))
  );

  bezierVertex(
    x1,
    y1 + (h * (25 / 32)),
    x1,
    y1 + (h * (7 / 8)),
    x1,
    y1 + (h * (7 / 8))
  );

  //vertex(x1, y1 + (h * (7 / 8)));

  bezierVertex(
    x1,
    y1 + (h * (29 / 32)),
    x1 + (w * (1 / 2)),
    y1 + (h * (29 / 32)),
    x1 + (w * (1 / 2)),
    y1 + (h * (29 / 32))

  );

  bezierVertex(
    x2,
    y1 + (h * (29 / 32)),
    x2,
    y2,
    x2,
    y2
  );

  //vertex(x2, y2);

  endShape();

}

function saveFileName() {
  let fileName = `${saveId}_${saveCount}.png`;
  saveCount++;
  return fileName;
}

function keyPressed() {
  if (key === "Enter") {
    redraw();
  }

  if (key === "s") {
    save(saveFileName());
  }

  if (key === "g") {
    // generate stack of images
    for (var i = 0; i < 25; i++) {
      redraw();
      save(saveFileName());
    }

    return false;
  }
}
