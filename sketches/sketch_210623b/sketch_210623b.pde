import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
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

  colorMode(HSB, 359, 100, 100, 100);
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


void draw() {
  noLoop();
  noFill();

  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  background(colors[colorNumbers.get(1)]);


  noStroke();
  fill(colors[colorNumbers.get(2)]);
  // center
  pushMatrix();
  translate(width/2, height/2);
  ellipse(0,0,width/3, height/3);
  popMatrix();




  fill(colors[colorNumbers.get(2)]);
  noStroke();
  // top left
  pushMatrix();
  translate(width/4, height/4);
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // top right
  pushMatrix();
  translate(width/2+(width/4), height/4);
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // bottom left
  pushMatrix();
  translate(width/4, height/2+(height/4));
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // bottom right
  pushMatrix();
  translate(width/2+(width/4), height/2+(height/4));
  ellipse(0,0,width/3, height/3);
  popMatrix();

  noFill();
  stroke(colors[colorNumbers.get(0)]);
  for(float rotation = 0.0; rotation <= TWO_PI; rotation+=0.01) {
    pushMatrix();
    translate(width/2, height/2);
    //scale(rotation/1.5);
    rotate(rotation*PI);
    ellipse(0,0,width/1.125-20, height/5-20);
    popMatrix();
  }


  // stroke(colors[colorNumbers.get(3)]);
  // for(float rotation = 0.0; rotation <= HALF_PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3+rotation, height/4+rotation);
  //   rotate(-rotation*PI);
  //   ellipse(0,0,width/4-20, height/1-20);
  //   popMatrix();
  // }
  // stroke(colors[colorNumbers.get(2)]);
  // for(float rotation = 0.0; rotation <= PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3, height/3);
  //   rotate(rotation*PI);
  //   rect(0,0,width/4-20, height/7-20);
  //   popMatrix();
  // }
  //
  // stroke(colors[colorNumbers.get(2)]);
  // for(float rotation = 0.0; rotation <= PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3, height/3);
  //   rotate(rotation*PI);
  //   rect(0,0,width/4-20, height/7-20);
  //   popMatrix();
  // }



}

void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
  if(keyCode == 10) {
    redraw();
  }
}
