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

public class sketch_210607b extends PApplet {

int cols, rows;
int scl = 20;

public void setup() {
  

  int w = 800;
  int h = 800;
  cols = w / scl;
  rows = h / scl;
  noLoop();

}

public void draw() {
  background(0);
  stroke(255);
  noFill();
  rotateX(PI/3);
  for (int y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (int x = 0; x < cols; x++) {
      vertex(x*scl,y*scl);
      vertex(x*scl,(y+1)*scl);
    }
    endShape();
  }

}
  public void settings() {  size(800, 800, P3D); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210607b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
