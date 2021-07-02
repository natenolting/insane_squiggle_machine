import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

color[] colors  = new int[9];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  if ((width % (float(cols) * gW)) > 0.0) {
      float gWOffset = width % (float(cols) * gW);
      gW += gWOffset/float(rows);
  }

  if ((width % (float(rows) * gH)) > 0.0) {
      float gHOffset = width % (float(rows) * gH);
      gH += gHOffset/float(rows);
  }

  colorMode(HSB, 359, 99, 99, 100);
  color c1 = color(331, 100, 93, 100);
  color c2 = color(308, 100, 64, 100);
  color c3 = color(266, 100, 61, 100);
  color c4 = color(262, 100, 59, 100);
  color c5 = color(258, 100, 57, 100);
  color c6 = color(247, 85, 74, 100);
  color c7 = color(234, 78, 91, 100);
  color c8 = color(216, 75, 92, 100);
  color c9 = color(196, 72, 93, 100);
  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[4] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;


}

void cube(float bX, float bY, float bH, float bW, float fX, float fY, float fH, float fW, color c1, color c2) {
  float b1X = bX;
  float b1Y = bY;
  float b2X = bX + bW;
  float b2Y = bY;
  float b3X = bX + bW;
  float b3Y = bY + bH;
  float b4X = bX;
  float b4Y = bY + bH;

  float f1X = fX;
  float f1Y = fY;
  float f2X = fX + fW;
  float f2Y = fY;
  float f3X = fX + fW;
  float f3Y = fY + fH;
  float f4X = fX;
  float f4Y = fY + fH;

  // back of cube
  fill(c1);
  stroke(c2);
  noStroke();
  beginShape();
  vertex(b1X,b1Y);
  vertex(b2X,b2Y);
  vertex(b3X,b3Y);
  vertex(b4X,b4Y);
  endShape(CLOSE);

  // front of cube
  fill(c1);
  stroke(c2);
  noStroke();
  beginShape();
  vertex(f1X,f1Y);
  vertex(f2X,f2Y);
  vertex(f3X,f3Y);
  vertex(f4X,f4Y);
  endShape(CLOSE);

  // right
  fill(c1);
  stroke(c2);
  strokeJoin(ROUND);
  beginShape();
  vertex(b2X,b2Y);
  vertex(f2X,f2Y);
  vertex(f3X,f3Y);
  vertex(b3X,b3Y);
  endShape(CLOSE);

  // bottom
  fill(c1);
  stroke(c2);
  strokeJoin(ROUND);
  beginShape();
  vertex(b3X,b3Y);
  vertex(f3X,f3Y);
  vertex(f4X,f4Y);
  vertex(b4X,b4Y);
  endShape(CLOSE);

  // top
  fill(c1);
  stroke(c2);
  strokeJoin(ROUND);
  beginShape();
  vertex(b2X,b2Y);
  vertex(f2X,f2Y);
  vertex(f1X,f1Y);
  vertex(b1X,b1Y);
  endShape(CLOSE);

  // left
  fill(c1);
  stroke(c2);
  strokeJoin(ROUND);
  beginShape();
  vertex(b1X,b1Y);
  vertex(f1X,f1Y);
  vertex(f4X,f4Y);
  vertex(b4X,b4Y);
  endShape(CLOSE);


  stroke(c2);
  // line(b1X,b1Y,f1X,f1Y);
  // line(b2X,b2Y,f2X,f2Y);
  // line(b3X,b3Y,f3X,f3Y);
  // line(b4X,b4Y,f4X,f4Y);


}

color randomColor() {
  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  return colors[colorNumbers.get(0)];
}


void draw() {
  background(color(0,0,100, 100));
  noLoop();

  for(int i=100; i > 1; i--) {
    pushMatrix();
    strokeWeight(i);
      cube(
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        float(i)+float(i)*noise(i),
        randomColor(),
        randomColor()
      );
      popMatrix();
  }

}

void keyPressed() {
  // save a screenshot if 's' is pressed
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is pressed
  if(keyCode == 10) {
    background(color(0,0,100, 100));
    redraw();
  }
}
