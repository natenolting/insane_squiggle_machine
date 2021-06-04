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

public class sketch_210604a extends PApplet {

int height = 1080;
int width = 1920;

public void setup() {
  
  noLoop();
  background(0);
}

public void draw() {
  spiral(width/2, height/2, 1.125f, 1.125f);
}

public void spiral(float transX, float transY, float multiplyX, float multiplyY) {
  translate(transX,transY);
  int max = 255;
  for(float i = 0; i < max * 2; i++) {
    rotate(0.1f);
    noStroke();
    float fillColor = i;
    if (i > 255.0f) {
      fillColor = 255.0f + (255.0f -  i);
    }
    fill(fillColor);

    ellipse(i, 0, round(i * multiplyX),round(i * multiplyY));
  }
}
  public void settings() {  size(1920, 1080); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210604a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
