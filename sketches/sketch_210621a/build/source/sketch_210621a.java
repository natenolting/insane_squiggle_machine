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

public class sketch_210621a extends PApplet {





int screenshotCount=1;
// control the size of the grid
int scale = 100;
String screenshotSet = UUID.randomUUID().toString();
int cols = 0;
int rows = 0;
float gH = 0.0f;
float gW = 0.0f;

// How many colors will we use
int[] colors  = new int[10];

public void setup()
{
  

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = width/cols;
  gW = height/rows;

  if ((width % (PApplet.parseFloat(cols) * gW)) > 0.0f) {
      float gWOffset = width % (PApplet.parseFloat(cols) * gW);
      gW += gWOffset/PApplet.parseFloat(rows);
  }

  if ((width % (PApplet.parseFloat(rows) * gH)) > 0.0f) {
      float gHOffset = width % (PApplet.parseFloat(rows) * gH);
      gH += gHOffset/PApplet.parseFloat(rows);
  }


  colorMode(HSB, 359, 100, 100, 100);
  // https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  int c1 = color(73, 38, 93, 100);
  int c2 = color(92, 39, 89, 100);
  int c3 = color(110, 35, 85, 100);
  int c4 = color(141, 41, 78, 100);
  int c5 = color(163, 55, 71, 100);
  int c6 = color(182, 68, 64, 100);
  int c7 = color(194, 87, 68, 100);
  int c8 = color(199, 84, 62, 100);
  int c9 = color(206, 79, 57, 100);
  int c10 = color(206, 80, 47, 100);
  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[3] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;
  colors[9] = c10;

}

public void findSpace(int[][] coord) {
  int start = 0;
  // find the first availible starting point
  for(int i=0; i < 1000; i++) {
      int id = floor(random(coord.length));
      if (coord[id] != null && coord[id][2] != 1) {
        start = id;
        break;
      }
  }
  if (coord[start][2] != 1) {
    float startX = PApplet.parseFloat(coord[start][0])*gW;
    float startY = PApplet.parseFloat(coord[start][1])*gH;
    float endX = 0;
    float endY = 0;
    coord[start][2] = 1;
    strokeWeight(20);
    stroke(colors[1]);
    // first get the furthest we can go in the x direction
    for(int i = start + 1; i < coord.length; i++) {
      if (coord[i] == null) {
        break;
      }

      if(coord[i][2] == 1) {
        break;
      }

      if (PApplet.parseFloat(coord[i][0])*gW <= PApplet.parseFloat(cols)*gW) {
        endX = PApplet.parseFloat(coord[i][0])*gW;
        if(ceil(endX) >= ceil(PApplet.parseFloat(cols)*gW)) {
          break;
        }
      }

      try {
        if (coord[i+1][0] == 0 || coord[i+1][2] == 1) {
            break;
        }
      }
      catch(ArrayIndexOutOfBoundsException exception) {
          // carry on
      }
    }

    // next get the furthest we can go in the y direction
    for(int i=start + cols; i < coord.length; i++) {
      if (coord[i] == null || coord[i][2] == 1) {
        break;
      }

      if(coord[i][1] == rows || ceil(PApplet.parseFloat(coord[i][1])*gH) >= ceil(PApplet.parseFloat(rows)*gH)) {
        break;
      }

      if (PApplet.parseFloat(coord[i][1])*gH <= PApplet.parseFloat(rows)*gH) {
        endY = PApplet.parseFloat(coord[i][1])*gH;
        if(ceil(endY) >= ceil(PApplet.parseFloat(rows)*gH)) {
          break;
        }
      }
    }

    // now we have the rectangle x and y we can find the inside also

    noStroke();
    fill(colors[PApplet.parseInt(random(10))]);
    beginShape();
    for(int i = 0; i < coord.length; i++) {

        if(PApplet.parseFloat(coord[i][0])*gW >= startX
          && PApplet.parseFloat(coord[i][0])*gW+gW <= endX
          && PApplet.parseFloat(coord[i][1])*gH >= startY
          && PApplet.parseFloat(coord[i][1])*gH+gH <= endY
        ) {
        coord[i][2] = 1;

        vertex(PApplet.parseFloat(coord[i][0])*gW, PApplet.parseFloat(coord[i][1])*gH);
        vertex(PApplet.parseFloat(coord[i][0])*gW+gW, PApplet.parseFloat(coord[i][1])*gH);
        vertex(PApplet.parseFloat(coord[i][0])*gW+gW, PApplet.parseFloat(coord[i][1])*gH+gH);
        vertex(PApplet.parseFloat(coord[i][0])*gW, PApplet.parseFloat(coord[i][1])*gH+gH);
        endShape(CLOSE);
      }

    }

    stroke(colors[0]);
    strokeWeight(5);
    noFill();
    beginShape();
    vertex(startX, startY);
    vertex(endX, startY);
    vertex(endX, endY);
    vertex(startX, endY);
    endShape(CLOSE);
  }
}


public void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(color(0,0,100, 100));

  int[][] coordinates = new int[PApplet.parseInt(rows*cols)][];
  int coordStart = 0;
  for(int r = 0; r < rows; r++) {
    for(int c = 0; c < cols; c++) {
      coordinates[coordStart] = new int[] {c, r, 0};
      coordStart++;
      stroke(colors[5]);
      strokeWeight(5);
      point(PApplet.parseFloat(c)*gW, PApplet.parseFloat(r)*gH);
      if(c == cols - 1) {
        point(PApplet.parseFloat(c + 1)*gW, PApplet.parseFloat(r)*gH);
      }
      if(r == rows - 1) {
        point(PApplet.parseFloat(c)*gW, PApplet.parseFloat(r + 1)*gH);
      }

      if(r == rows - 1 && c == cols - 1) {
        point(PApplet.parseFloat(cols) * gW, PApplet.parseFloat(rows) * gH);
      }
    }
  }
  for(int i=0; i < 1000; i++) {
    findSpace(coordinates);
  }


  //print(" x1/x2/x3/x4 -  " + startX +'/'+ startY +'/'+endX +'/'+endY +'/');

}

public void keyPressed() {
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
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210621a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
