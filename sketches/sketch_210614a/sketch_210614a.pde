import java.util.*;
import java.util.UUID;

int scale = 75;
float variance = .4;
int screenshotCount=1;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows, gH, gW;
// https://colorpalettes.net/color-palette-4269/
color c1 = #99998f;
color c2 = #cbb796;
color c3 = #f8a73f;
color c4 = #db5c01;
color c5 = #1b1612;
color[] colors  = {c1, c2, c3, c4, c5};

void setup()
{
  size(1000, 1000);
  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

}

void cell(int x, int y, int w, int h, int c1, int c2, int c3) {

  float w1 = random(w*variance);
  float h1 = random(h*variance);
  float avHW = (w1+h1)/2;
  int loops = int(random(scale*variance));
  int type = int(random(2));

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

void draw()
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

void keyPressed() {
  if(key == 's') {
    save("result-"+nf(height)+"-"+nf(width)+"-"+nf(rows)+"-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".png");
    screenshotCount++;
  }
  if(keyCode == 10) {
    redraw();
  }
}
