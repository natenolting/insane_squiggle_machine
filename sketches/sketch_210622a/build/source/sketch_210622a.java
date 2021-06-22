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

public class sketch_210622a extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 30;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

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
  // // https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  // color c1 = color(73, 38, 93, 100);
  // color c2 = color(92, 39, 89, 100);
  // color c3 = color(110, 35, 85, 100);
  // color c4 = color(141, 41, 78, 100);
  // color c5 = color(163, 55, 71, 100);
  // color c6 = color(182, 68, 64, 100);
  // color c7 = color(194, 87, 68, 100);
  // color c8 = color(199, 84, 62, 100);
  // color c9 = color(206, 79, 57, 100);
  // color c10 = color(206, 80, 47, 100);
  // colors[0] = c1;
  // colors[1] = c2;
  // colors[2] = c3;
  // colors[3] = c4;
  // colors[4] = c5;
  // colors[5] = c6;
  // colors[6] = c7;
  // colors[7] = c8;
  // colors[8] = c9;
  // colors[9] = c10;
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


public void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(color(0,0,100, 100));


  ArrayList<Coordinate> coordinates = new ArrayList();
  int coordStart = 0;
  for(int r = 0; r < rows + 1; r++) {
    for(int c = 0; c < cols + 1; c++) {
      coordinates.add(new Coordinate(c, r, c*gW, r*gH));
    }
  }

  int start = PApplet.parseInt(random(coordinates.size()));
  float startX = coordinates.get(start).x;
  float startY = coordinates.get(start).y;
  float lastX = coordinates.get(start).x;
  float lastY = coordinates.get(start).y;
  // print(" ");
  // print(startX);
  // print(" ");
  // print(startY);
  // print(" ");

    for(int l=0; l < 10000; l++) {
      ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
      for(int ci = 0; ci < colors.length; ci++)
      {
        colorNumbers.add(ci);
      }
      Collections.shuffle(colorNumbers);

      stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), PApplet.parseInt(random(10))*10);
      noFill();
      strokeWeight(random(gW));
      beginShape();
      vertex(lastX, lastY);
      for(int i=0; i < 25; i++) {

        int direction = PApplet.parseInt(random(1,9));
        if (direction == 1) {
          lastY = lastY+gH*-1;
        }
        if (direction == 2) {
          lastX = lastX+gW;
          lastY = lastY+gH*-1;
        }
        if (direction == 3) {
          lastX = lastX+gW;
        }
        if (direction == 4) {
          lastX = lastX+gW;
          lastY = lastY+gH;
        }
        if (direction == 5) {
          lastY = lastY+gH;
        }
        if (direction == 6) {
          lastX = lastX+gW*-1;
          lastY = lastY+gH;
        }
        if (direction == 7) {
          lastX = lastX+gW*-1;
        }
        if (direction == 8) {
          lastX = lastX+gW*-1;
          lastY = lastY+gH*-1;
        }

        if(lastX > width) {
          lastX = width;
        }

        if(lastX < 0) {
          lastX = 0;
        }

        if(lastY > height) {
          lastY = height;
        }

        if(lastY < 0) {
          lastY = 0;
        }

        vertex(lastX, lastY);

    }
    endShape();

    // crop
    smooth();
    stroke(color(0,0,100,100));
    strokeWeight(gW*10);
    ellipse(width/2, height/2, width+gW*10, height+gH*10);


  }

  // beginShape(POINTS);
  // for(int r = 0; r < rows + 1; r++) {
  //   for(int c = 0; c < cols + 1; c++) {
  //     ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  //     for(int ci = 0; ci < colors.length; ci++)
  //     {
  //       colorNumbers.add(ci);
  //     }
  //     Collections.shuffle(colorNumbers);
  //
  //     stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), 25);
  //     strokeWeight(5);
  //     vertex(float(c)*gW, float(r)*gH);
  //   }
  // }
  // endShape();

}




public void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-h-"+nf(height)+"-w-"+nf(width)+"-s-"+nf(scale)+"-r-"+nf(rows)+"-c-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
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
    String[] appletArgs = new String[] { "sketch_210622a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
