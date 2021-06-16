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

public class sketch_210616a extends PApplet {




int screenshotCount=1;
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

  colorMode(HSB, 359, 99, 99, 255);
  int c1 = color(331, 100, 93, 255);
  int c2 = color(308, 100, 64, 255);
  int c3 = color(266, 100, 61, 255);
  int c4 = color(262, 100, 59, 255);
  int c5 = color(258, 100, 57, 255);
  int c6 = color(247, 85, 74, 255);
  int c7 = color(234, 78, 91, 255);
  int c8 = color(216, 75, 92, 255);
  int c9 = color(196, 72, 93, 255);
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

public void gradientEllipse(float centerX, float centerY, float containerW, float containerH, float variance, int stepHeight, int c1, int c2) {


  // float variance = 0.001;
  // int stepHeight = 1;
  //
  // float centerX = width/2;
  // float centerY = height/2;
  // float containerW = width/2;
  // float containerH = height/2;

  float lPerc = 0.0f;
  int offset = 0;
  int topCount = 0;
  int bottomCount = 0;

  int topToMddleC =  lerpColor(c1, c2, .5f);
  int middleToBottomC =  lerpColor(c1, c2, 1);
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
    topToMddleC = lerpColor(c1, c2, lPerc);
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
    middleToBottomC = lerpColor(topToMddleC, c2, lPerc);
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


public void draw() {

  noLoop();
  noStroke();
  noFill();
  background(255);

  ArrayList<Integer> colorNumbersBg = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbersBg.add(ci);
  }
  Collections.shuffle(colorNumbersBg);
  int cr1Bg = colorNumbersBg.get(0);
  int cr2Bg = colorNumbersBg.get(1);
  int cr3Bg = colorNumbersBg.get(2);

  gradientEllipse(width/2, height/2, width, height, 0.0001f, 1, colors[cr1Bg], colors[cr2Bg]);
  int coordStart = 0;
  // create an array of all the x and y coordinates
  int[][] coordinates = new int[rows*cols][];
  for(int r = 0; r < rows; r++) {
    for(int c = 0; c < cols; c++) {
      coordinates[coordStart] = new int[] {r, c};
      coordStart++;


    }
  }
  // create an array to get random coordinates from
  ArrayList<Integer> randCoord = new ArrayList<Integer>();
  for(int i = 0; i < coordinates.length; i++)
  {
    randCoord.add(i);
  }
  Collections.shuffle(randCoord);
  for(int i=0; i < coordinates.length; i++) {

    int r = coordinates[randCoord.get(i)][0];
    int c = coordinates[randCoord.get(i)][1];
    // print(" - ");
    // print(r);
    // print("/");
    // print(c);
    // print(" - ");
    // select random colors from the colors set
    ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
    for(int ci = 0; ci < colors.length; ci++)
    {
      colorNumbers.add(ci);
    }
    Collections.shuffle(colorNumbers);
    int cr1 = colorNumbers.get(0);
    int cr2 = colorNumbers.get(1);
    int cr3 = colorNumbers.get(2);

    float eW = random(gW*2.5f);

    rotate(0.01f);

    // outline
    noFill();
    stroke(colors[cr1]);
    strokeWeight(4);
    ellipse(r*gW+gW/2, (c*gH+gH/2)-3, eW-1, eW-1);

    noStroke();
    gradientEllipse(r*gW+gW/2, c*gH+gH/2, eW, eW, 0.025f, 1, colors[cr2], colors[cr3]);

  }
  resetMatrix();
  noFill();
  stroke(color(0,0,100, 255));
  strokeWeight(100);

  for (int clip = 0; clip <= 10; clip++) {
      ellipse(width/2, height/2, width+100*clip, height+100*clip);
  }

  noFill();
  stroke(colors[cr3Bg]);
  strokeWeight(8);
  ellipse(width/2, height/2, width-100, height-100);
  stroke(colors[cr1Bg]);
  ellipse(width/2, height/2, width-86, height-86);
  stroke(colors[cr2Bg]);
  ellipse(width/2, height/2, width-74, height-74);

}

public void keyPressed() {
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
    screenshotCount++;
  }
  if(keyCode == 10) {
    redraw();
  }
}
  public void settings() {  size(800, 800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210616a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
