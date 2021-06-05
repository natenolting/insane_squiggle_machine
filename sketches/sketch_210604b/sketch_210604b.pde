int height = 1080;
int width = 1920;

void setup() {
  size(1920, 1080);
  noLoop();
  background(0);
  colorMode(HSB, 360, 100, 100, 100);
}

void draw() {

  float thisColor = random(1,100);

  for(int i=30; i >= 1; i--) {
      spiral(width/2-i, height/2-i, i, i, random(i, 150), thisColor+(i*10));
  }

  // spiral(width/2, height/2, 4, 4, 100, thisColor+30);
  // spiral(width/2, height/2, 3, 3, 100, thisColor+20);
  // spiral(width/2, height/2, 2, 2, 100, thisColor+10);


  //spiral(width/4, width/4, 1, 1, 250, thisColor);
  //spiral(width-(width/4), height/4, 1, 1, 250, thisColor);
  //spiral(width/4, height-(height/4), 1, 1, 250, thisColor);
  //spiral(width-(width/4), height-(height/4), 1, 1, 250, thisColor);

}

void spiral(float transX, float transY, float multiplyX, float multiplyY, float times, float hueColor) {
  pushMatrix();
  translate(transX,transY);
  for(float i = 0; i < times; i++) {
    rotate(0.1);
    noStroke();

    float saturationColor = round((i/times)*100);
    float balanceColor = round((i/times)*100);
    float alphaColor = round((i/times)*100);


    fill(hueColor, saturationColor, balanceColor, alphaColor);

    ellipse(i, 0, i * multiplyX, i * multiplyY);
  }
  popMatrix();
}
