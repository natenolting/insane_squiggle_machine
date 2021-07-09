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

public class sketch_210706a extends PApplet {






int screenshotCount=1;
// control the size of the grid
int scale = 45;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

// How many colors will we use
int[] colors  = new int[9];

public void setup()
{
  

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = width/cols;
  gW = height/rows;

  if ((width % (PApplet.parseFloat(cols) * gW)) > 0.0f) {
      float gWOffset = width % (PApplet.parseFloat(cols) * gW);
      gW = gW + gWOffset/PApplet.parseFloat(cols);
  }

  if ((width % (PApplet.parseFloat(rows) * gH)) > 0.0f) {
      float gHOffset = width % (PApplet.parseFloat(rows) * gH);
      gH = gH + gHOffset/PApplet.parseFloat(rows);
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

// Draw a random color from the colors list
public int randomColor() {
  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  return colors[colorNumbers.get(0)];
}

public boolean coinFlip()
{
  return PApplet.parseBoolean(round(random(1)));
}


public void draw() {
    noLoop();
    ArrayList<Coordinate> coordinates = new ArrayList();
    int c1 = randomColor();
    int c2 = randomColor();
    //background(color(0,0,100,100));
    background(color(hue(c2),saturation(c2), brightness(c2),100));
    noFill();
    float offset = 3;
    float diviationFC = 250.0f;
    strokeWeight(2);
    for(float l=0.0f; l < diviationFC; l+=1.0f) {
      pushMatrix();
      //translate(width + gH - l, 0 + l);
      //translate(width/2,height/2);
      translate(width/2 - diviationFC + l,height/2 - diviationFC + l);
        //scale(0.0875 * l);
        stroke(color(hue(c1),saturation(c1), brightness(c1),l/8));
        beginShape();
        float lastX = 0;
        float lastY = -gH/2;
        for(float i=1.0f; i < 100.0f; i+=1.0f) {
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
    String[] appletArgs = new String[] { "sketch_210706a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
