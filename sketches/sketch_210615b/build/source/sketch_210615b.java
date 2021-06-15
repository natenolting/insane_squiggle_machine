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

public class sketch_210615b extends PApplet {

int[] colors  = new int[2];

public void setup() {
  
  colorMode(HSB, 359, 99, 99, 255);
  colors[0] = color(60, 7, 60, 255);
  colors[1] = color(25, 100, 86, 255);
}

public void draw() {
  background(color(0,0,100, 255));
  noStroke();
  noLoop();
  float variance = 0.001f;
  int stepHeight = 1;

  float centerX = width/2;
  float centerY = height/2;
  float containerW = width/2;
  float containerH = height/2;
  float lPerc = 0.0f;
  int offset = 0;
  int topCount = 0;
  int bottomCount = 0;

  int topToMddleC =  lerpColor(colors[0], colors[1], .5f);
  int middleToBottomC =  lerpColor(colors[0], colors[1], 1);
  float nextX, nextY;

  float[][] topLeft = new float[PApplet.parseInt(90/variance)][];
  float[][] topRight = new float[PApplet.parseInt(90/variance)][];
  float[][] bottomLeft = new float[PApplet.parseInt(90/variance)][];
  float[][] bottomRight = new float[PApplet.parseInt(90/variance)][];

  // Top Left Arc
  offset = 0;
  for(float a=PI+HALF_PI; a >= PI; a+=-variance) {
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    topLeft[offset] = new float[] {nextX, nextY};
    offset++;
  }

  // Top Right Arc
  offset = 0;
  for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=variance) {
    nextX = centerX + (containerW/2) * cos(a);
    nextY = centerY + (containerH/2) * sin(a);
    topRight[offset] = new float[] {nextX, nextY};
    offset++;
  }

  // Bottom Left Arc
  offset = 0;
  for(float a=PI; a >= HALF_PI - variance; a+=-variance) {
    nextX = centerX + (containerW/2) * cos(a);
    nextY = centerY + (containerH/2) * sin(a);
    bottomLeft[offset] = new float[] {nextX, nextY};
    offset++;
  }

  // Bottom Right Arc
  offset = 0;
  for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + variance; a+=variance) {
    nextX = centerX + (containerW/2) * cos(a);
    nextY = centerY + (containerH/2) * sin(a);
    bottomRight[offset] = new float[] {nextX, nextY};
    offset++;
  }

  // find the actual number of point from top to middle
  for(int i=0; i < topLeft.length; i++ ) {
    if (topLeft[i] != null && topRight[i] != null) {
    topCount++;
    }
  }

  // find the actual number of point from middle to bottom
  for(int i=0; i < bottomLeft.length; i++ ) {
    if (bottomLeft[i] != null && bottomRight[i] != null) {
    bottomCount++;
    }
  }

  // From the top to the middle draw rectangles with color transition
  for(int i=0; i < topCount; i++ ) {
    lPerc = 0.5f * (((float)i/(float)topCount));
    topToMddleC = lerpColor(colors[0], colors[1], lPerc);
    fill(topToMddleC);
    if (topLeft[i] != null && topRight[i] != null) {
      beginShape();
      vertex(topLeft[i][0], topLeft[i][1]);
      vertex(topRight[i][0], topRight[i][1]);
      vertex(topRight[i][0]+stepHeight, topRight[i][1]+stepHeight);
      vertex(topLeft[i][0]+stepHeight, topLeft[i][1]+stepHeight);
      endShape();
    }
  }

  // From the top to the middle draw rectangles with color transition
  for(int i=0; i < bottomCount; i++) {
    lPerc = (1 * (((float)i/(float)bottomCount)));
    middleToBottomC = lerpColor(topToMddleC, colors[1], lPerc);
    fill(middleToBottomC);
    if (bottomLeft[i] != null && bottomRight[i] != null) {
      beginShape();
      vertex(bottomLeft[i][0], bottomLeft[i][1]);
      vertex(bottomRight[i][0], bottomRight[i][1]);
      vertex(bottomRight[i][0]+stepHeight, bottomRight[i][1]+stepHeight);
      vertex(bottomLeft[i][0]+stepHeight, bottomLeft[i][1]+stepHeight);
      endShape();
    }
  }
}
  public void settings() {  size(1000,1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210615b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
