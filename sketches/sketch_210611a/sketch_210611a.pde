import java.util.*;
import java.util.UUID;

int cols = 11;
int rows = 11;
float variance = 0.3;
int screenshotCount=1;
float gH, gW;
String screenshotSet = UUID.randomUUID().toString();

color cyan = #00a5e8;
color magenta = #f7107e;
color yellow = #ffef33;
color black = #090001;
color[] colors  = {cyan, magenta, yellow, black};

void setup() {
  size(1000,1000);
  gH = height/rows;
  gW = width/cols;
  background(0);
}

void topRightArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a <= PI+HALF_PI+HALF_PI; a+=v) {
    lastX = centerX + (containerW/2) * cos(a-v);
    lastY = centerY + (containerH/2) * sin(a-v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}

void bottomRightArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=HALF_PI-QUARTER_PI*2; a <= HALF_PI + v; a+=v) {
    lastX = centerX + (containerW/2) * cos(a-v);
    lastY = centerY + (containerH/2) * sin(a-v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}


void topLeftArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;

  for(float a=PI+HALF_PI; a >= PI; a+=-v) {
    lastX = centerX + (containerW/2) * cos(a+v);
    lastY = centerY + (containerH/2) * sin(a+v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}


void bottomLeftArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float v) {

  float lastX, lastY, nextX, nextY;
  for(float a=PI; a >= HALF_PI - v; a+=-v) {
    lastX = centerX + (containerW/2) * cos(a+v);
    lastY = centerY + (containerH/2) * sin(a+v);
    nextX = centerX + (containerW/2) * cos(a);
    nextY =  centerY + (containerH/2) * sin(a);
    //line(lastX, lastY, nextX, nextY);
    line_clipped(lastX, lastY, nextX, nextY, containerX, containerY, containerW, containerH);
  }
}

void cirularArc(float centerX, float centerY, float containerX, float containerY, float containerW, float containerH, float variance) {
    topRightArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    bottomRightArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    topLeftArc(centerX, centerY, containerX, containerY, gW, gH, variance);
    bottomLeftArc(centerX, centerY, containerX, containerY, gW, gH, variance);
}


void draw() {
  background(255);
  noLoop();
  int pick = int(random(4));
  float x, y, segments, cX, cY;
  // drawing here...
  stroke(255);
  strokeWeight(2);
  noFill();
  for(int cc=0; cc < colors.length; cc++) {
    stroke(red(colors[cc]), green(colors[cc]), blue(colors[cc]), 100);
    for(int r = 0; r < rows; r++) {
      for(int c = 0; c < cols; c++) {
        if(pick > 3) {
          pick = 0;
        }
        segments = random(noise(r, c), 10);
        for(float i=0.0; i < 1000; i+=segments) {

          x = gW*r;
          y = gH*c;
          cX = (gW*r+gW/2);
          cY = (gH*c+gH/2);

          if (pick == 0) {
            cX-=i;
            cY+=i;

          }

          if (pick == 1) {
            cX -=i;
            cY -=i;
          }

          if (pick == 2) {
            cX +=i;
            cY -=i;
          }

          if (pick == 3) {
            cX +=i;
            cY +=i;
          }
          cirularArc(cX, cY, x, y, gW, gH, variance);

        }
        pick++;
      }
    }
}


}

void keyPressed() {
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
    screenshotCount++;
  }
  if(keyCode == 10) {
    redraw();
  }
}
