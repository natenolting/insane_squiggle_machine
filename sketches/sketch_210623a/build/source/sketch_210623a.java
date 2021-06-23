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

public class sketch_210623a extends PApplet {





int screenshotCount=1;
// control the size of the grid
int scale = 10;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

// How many colors will we use
int[] colors  = new int[10];

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
  colors[4] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;
  colors[9] = c10;
  // color c1 = color(60,8.53,100);
  // color c2 = color(38,31,75,100);
  // color c3 = color(32,80,90,100);
  // color c4 = color(19, 96, 82, 100);
  // color c5 = color(30, 29, 8, 100);
  //
  // colors[0] = c1;
  // colors[1] = c2;
  // colors[2] = c3;
  // colors[3] = c4;
  // colors[4] = c5;
background(color(0,0,100, 100));

}


public void draw() {
  noLoop();
  strokeWeight(5);
  noFill();



  // ArrayList<Coordinate> coordinates = new ArrayList();
  // stroke(colors[9]);
  // strokeWeight(5);
  // beginShape(POINTS);
  // int coordStart = 0;
  // for(int r = 0; r < rows + 1; r++) {
  //   for(int c = 0; c < cols + 1; c++) {
  //     coordinates.add(new Coordinate(c, r, c*gW, r*gH));
  //     vertex(c*gW,r*gH);
  //   }
  // }
  // endShape();

  ArrayList<Coordinate> coordinates = new ArrayList();
  stroke(colors[9]);
  strokeWeight(5);
  //beginShape(POINTS);
  for(int r = 0; r <= rows; r++) {
    for(int c = 0; c <= cols; c++) {
      coordinates.add(new Coordinate(c, r, c*gW, r*gH));
      //vertex(c*gW,r*gH);
    }
  }
  //endShape();
  beginShape();
  for(int i=0; i < coordinates.size(); i++) {
      if (coordinates.get(i).col == 0) {
        endShape();
        beginShape();
      }

      float x, y;
      ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
      for(int ci = 0; ci < colors.length; ci++)
      {
        colorNumbers.add(ci);
      }
      Collections.shuffle(colorNumbers);
      stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), 100);
      y = coordinates.get(i).y+(gH*(noise(random(gH))+random(scale)));
      if (coordinates.get(i).col == 0 || coordinates.get(i).col == cols) {
        x = coordinates.get(i).x;
        vertex(x,y);
      } else {
        x = coordinates.get(i).x+(gW*(noise(random(gW))+random(scale)));
        curveVertex(x,y);
      }


  }
  endShape();


    // // crop
    // smooth();
    // stroke(color(0,0,100,100));
    // strokeWeight(gW*10);
    // ellipse(width/2, height/2, width+gW*10, height+gH*10);

}




public void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-h-"+nf(height)+"-w-"+nf(width)+"-s-"+nf(scale)+"-r-"+nf(rows)+"-c-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
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
    String[] appletArgs = new String[] { "sketch_210623a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
