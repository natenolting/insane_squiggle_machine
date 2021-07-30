let cols = 0;
let rows = 0;
var cW = 45;
var cH = 55;
let wW = 1000;
let wH = 1000;
let saveCount = 0;
var gui;
function setup() {
  createCanvas(wW + 3000, wH + 3000);
  colorMode(HSB, 359, 100, 100, 100);
  cols = floor(wW / cW);
  rows = floor(wH / cH);
  noLoop();
}

function cubes()
{
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      push();
      //rotate((r + c) / 8);
      let distance = map(c, 0, (rows + cols) / 2, -.125, 1.5);
      let a = createVector(c * cW + distance * cW, r * cH + distance * cH);
      let b = createVector(c * cW + cW + distance * cW, r * cH + distance * cH);
      let c1 = createVector(c * cW + cW + distance * cW, r * cH + cH + distance * cH);
      let d = createVector(c * cW + distance * cW, r * cH + cH + distance * cH);
      let e = createVector(c * cW + cW / 2, r * cH - cH / 2);
      let f = createVector(c * cW - cW / 2, r * cH - cH / 2);
      let g = createVector(c * cW - cW / 2, r * cH + cH / 2);

      if (c % 2 && r % 2) {
        // square
        fill(0, 0, 100, 100);
        noStroke();
        beginShape();
        vertex(a.x, a.y);
        vertex(b.x, b.y);
        vertex(c1.x, c1.y);
        vertex(d.x, d.y);
        endShape();

        // top
        fill(0, 0, 50, 100);
        beginShape();
        vertex(a.x, a.y);
        vertex(b.x, b.y);
        vertex(e.x, e.y);
        vertex(f.x, f.y);
        endShape();

        // texture for the top
        for (let tm = 0; tm < 1; tm += .01) {
          let start = p5.Vector.lerp(a, f, tm);
          let end  = p5.Vector.lerp(b, e, tm);

          for (let td = start.x; td < end.x; td += 2) {
            stroke(0, 0, random(25, 75), 75);
            point(td, start.y);
          }
        }

        noStroke();

        //left
        fill(0, 0, 10, 100);
        beginShape();
        vertex(a.x, a.y);
        vertex(f.x, f.y);
        vertex(g.x, g.y);
        vertex(d.x, d.y);
        endShape();

        // texture for the left
        for (let lm = 0; lm < 1; lm += .01) {
          let start = p5.Vector.lerp(d, g, lm);
          let end  = p5.Vector.lerp(a, f, lm);
          for (let ld = start.y; ld > end.y; ld -= 2) {
            stroke(0, 0, random(10, 25), 75);
            point(start.x, ld);
          }
        }

        noStroke();

        // bottom border
        for (let bb = d.x; bb <= c1.x; bb++) {
          let col = map(bb, d.x, c1.x, 10, 100);
          fill(0, 0, col, 100);
          beginShape();
          vertex(bb, d.y - 1);
          vertex(bb + 1, d.y - 1);
          vertex(bb + 1, d.y);
          vertex(bb, d.y);
          endShape();
        }

        // left border
        for (let br = b.y; br <= c1.y; br++) {
          let col = map(br, b.y, c1.y, 50, 100);
          fill(0, 0, col, 100);
          beginShape();
          vertex(b.x - 1, br);
          vertex(b.x, br);
          vertex(b.x, br + 1);
          vertex(b.x - 1, br + 1);
          endShape();
        }
      }

      pop();
    }
  }
}

function draw() {
  background(0, 0, 100, 100);
  translate(wW + 500, wH + 500);
  for (var i = 0; i < (cols + rows) / 2 ; i++) {
    rotate(0.25);
    scale(1.0875);
    cubes();
  }

  save(saveFileName());

}

function saveFileName() {
  let fileName = `sketch_210721a_${saveCount}.jpg`;
  saveCount++;
  return fileName;
};

function windowResized() {
  wW = windowWidth + 100;
  wH = windowHeight + 100;
  resizeCanvas(wW, wH);
}

function keyPressed() {
  if (key === 'Enter') {
    redraw();
  }

  if (key === 's') {
    save(saveFileName());
  }
};
