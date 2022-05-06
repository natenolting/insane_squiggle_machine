colors = new Colors();
let offset = 0;
let ell;
let cyan = '00AEEF';
let magenta = 'EC008C';
let yellow = 'FFF200';
let black = '000004';
let pallets;

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
	createCanvas(800, 800);
	// put setup code here
  ell = (new VectorShape(500, width - 500, 500, height - 500)).ellipse();
  fill(0,0,0,1);
  rect(0,0,width, height);
  pallets = [[cyan, magenta, yellow, black]];
}

function draw() {

  noFill();
  strokeWeight(1);
  hexColors = pallets[0];
  //hexColors = ['FFFFFF', 'FBB042', '58595B', '231F20'];
  colorList = [];
  let pallet = [];
  for (const item of hexColors) {
      let rgb = colors.HEXtoRGB(item);
      pallet.push(rgb);
  }
  thisColor = random(pallet);
  beginShape();
  stroke(thisColor[0], thisColor[1], thisColor[2], .008);

    for (var i = 0; i < ell.length; i++) {
      curveVertex(ell[i].x,ell[i].y);
      let nv = createVector(ell[i].x + random(-offset, offset), ell[i].y + random(-offset, offset));
      ell[i] = nv;
    }


  endShape(CLOSE);
  offset += 0.01;

}
