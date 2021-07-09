

import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 45;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

// How many colors will we use
color[] colors  = new int[9];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = width/cols;
  gW = height/rows;

  if ((width % (float(cols) * gW)) > 0.0) {
      float gWOffset = width % (float(cols) * gW);
      gW = gW + gWOffset/float(cols);
  }

  if ((width % (float(rows) * gH)) > 0.0) {
      float gHOffset = width % (float(rows) * gH);
      gH = gH + gHOffset/float(rows);
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

// Draw a random color from the colors list
color randomColor() {
  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  return colors[colorNumbers.get(0)];
}

boolean coinFlip()
{
  return boolean(round(random(1)));
}


void draw() {
    noLoop();
    ArrayList<Coordinate> coordinates = new ArrayList();
    color c1 = randomColor();
    color c2 = randomColor();
    //background(color(0,0,100,100));
    background(color(hue(c2),saturation(c2), brightness(c2),100));
    noFill();
    float offset = 3;
    float diviationFC = 250.0;
    strokeWeight(2);
    for(float l=0.0; l < diviationFC; l+=1.0) {
      pushMatrix();
      //translate(width + gH - l, 0 + l);
      //translate(width/2,height/2);
      translate(width/2 - diviationFC + l,height/2 - diviationFC + l);
        //scale(0.0875 * l);
        stroke(color(hue(c1),saturation(c1), brightness(c1),l/8));
        beginShape();
        float lastX = 0;
        float lastY = -gH/2;
        for(float i=1.0; i < 100.0; i+=1.0) {
          float x1, y1, x2, y2, x3, y3, x4, y4;
          x1 = lastX;
          y1 = lastY;

          x2 = gW*(offset * i);
          y2 = 0;

          x3 = i - (i/offset);
          y3 = gH*(offset * i);

          x4 = -gW*(offset * i);
          y4 = -gH*(offset * i) + (i/offset);

          lastX = 0;
          lastY = y4;
            // circle(x2, y2, 5);
            // circle(x4, y4, 5);
            // vertex(x1,y1);
            // vertex(x2,y2);
            // vertex(x3,y3);
            // vertex(x4,y4);
            curveVertex(x1,y1);
            curveVertex(x2,y2);
            curveVertex(x3,y3);
            curveVertex(x4,y4);

        }
        endShape();
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
    redraw();
  }
}
