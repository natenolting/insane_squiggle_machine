int height = 1080;
int width = 1920;

void setup() {
  size(1920, 1080);
  noLoop();
  background(0);
}

void draw() {
  spiral(width/2, height/2, 1.125, 1.125);
}

void spiral(float transX, float transY, float multiplyX, float multiplyY) {
  translate(transX,transY);
  int max = 255;
  for(float i = 0; i < max * 2; i++) {
    rotate(0.1);
    noStroke();
    float fillColor = i;
    if (i > 255.0) {
      fillColor = 255.0 + (255.0 -  i);
    }
    fill(fillColor);

    ellipse(i, 0, round(i * multiplyX),round(i * multiplyY));
  }
}
