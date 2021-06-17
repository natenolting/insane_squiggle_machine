import java.util.*;
import java.util.UUID;

int screenshotCount=1;
// control the size of the grid
int scale = 75;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;

// How many colors will we use
color[] colors  = new int[2];

void setup()
{
  size(1000, 1000);

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  colorMode(HSB, 359, 100, 100, 100);
  color c1 = color(0, 0, 100, 100);
  color c2 = color(0, 0, 0, 100);
  colors[0] = c1;
  colors[1] = c2;

}


void draw() {

}

void keyPressed() {
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
