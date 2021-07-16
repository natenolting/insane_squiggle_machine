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

public class sketch_210714a extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
int[] colors  = new int[5];

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

  colorMode(HSB, 359, 100, 100, 100);
  int c1 = color(60,8.53f,100);
  int c2 = color(38,31,75,100);
  int c3 = color(32,80,90,100);
  int c4 = color(19, 96, 82, 100);
  int c5 = color(30, 29, 8, 100);

  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[4] = c5;

}

public boolean PointInRect(float left, float top, float right, float bottom, float x, float y)
{
    if (x < left || x > right || y < top || y > bottom)
        return false;
    else
        return true;
}

public boolean coinFlip()
{
  return PApplet.parseBoolean(round(random(1)));
}

public void bands(float w, float h, float l, float d, int c) {

  float x1 = -w/2;
  float y1 = 0;
  float radius = w > h ? w : h;


    for(float r=QUARTER_PI/l; r <= TWO_PI + QUARTER_PI/l; r+=QUARTER_PI/l) {
    pushMatrix();


    //ellipse(0,0,radius,radius);
    float tS = 2.5f;
    rotate(r);
    for (int i=0; i < (w*h)*d; i++) {
        float x2 = random(x1, x1+radius);
        float y2 = random(y1, y1+radius);
        float tX1 = x2+tS;
        float tY1 = y2;
        float tX2 = x2+(tS * 2.0f);
        float tY2 = y2+tS;
        float tX3 = x2;
        float tY3 = y2+tS;

        if (PointInRect(x1, y1, x1+w, y1+h, tX1, tY1) && PointInRect(x1, y1, x1+w, y1+h, tX2, tY2) && PointInRect(x1, y1, x1+w, y1+h, tX3, tY3)) {
          noStroke();
          fill(c);
          if (coinFlip()) {
            triangle(tX1, tY1, tX2, tY2, tX3, tY3);
          } else {
            triangle(tX3, tY1, tX2, tY1, tX1, tY2);
          }
        }
      }
      popMatrix();
  }

}

public void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(colors[0]);

    pushMatrix();
    translate(width/2,height/2);
    int cI = PApplet.parseInt(random(colors.length));
    bands(200.0f, 300.0f, 6.0f, 0.001f, colors[cI]);
    popMatrix();



}

public void keyPressed() {
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
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210714a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
