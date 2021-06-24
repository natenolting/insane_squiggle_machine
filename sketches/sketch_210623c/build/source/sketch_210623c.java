import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.*; 
import java.util.UUID; 
import java.math.BigInteger; 
import java.security.MessageDigest; 
import java.security.NoSuchAlgorithmException; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_210623c extends PApplet {




int screenshotCount=1;
// control the size of the grid
int scale = 100;
String screenshotSet = UUID.randomUUID().toString();
int cols, rows;
float gH, gW;

// How many colors will we use
int[] colors  = new int[10];

public void setup()
{
  

  cols = ceil(width/scale);
  rows = ceil(height/scale);
  gH = ceil(width/cols);
  gW = ceil(height/rows);

  if ((width % (PApplet.parseFloat(cols) * gW)) > 0.0f) {
      float gWOffset = width % (PApplet.parseFloat(cols) * gW);
      gW += gWOffset/PApplet.parseFloat(rows);
  }

  if ((width % (PApplet.parseFloat(rows) * gH)) > 0.0f) {
      float gHOffset = width % (PApplet.parseFloat(rows) * gH);
      gH += gHOffset/PApplet.parseFloat(rows);
  }

  colorMode(HSB, 359, 100, 100, 100);
  // https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  int c1 = color(73, 38, 93, 100);
  int c2 = color(92, 39, 89, 100);
  int c3 = color(110, 35, 85, 100);
  int c4 = color(141, 41, 78, 100);
  int c5 = color(163, 55, 71, 100);
  int c6 = color(182, 68, 64, 100);
  int c7 = color(194, 87, 68, 100);
  int c8 = color(199, 84, 62, 100);
  int c9 = color(206, 79, 57, 100);
  int c10 = color(206, 80, 47, 100);
  colors[0] = c1;
  colors[1] = c2;
  colors[2] = c3;
  colors[3] = c4;
  colors[4] = c5;
  colors[5] = c6;
  colors[6] = c7;
  colors[7] = c8;
  colors[8] = c9;
  colors[9] = c10;
  // color c1 = color(60,8.53,100);
  // color c2 = color(38,31,75,100);
  // color c3 = color(32,80,90,100);
  // color c4 = color(19, 96, 82, 100);
  // color c5 = color(30, 29, 8, 100);
  //
  // colors[0] = c1;
  // colors[1] = c2;
  // colors[2] = c3;
  // colors[3] = c4;
  // colors[4] = c5;


}


public void draw() {
  noLoop();
  strokeWeight(5);
  noFill();
  background(color(0,0,100, 100));


  ArrayList<Coordinate> coordinates = new ArrayList();
  int coordStart = 0;
  stroke(color(0,0,0,100));
  strokeWeight(2);
  beginShape(POINTS);
  for(int r = 0; r < rows; r++) {
    for(int c = 0; c < cols; c++) {
      coordinates.add(new Coordinate(c, r, c*gW, r*gH));
      vertex(c*gW,r*gH);
    }
  }
  endShape();
  ArrayList<Integer> coordIds = new ArrayList<Integer>();
  for(int ci = 0; ci < coordinates.size(); ci++) {
    coordIds.add(ci);
  }
  Collections.shuffle(coordIds);

  Coordinate last = coordinates.get(coordIds.get(0));
  // Coordinate last = coordinates.get();
  // float startY = start.y;
  // float lastX = start.x;
  // float lastY = start.y;
  // print(" ");
  // print(" - ");
  // print(last.x);
  // print(" / ");
  // print(last.y);
  // print(" / ");
  // print(last.hash);
  // print(" / ");
  // print(last.col);
  // print(" / ");
  // print(last.row);
  // print(" - ");
  // print(" ");

  fill(colors[0]);
  noStroke();
  rect(last.x, last.y, gW, gH);
  Coordinate north = last;
  Coordinate northEast = last;
  Coordinate east = last;
  Coordinate southEast = last;
  Coordinate south = last;
  Coordinate southWest = last;
  Coordinate west = last;
  Coordinate northWest = last;
  for(int i = 1; i < coordinates.size(); i++) {
      Coordinate current = coordinates.get(i);

      // find North
      if(current.row - 1 > -1 && current.row == last.row - 1 && current.col == last.col ) {
        north = coordinates.get(i);
        continue;
      }

      // find north East
      if(current.row - 1 > -1 && current.col + 1 < cols && current.row == last.row - 1 && current.col == last.col + 1 ) {
        northEast = coordinates.get(i);
        continue;
      }

      // find East
      if (current.col + 1 < cols && current.col == last.col + 1 && current.row == last.row) {
        east = coordinates.get(i);
        continue;
      }

      // find south East
      if(current.row + 1 <= rows && current.col + 1 < cols && current.row == last.row + 1 && current.col == last.col + 1 ) {
        southEast = coordinates.get(i);
        continue;
      }


      // Find South
      if (current.row + 1 < rows && current.row == last.row + 1 && current.col == last.col) {
        south = coordinates.get(i);
        continue;
      }

      // find south west
      if(current.row + 1 <= rows && current.col - 1 > -1 && current.row == last.row + 1 && current.col == last.col - 1 ) {
        southWest = coordinates.get(i);
        continue;
      }


      // Find West
      if (current.col - 1 > -1 && current.col == last.col - 1 && current.row == last.row) {
        west = coordinates.get(i);
        continue;
      }
  }
  textSize(12);
  fill(colors[1]);
  rect(east.x, east.y, gW, gH);
  text("east", east.x, east.y);
  // print("East Col: "+east.col + " ");

  fill(colors[2]);
  rect(west.x, west.y, gW, gH);
  text("west", west.x, west.y);
  // print("West Col: "+west.col + " ");
  fill(colors[3]);
  rect(north.x, north.y, gW, gH);
  text("north", north.x, north.y);
  fill(colors[4]);
  rect(south.x, south.y, gW, gH);
  text("south", south.x, south.y);
  fill(colors[5]);
  rect(northEast.x, northEast.y, gW, gH);
  text("north east", northEast.x, northEast.y);
  fill(colors[6]);
  rect(southEast.x, southEast.y, gW, gH);
  text("south east", southEast.x, southEast.y);
  fill(colors[7]);
  rect(southWest.x, southWest.y, gW, gH);
  text("south west", southWest.x, southWest.y);

    // for(int l=0; l < 10000; l++) {
    //   ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
    //   for(int ci = 0; ci < colors.length; ci++)
    //   {
    //     colorNumbers.add(ci);
    //   }
    //   Collections.shuffle(colorNumbers);
    //
    //   stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), int(random(10))*10);
    //   noFill();
    //   strokeWeight(random(gW));
    //   beginShape();
    //   vertex(lastX, lastY);
    //   for(int i=0; i < 25; i++) {
    //
    //     int direction = int(random(1,9));
    //     if (direction == 1) {
    //       lastY = lastY+gH*-1;
    //     }
    //     if (direction == 2) {
    //       lastX = lastX+gW;
    //       lastY = lastY+gH*-1;
    //     }
    //     if (direction == 3) {
    //       lastX = lastX+gW;
    //     }
    //     if (direction == 4) {
    //       lastX = lastX+gW;
    //       lastY = lastY+gH;
    //     }
    //     if (direction == 5) {
    //       lastY = lastY+gH;
    //     }
    //     if (direction == 6) {
    //       lastX = lastX+gW*-1;
    //       lastY = lastY+gH;
    //     }
    //     if (direction == 7) {
    //       lastX = lastX+gW*-1;
    //     }
    //     if (direction == 8) {
    //       lastX = lastX+gW*-1;
    //       lastY = lastY+gH*-1;
    //     }
    //
    //     if(lastX > width) {
    //       lastX = width;
    //     }
    //
    //     if(lastX < 0) {
    //       lastX = 0;
    //     }
    //
    //     if(lastY > height) {
    //       lastY = height;
    //     }
    //
    //     if(lastY < 0) {
    //       lastY = 0;
    //     }
    //
    //     vertex(lastX, lastY);
    //
    // }
    // endShape();
    //
    // // crop
    // smooth();
    // stroke(color(0,0,100,100));
    // strokeWeight(gW*10);
    // ellipse(width/2, height/2, width+gW*10, height+gH*10);
    //

  // }

  // beginShape(POINTS);
  // for(int r = 0; r < rows + 1; r++) {
  //   for(int c = 0; c < cols + 1; c++) {
  //     ArrayList<Integer> colorNumbers = new ArrayList<Integer>();
  //     for(int ci = 0; ci < colors.length; ci++)
  //     {
  //       colorNumbers.add(ci);
  //     }
  //     Collections.shuffle(colorNumbers);
  //
  //     stroke(hue(colors[colorNumbers.get(0)]), saturation(colors[colorNumbers.get(0)]), brightness(colors[colorNumbers.get(0)]), 25);
  //     strokeWeight(5);
  //     vertex(float(c)*gW, float(r)*gH);
  //   }
  // }
  // endShape();

}




public void keyPressed() {
  // save a screenshot if 's' is presed
  if(key == 's') {
    save("result-h-"+nf(height)+"-w-"+nf(width)+"-s-"+nf(scale)+"-r-"+nf(rows)+"-c-"+nf(cols)+"-"+screenshotSet+"-"+nf(screenshotCount,4)+".jpg");
    screenshotCount++;
  }
  // redraw sketch if 'enter' is presed
  if(keyCode == 10) {
    redraw();
  }
}

public class Coordinate {
    public boolean isroot = false;
    public String hash = "";
    public int col;
    public int row;
    public float x;
    public float y;
    public float w;
    public float h;
    public boolean used = false;

    public Coordinate(){}

    public Coordinate(int col, int row, float x, float y) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
        hash = new StringBuilder(row).append('-').append(col).toString();
        this.hash = new MD5().getMd5(hash).toString();
    }

}




// Java program to calculate MD5 hash value
public class MD5 {
	public String getMd5(String input)
	{
		try {

			// Static getInstance method is called with hashing MD5
			MessageDigest md = MessageDigest.getInstance("MD5");

			// digest() method is called to calculate message digest
			// of an input digest() return array of byte
			byte[] messageDigest = md.digest(input.getBytes());

			// Convert byte array into signum representation
			BigInteger no = new BigInteger(1, messageDigest);

			// Convert message digest into hex value
			String hashtext = no.toString(16);
			while (hashtext.length() < 32) {
				hashtext = "0" + hashtext;
			}
			return hashtext;
		}

		// For specifying wrong message digest algorithms
		catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}
}
  public void settings() {  size(1000, 1000); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "sketch_210623c" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
