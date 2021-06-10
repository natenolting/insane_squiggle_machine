import java.util.*;
import java.util.Collections;
import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

int cols = 6;
int rows = 6;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
// https://colorpalettes.net/color-palette-4269/
color c1 = #161819;
color c2 = #663d1d;
color c3 = #3d2315;
color[] colors  = {c1, c2, c3};
int gH, gW;

void setup() {
  size(800,800);
  gH = height/rows;
  gW = width/cols;
  background(c1);
}

void topLeftArc(int r, int c) {
  arc(gW*r, gH*c, gW, gH, radians(0), radians(90));
}

void topArc(int r, int c) {
  arc(gW*r+(gW/2), gH*c, gW, gH, radians(0), radians(180));
}

void topRightArc(int r, int c) {
  arc(gW*r+gW, gH*c, gW, gH, radians(90), radians(180));
}

void rigthArc(int r, int c) {
  arc(gW*r+gW, gH*c+gH/2, gW, gH, radians(90), radians(270));
}

void bottomRightArc(int r, int c) {
  arc(gW*(r+1), gH*(c+1), gW, gH, radians(0), radians(270));
}

void bottomArc(int r, int c) {
  arc(gW*r+(gW/2), gH*c+gH, gW, gH, radians(180), radians(360));
}

void bottomLeftArc(int r, int c) {
  arc(gW*r, gH*(c+1), gW, gH, radians(-90), radians(0));
}

void leftArc(int r, int c) {
  arc(gW*r, gH*c+gH/2, gW, gH, radians(-90), radians(90));
}

void cell(int r, int c, color c1, color c2, color c3) {

  noStroke();
  fill(c1);
  rect(gW*r,gH*c, gW, gH);


  int slice = int(random(1,4));

  if (slice == 1) {
    fill(c2);
    topLeftArc(r, c);
    bottomRightArc(r, c);
    fill(c3);
    topRightArc(r, c);
    bottomLeftArc(r, c);
  }
  if (slice == 2) {
    fill(c2);
    rigthArc(r, c);
    fill(c3);
    leftArc(r, c);
  }
  if (slice == 3) {
    fill(c2);
    topArc(r, c);
    fill(c3);
    bottomArc(r, c);
  }
}

void draw() {
  background(0);
  noLoop();
  noStroke();
  for(int c=0; c < cols; c++) {
    for(int r=0; r < rows; r++) {

      ArrayList<Integer> numbers = new ArrayList<Integer>();
      for(int i = 0; i < colors.length; i++)
      {
        numbers.add(i);
      }
      Collections.shuffle(numbers);
      int cr1 = numbers.get(0);
      int cr2 = numbers.get(1);
      int cr3 = numbers.get(2);

      cell(r, c, colors[cr1],colors[cr2], colors[cr3]);
    }
  }
  save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
  screenshotCount++;
}

void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
