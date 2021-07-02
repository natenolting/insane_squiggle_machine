import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 
import java.util.UUID; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210701a extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

int[] colors  = new int[9];

public void setup()
{
  

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  if ((width % (PApplet.parseFloat(cols) * gW)) > 0.0f) {
      float gWOffset = width % (PApplet.parseFloat(cols) * gW);
      gW += gWOffset/PApplet.parseFloat(rows);
  }

  if ((width % (PApplet.parseFloat(rows) * gH)) > 0.0f) {
      float gHOffset = width % (PApplet.parseFloat(rows) * gH);
      gH += gHOffset/PApplet.parseFloat(rows);
  }

  colorMode(HSB, 359, 99, 99, 100);
  int c1 = color(331, 100, 93, 100);
  int c2 = color(308, 100, 64, 100);
  int c3 = color(266, 100, 61, 100);
  int c4 = color(262, 100, 59, 100);
  int c5 = color(258, 100, 57, 100);
  int c6 = color(247, 85, 74, 100);
  int c7 = color(234, 78, 91, 100);
  int c8 = color(216, 75, 92, 100);
  int c9 = color(196, 72, 93, 100);
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

public void cube(float bX, float bY, float bH, float bW, float fX, float fY, float fH, float fW, int c1, int c2) {
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

public int randomColor() {
  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  return colors[colorNumbers.get(0)];
}


public void draw() {
  background(color(0,0,100, 100));
  noLoop();

  for(int i=100; i > 1; i--) {
    pushMatrix();
    strokeWeight(i);
      cube(
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        PApplet.parseFloat(i)+PApplet.parseFloat(i)*noise(i),
        randomColor(),
        randomColor()
      );
      popMatrix();
  }

}

public void keyPressed() {
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

public class Coordinate {
    public boolean isroot = false;
    public int col;
    public int row;
    public float x;
    public float y;
    public float w;
    public float h;
    public boolean used = false;


    public Coordinate(int col, int row, float x, float y) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
    }

}
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210701a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
