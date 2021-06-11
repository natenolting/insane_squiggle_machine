import java.util.*;
import java.util.UUID;

int cols = 5;
int rows = 5;
float variance = 0.1;
int screenshotCount=1;
int gH, gW;
String screenshotSet = UUID.randomUUID().toString();

void setup() {
  size(800,800);
  gH = height/rows;
  gW = width/cols;
  background(0);
}

void topRightArc(int centerX, int centerY, int containerX, int containerY, int w, int h, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=v) {
    lastX = centerX + (w/2) * cos(a-v);
    lastY = centerY + (h/2) * sin(a-v);
    nextX = centerX + (w/2) * cos(a);
    nextY =  centerY + (h/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, w, h);
  }
}

void bottomRightArc(int centerX, int centerY, int containerX, int containerY, int w, int h, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + v; a+=v) {
    lastX = centerX + (w/2) * cos(a-v);
    lastY = centerY + (h/2) * sin(a-v);
    nextX = centerX + (w/2) * cos(a);
    nextY =  centerY + (h/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, w, h);
  }
}


void topLeftArc(int centerX, int centerY, int containerX, int containerY, int w, int h, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a >= PI; a+=-v) {
    lastX = centerX + (w/2) * cos(a+v);
    lastY = centerY + (h/2) * sin(a+v);
    nextX = centerX + (w/2) * cos(a);
    nextY =  centerY + (h/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, w, h);
  }
}


void bottomLeftArc(int centerX, int centerY, int containerX, int containerY, int w, int h, float v) {

  float lastX, lastY, nextX, nextY;
  for(float a=PI; a >= HALF_PI - v; a+=-v) {
    lastX = centerX + (w/2) * cos(a+v);
    lastY = centerY + (h/2) * sin(a+v);
    nextX = centerX + (w/2) * cos(a);
    nextY =  centerY + (h/2) * sin(a);
    //line(lastX, lastY, nextX, nextY);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, w, h);
  }
}

void draw() {
  background(0);
  noLoop();
  int cX, cY, x, y;
  // drawing here...
  stroke(255);
  strokeWeight(2);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
  for(int r = 0; r < rows; r++) {
    for(int c = 0; c < cols; c++) {
      for(int i=0; i < 100; i+=10) {
        cX = (gW*r+gW/2)-i;
        cY = (gH*c+gH/2)-i;
        x = gW*r;
        y = gH*c;
        topRightArc(cX, cY, x, y, gW, gH, variance);
        bottomRightArc(cX, cY, x, y, gW, gH, variance);
        bottomLeftArc(cX, cY, x, y, gW, gH, variance);
        topLeftArc(cX, cY, x, y, gW, gH, variance);
      }
    }
  }


  //save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
