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


float r;
float factor = 1;
public void setup() {
  
  r = width/2 - 16;
}

public PVector getVector(float index, float total) {
  float angle = map(index % total, 0, total, 0, TWO_PI);
  PVector v = PVector.fromAngle(angle + PI);
  v.mult(r);
  return v;
}

public void draw() {
  background(0);
  factor += 0.01f;
  //int total  = int(map(mouseX, 0, width, 0, 200));
  float total  = 200.0f;
  translate(width/2, height/2);
  stroke(255);
  noFill();
  circle(0,0,r*2);
  for (int i=0; i < total; i++) {
    PVector v = getVector(i, total);
    fill(255);
    circle(v.x, v.y, 16);
  }
  for (int i=0; i < total; i++) {
    PVector a = getVector(i, total);
    PVector b = getVector(i * factor, total);
    line(a.x, a.y, b.x, b.y);
  }
}
  public void settings() {  size(800, 800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210607b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
