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

public class sketch_210607a extends PApplet {


int width = 1920;
int height = 1080;
int bg = 0xffffffff;

public void setup() {
  
  background(bg);
  noLoop();
}

public void draw() {
  // for(int i = 1; i <= 10; i++) {
  //     point(width/i, height/2);
  // }
  int columns = 10;
  int rows = 5;
  int columnXPosition;
  int nextColumnXPosition;


  for(int i=1; i <= rows; i++) {
      mountains(columns, width, 0, (height/rows)*i, (height/rows)*2, 0xffcccccc);
  }



}

public void mountains(int columns, int width, int startX, int startY, int heightOffset, int spikeColor) {

  float columnXPosition = 0.0f;
  float nextColumnXPosition = 0.0f;
  float spikeYPosition = 0.0f;
  float spikeXPosition = 0.0f;
  float lastX = 0.0f;
  float snowPeakOffset = 0.7f;

  for(int i = 1; i < columns-1; i++) {
    columnXPosition = (width/columns)*i;
    nextColumnXPosition = (width/columns)*(i+1);
    spikeXPosition = ceil((columnXPosition + nextColumnXPosition)/2);
    spikeYPosition = random(startY-heightOffset, startY);
    lastX = (width/columns)*(i+1);
    fill(spikeColor);
    noStroke();
    // Mountain peak
    triangle(
      columnXPosition,
      startY,
      spikeXPosition,
      spikeYPosition,
      lastX,
      startY
      );
      // Mountain outline
      strokeWeight(6);
      stroke(50);
      strokeCap(ROUND);
      line(columnXPosition, startY, spikeXPosition, spikeYPosition);
      line(spikeXPosition, spikeYPosition, lastX, startY);

      // mountain peak
      strokeCap(SQUARE);
      line(
        lerp(columnXPosition, spikeXPosition, snowPeakOffset),
        lerp(startY, spikeYPosition, snowPeakOffset),
        spikeXPosition,
        spikeYPosition+(heightOffset/2)
        );
      line(
        spikeXPosition,
        spikeYPosition+(heightOffset/2),
        lerp(lastX, spikeXPosition, snowPeakOffset),
        lerp(startY, spikeYPosition, snowPeakOffset)
        );
  }

  line(startX, startY,(width/columns), startY);
  line(lastX, startY,(width/columns)*columns, startY);

}
  public void settings() {  size(1920, 1080); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210607a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
