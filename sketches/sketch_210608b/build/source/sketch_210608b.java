import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210608b extends PApplet {

int cols = 5;
int rows = 5;
int screenshotCount=1;
// https://colorpalettes.net/color-palette-4288/
int c1 = 0xff252b31;
int c2 = 0xff5e6668;
int c3 = 0xffc1c8c7;
int c4 = 0xfff6fafb;
int c5 = 0xffd49c6b;
int[] colors  = {c1, c2, c3, c4, c5};
int gH, gW;
public void setup() {
  
  gH = height/rows;
  gW = width/cols;
}

public void cell(int r, int c, int bgC, int shapeC) {
  noStroke();
  fill(bgC);
  // create background
  beginShape();
  // top left
  vertex(gW*r,gH*c);
  //top right
  vertex(gW*(r+1),gH*c);
  // bottom right
  vertex(gW*(r+1),gH*(c+1));
  // bottom left
  vertex(gW*r,gH*(c+1));
  endShape();
  // create overlay shape
  fill(shapeC);

  // which overlay to use
  int sT = PApplet.parseInt(random(3));

  // half circle
  if (sT == 0) {
      int a = PApplet.parseInt(random(2));
      if(a == 1) {
        //print("LEFT!");
        // left
        arc(gW*r, gH*c+gH/2, gW, gH, radians(-90), radians(90));
      } else {
        //print("RIGHT!");
        // right
        arc(gW*r+gW, gH*c+gH/2, gW, gH, radians(90), radians(270));
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

        //top left
        vertex(gW*r,gH*c);
        vertex(gW*(r+1),gH*c);
        vertex(gW*r,gH*(c+1));
      } else {

        // bottom right
        vertex(gW*(r+1),gH*c);
        vertex(gW*(r+1),gH*(c+1));
        vertex(gW*r,gH*(c+1));
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
  save("result"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

public void keyPressed() {
  redraw();
}
  public void settings() {  size(1080,1080); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210608b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
