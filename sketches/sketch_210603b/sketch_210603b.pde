int width = 800;
int height = 600;
void setup() {
  size(800, 600);
  noLoop();

}

void draw() {

  for (int w = 0; w < width; w += 20) {
      for (int h = 0; h < height; h += 20) {
        pushMatrix();
        translate(w,h);
        rotate(w/PI);
        float size = random(2,12);
        noStroke();
        fill(round(255/size));
        ellipse(0,0,size*PI,size*PI);
        popMatrix();
    }
  }
}
