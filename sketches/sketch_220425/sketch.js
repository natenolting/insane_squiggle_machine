const canvasWidth = 750;
const canvasHeight = 750;

function setup() {
  colorMode(HSL, 359, 100, 100, 100);
  createCanvas(canvasWidth, canvasWidth);

}

function draw() {
  noLoop();
  fill(0,0,100,100);
  noStroke();
  rect(0,0,canvasWidth, canvasHeight);
  let iso = new Isometric(canvasWidth * .5, canvasHeight * .75, 12, 12 * (new Isometric()).heightMultiple, 3);
  console.log(iso);
  stroke(0,0,0,100);
  //iso.pickDirection(7, 5);
  //iso.build(0,0,100);
  noFill();

  beginShape();
  vertex(iso.a.x,iso.a.y);
  vertex(iso.b.x,iso.b.y);
  quadraticVertex(iso.c.x + (iso.g.x - iso.c.x)/4, lerp(iso.c.y, iso.b.y, .5), iso.c.x,iso.c.y);
  vertex(iso.c.x,iso.c.y);
  vertex(iso.g.x,iso.g.y);
  quadraticVertex(iso.g.x + (iso.g.x - iso.c.x)/4, lerp(iso.g.y, iso.a.y, .5), iso.a.x,iso.a.y);
  endShape(CLOSE);

  beginShape();
  vertex(iso.a.x,iso.a.y);
  quadraticVertex(iso.g.x + (iso.g.x - iso.c.x)/4, lerp(iso.g.y, iso.a.y, .5), iso.g.x ,iso.g.y);
  vertex(iso.e.x,iso.e.y);
  quadraticVertex(iso.e.x + (iso.g.x - iso.c.x)/4, lerp(iso.f.y, iso.e.y, .5), iso.f.x ,iso.f.y);
  endShape(CLOSE);
  iso.buildTopFace();




}
