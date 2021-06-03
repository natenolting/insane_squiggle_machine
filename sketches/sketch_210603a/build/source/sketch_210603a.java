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

public class sketch_210603a extends PApplet {

int height = 500;
int width = 500;

public void setup() {
  
  noLoop();

}

public void draw() {
  for (int w = 0; w < width; w += 10) {
    for (int h = 0; h < height; h += 10) {
      float size = random(2,12);
      noStroke();
      fill(0);
      rect(w,h,size,size);
    }
  }
}
  public void settings() {  size(500, 500); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210603a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
