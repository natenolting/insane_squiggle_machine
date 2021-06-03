int height = 500;
int width = 500;

void setup() {
  size(500, 500);
  noLoop();

}

void draw() {
  for (int w = 0; w < width; w += 10) {
    for (int h = 0; h < height; h += 10) {
      float size = random(2,12);
      noStroke();
      fill(0);
      rect(w,h,size,size);
    }
  }
}
