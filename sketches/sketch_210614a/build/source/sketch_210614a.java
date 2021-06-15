import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 
import java.util.UUID; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210614a extends PApplet {




int scale = 75;
float variance = .4f;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;
// https://colorpalettes.net/color-palette-4269/
int c1 = 0xff99998f;
int c2 = 0xffcbb796;
int c3 = 0xfff8a73f;
int c4 = 0xffdb5c01;
int c5 = 0xff1b1612;
int[] colors  = {c1, c2, c3, c4, c5};

public void setup()
{
  
  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

}

public void cell(int x, int y, int w, int h, int c1, int c2, int c3) {

  float w1 = random(w*variance);
  float h1 = random(h*variance);
  float avHW = (w1+h1)/2;
  int loops = PApplet.parseInt(random(scale*variance));
  int type = PApplet.parseInt(random(2));

  if (type == 0 ) {
    stroke(colors[c1]);
    strokeWeight(1);
    for(int i = loops; i >= 0; i--) {
    strokeWeight(i*variance);
      ellipse(x+w/2+noise(w1),y+h/2+noise(h1), avHW*i+noise(w1), avHW*i+noise(h1));
    }
  }

  if (type == 1) {
    noStroke();
    fill(colors[c1]);
    ellipse(x+w/2, y+h/2, avHW, avHW);
  }
}

public void draw()
{

    noLoop();
    noStroke();
    noFill();
    background(255);
    int coordStart = 0;
    // create an array of all the x and y coordinates
    int[][] coordinates = new int[rows*cols][];
    for(int r = 0; r < rows; r++) {
      for(int c = 0; c < cols; c++) {
        coordinates[coordStart] = new int[] {r, c};
        coordStart++;


      }
    }
    // create an array to get random coordinates from
    ArrayList<Integer> randCoord = new ArrayList<Integer>();
    for(int i = 0; i < coordinates.length; i++)
    {
      randCoord.add(i);
    }
    Collections.shuffle(randCoord);
    for(int i=0; i < coordinates.length; i++) {
      int r = coordinates[randCoord.get(i)][0];
      int c = coordinates[randCoord.get(i)][1];

      // select random colors from the colors set
      ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
      for(int ci = 0; ci < colors.length; ci++)
      {
        colorNumbers.add(ci);
      }
      Collections.shuffle(colorNumbers);
      int cr1 = colorNumbers.get(0);
      int cr2 = colorNumbers.get(1);
      int cr3 = colorNumbers.get(2);


      cell(c*gW, r*gH, gH, gW, cr1, cr2, cr3);


    }
}

public void keyPressed() {
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
    screenshotCount++;
  }
  if(keyCode == 10) {
    redraw();
  }
}
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210614a" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
