import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.UUID; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210609b extends PApplet {



int cols = 3;
int rows = 3;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
// https://colorpalettes.net/color-palette-4269/
int c1 = 0xff99998f;
int c2 = 0xffcbb796;
int c3 = 0xfff8a73f;
int c4 = 0xffdb5c01;
int c5 = 0xff1b1612;
int[] colors  = {c1, c2, c3, c4, c5};
int gH, gW;

public void setup() {
  
  gH = height/rows;
  gW = width/cols;
}

// function to find if given point
// lies inside a given rectangle or not.
public static boolean FindPointInRectangle(int x1, int y1, int x2, int y2, int x, int y, boolean includeEdge) {

  if(includeEdge && x >= x1 && x <= x2 && y >= y1 && y <= y2) {
    return true;
  }

  if (x > x1 && x < x2 && y > y1 && y < y2) {
    return true;
  }

  return false;
}

public void texturizeCell(int w, int h, int x1, int y1, int x2, int y2, int c) {


  fill(red(c), green(c), blue(c), 75);

  for (int x=x1; x < x1+w; x++) {
    for (int y=y1; y < y1+h; y++) {
      if(FindPointInRectangle(x1, y1, x2, y2, x, y, true)) {
          float s = random(2);
          //print(" ");
          //print("Size" + s);
          if (PApplet.parseInt(random(colors.length)) == PApplet.parseInt(colors.length/2)) {
            if ((x==x1 || y==y2) && s >= 1) {
                circle(x, y, 1);
                //print(" ");
                //print("caught on left");
            } else if ((x>=w-1 || y>=h-1) && s >= 1) {
                circle(x, y, 1);
                //print(" ");
                //print("caught on right ");
            } else {
                circle(x, y, s);
            }
        }
      }
    }
  }
}

public void cell(int r, int c, int bgC, int shapeC) {

  int topLeftX = gW*r;
  int topLeftY = gH*c;

  int topRightX = gW*(r+1);
  int topRightY = gH*c;

  int bottomRightX = gW*(r+1);
  int bottomRightY = gH*(c+1);

  int bottomLeftX = gW*r;
  int bottomLeftY = gH*(c+1);

  noStroke();
  fill(bgC);
  // create background
  beginShape();
  // top left
  vertex(topLeftX,topLeftY);
  //top right
  vertex(topRightX,topRightY);
  // bottom right
  vertex(bottomRightX ,bottomRightY);
  // bottom left
  vertex(bottomLeftX,bottomLeftY);
  endShape();
  // create overlay shape
  fill(shapeC);

  int doTexture = PApplet.parseInt(random(2));
  if (doTexture == 1) {
  // texturize background
    texturizeCell(gW, gH, topLeftX, topLeftY, bottomRightX, bottomRightY, shapeC);
  }

  fill(shapeC);
  noStroke();
  // which overlay to use
  int sT = PApplet.parseInt(random(3));

  // half circle
  if (sT == 0) {
      int a = PApplet.parseInt(random(2));
      if(a == 1) {
        //print("LEFT!");
        // left
        arc(gW*r-1, gH*c+gH/2, gW, gH, radians(-90), radians(90));
      } else {
        //print("RIGHT!");
        // right
        arc(gW*r+gW+1, gH*c+gH/2, gW, gH, radians(90), radians(270));
      }
  }

  // full circle
  if (sT == 1) {
    ellipse(gW*r+gW/2, gH*c+gH/2, gW, gH);
  }
  // triangle
  if (sT == 2) {
      int t = PApplet.parseInt(random(2));
      beginShape();
      if(t == 1) {

        //right
        vertex(topLeftX,topLeftY);
        vertex(topRightX,topRightY);
        vertex(bottomLeftX,bottomLeftY);
      } else {

        // left
        vertex(topLeftX,topLeftY);
        vertex(bottomRightX,bottomRightY);
        vertex(bottomLeftX,bottomLeftY);
      }
      endShape();
  }

}

public void draw() {
  background(0);
  noLoop();
  noStroke();
  for(int c=0; c < cols; c++) {
    for(int r=0; r < rows; r++) {
        // bg color
        int cI = PApplet.parseInt(random(colors.length));
        // shape color
        int scI = PApplet.parseInt(random(colors.length));
        // make sure the shape and the background color don't match
        while(scI == cI) {
          scI = PApplet.parseInt(random(colors.length));
        }
        cell(r, c, colors[cI], colors[scI]);
    }
  }
  save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

public void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
  public void settings() {  size(1080,1080); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210609b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
