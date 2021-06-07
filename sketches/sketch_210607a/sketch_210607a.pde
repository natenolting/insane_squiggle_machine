
int width = 1920;
int height = 1080;
color bg = #ffffff;

void setup() {
  size(1920, 1080);
  background(bg);
  noLoop();
}

void draw() {
  // for(int i = 1; i <= 10; i++) {
  //     point(width/i, height/2);
  // }
  int columns = 10;
  int rows = 5;
  int columnXPosition;
  int nextColumnXPosition;


  for(int i=1; i <= rows; i++) {
      mountains(columns, width, 0, (height/rows)*i, (height/rows)*2, #cccccc);
  }



}

void mountains(int columns, int width, int startX, int startY, int heightOffset, color spikeColor) {

  float columnXPosition = 0.0;
  float nextColumnXPosition = 0.0;
  float spikeYPosition = 0.0;
  float spikeXPosition = 0.0;
  float lastX = 0.0;
  float snowPeakOffset = 0.7;

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
