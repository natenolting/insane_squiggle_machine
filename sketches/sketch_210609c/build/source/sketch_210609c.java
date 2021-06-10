import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 
import java.util.Collections; 
import java.util.ArrayList; 
import java.util.UUID; 
import java.util.concurrent.ThreadLocalRandom; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210609c extends PApplet {







int cols = 6;
int rows = 6;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
// https://colorpalettes.net/color-palette-4269/
int c1 = 0xff161819;
int c2 = 0xff663d1d;
int c3 = 0xff3d2315;
int[] colors  = {c1, c2, c3};
int gH, gW;

public void setup() {
  
  gH = height/rows;
  gW = width/cols;
  background(c1);
}

public void topLeftArc(int r, int c) {
  arc(gW*r, gH*c, gW, gH, radians(0), radians(90));
}

public void topArc(int r, int c) {
  arc(gW*r+(gW/2), gH*c, gW, gH, radians(0), radians(180));
}

public void topRightArc(int r, int c) {
  arc(gW*r+gW, gH*c, gW, gH, radians(90), radians(180));
}

public void rigthArc(int r, int c) {
  arc(gW*r+gW, gH*c+gH/2, gW, gH, radians(90), radians(270));
}

public void bottomRightArc(int r, int c) {
  arc(gW*(r+1), gH*(c+1), gW, gH, radians(0), radians(270));
}

public void bottomArc(int r, int c) {
  arc(gW*r+(gW/2), gH*c+gH, gW, gH, radians(180), radians(360));
}

public void bottomLeftArc(int r, int c) {
  arc(gW*r, gH*(c+1), gW, gH, radians(-90), radians(0));
}

public void leftArc(int r, int c) {
  arc(gW*r, gH*c+gH/2, gW, gH, radians(-90), radians(90));
}

public void cell(int r, int c, int c1, int c2, int c3) {

  noStroke();
  fill(c1);
  rect(gW*r,gH*c, gW, gH);


  int slice = PApplet.parseInt(random(1,4));

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

public void draw() {
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

public void keyPressed() {
  if(keyCode == 10) {
    redraw();
  }
}
  public void settings() {  size(800,800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210609c" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
