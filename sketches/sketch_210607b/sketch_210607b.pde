int cols, rows;
int scl = 20;

void setup() {
  size(800, 800, P3D);

  int w = 800;
  int h = 800;
  cols = w / scl;
  rows = h / scl;
  noLoop();

}

void draw() {
  background(0);
  stroke(255);
  noFill();
  rotateX(PI/3);
  for (int y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (int x = 0; x < cols; x++) {
      vertex(x*scl,y*scl);
      vertex(x*scl,(y+1)*scl);
    }
    endShape();
  }

}
