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

public class sketch_210603b extends PApplet {

int width = 800;
int height = 600;
public void setup() {
  
  noLoop();

}

public void draw() {

  for (int w = 0; w < width; w += 20) {
      for (int h = 0; h < height; h += 20) {
        pushMatrix();
        translate(w,h);
        rotate(w/PI);
        float size = random(2,12);
        noStroke();
        fill(round(255/size));
        ellipse(0,0,size*PI,size*PI);
        popMatrix();
    }
  }
}
  public void settings() {  size(800, 600); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210603b" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
