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

public class sketch_210623b extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
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

  colorMode(HSB, 359, 100, 100, 100);
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


public void draw() {
  noLoop();
  noFill();

  ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  for(int ci = 0; ci < colors.length; ci++)
  {
    colorNumbers.add(ci);
  }
  Collections.shuffle(colorNumbers);

  background(colors[colorNumbers.get(1)]);


  noStroke();
  fill(colors[colorNumbers.get(2)]);
  // center
  pushMatrix();
  translate(width/2, height/2);
  ellipse(0,0,width/3, height/3);
  popMatrix();




  fill(colors[colorNumbers.get(2)]);
  noStroke();
  // top left
  pushMatrix();
  translate(width/4, height/4);
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // top right
  pushMatrix();
  translate(width/2+(width/4), height/4);
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // bottom left
  pushMatrix();
  translate(width/4, height/2+(height/4));
  ellipse(0,0,width/3, height/3);
  popMatrix();
  // bottom right
  pushMatrix();
  translate(width/2+(width/4), height/2+(height/4));
  ellipse(0,0,width/3, height/3);
  popMatrix();

  noFill();
  stroke(colors[colorNumbers.get(0)]);
  for(float rotation = 0.0f; rotation <= TWO_PI; rotation+=0.01f) {
    pushMatrix();
    translate(width/2, height/2);
    //scale(rotation/1.5);
    rotate(rotation*PI);
    ellipse(0,0,width/1.125f-20, height/5-20);
    popMatrix();
  }


  // stroke(colors[colorNumbers.get(3)]);
  // for(float rotation = 0.0; rotation <= HALF_PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3+rotation, height/4+rotation);
  //   rotate(-rotation*PI);
  //   ellipse(0,0,width/4-20, height/1-20);
  //   popMatrix();
  // }
  // stroke(colors[colorNumbers.get(2)]);
  // for(float rotation = 0.0; rotation <= PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3, height/3);
  //   rotate(rotation*PI);
  //   rect(0,0,width/4-20, height/7-20);
  //   popMatrix();
  // }
  //
  // stroke(colors[colorNumbers.get(2)]);
  // for(float rotation = 0.0; rotation <= PI; rotation+=0.01) {
  //   pushMatrix();
  //   translate(width/3, height/3);
  //   rotate(rotation*PI);
  //   rect(0,0,width/4-20, height/7-20);
  //   popMatrix();
  // }



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
    String[] appletArgs = new String[] { "sketch_210623b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
