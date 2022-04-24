/*
 * Based on Estienne's Pixel sorting sketch
 * from https://openprocessing.org/sketch/1239622
*/

class PixelSort {
  img;
  direction;
  threshold;
  pixelDistance;
  changes = [];

  constructor(img, direction = "vertical", threshold = 50, pixelDistance = 1) {
    this.img = img;
    this.direction = direction;
    this.threshold = threshold;
    this.pixelDistance = pixelDistance;
  }

  generatePixelSort = function() {
	for (let i = 0; i < this.changes.length; i++) {
		if (i < this.changes.length - 1) {
			this.pixelSortTo(
				img,
				this.changes[i].x,
				this.changes[i].y,
				this.changes[i + 1].x,
				this.changes[i + 1].y,
				direction
			);
		} else {
			this.pixelSort(this.img, this.changes[i].x, this.changes[i].y, this.direction);
		}
	}
	this.img.updatePixels();
}

detectPixelChanges = function(onlyFirst = false) {
	let results = [];
	direction =
		this.direction == "horizontal" ? createVector(1, 0) : createVector(0, 1);
	let pos = createVector();

	for (let j = 0, lim = this.direction.x ? img.height : img.width; j < lim; j++) {
		for (let i = 0, lim = this.direction.x ? img.width : img.height; i < lim; i++) {
			let colBefore = this.getPixelValue(
				img,
				this.direction.x ? i - this.pixelDistance : j,
				this.direction.x ? j : i - this.pixelDistance
			);
			if (colBefore) {
				let col = this.getPixelValue(img, this.direction.x ? i : j, this.direction.x ? j : i);
				let d = dist(
					colBefore[0],
					colBefore[1],
					colBefore[2],
					col[0],
					col[1],
					col[2]
				);
				if (d > threshold) {
					//point(direction.x ? i : j, direction.x ? j : i);
					results.push(createVector(this.direction.x ? i : j, this.direction.x ? j : i));
					if (onlyFirst) break;
				}
			}
		}
	}
	this.changes = results;
}

getPixelValue = function(img, x, y) {
	if (x < 0 || x > img.width - 1 || y < 0 || y > img.height - 1) return null;
	if (!img.pixels.length) img.loadPixels();
	let i = 4 * (x + y * img.width);
	let r = img.pixels[i];
	let g = img.pixels[i + 1];
	let b = img.pixels[i + 2];
	let a = img.pixels[i + 3];
	return [r, g, b, a];
}

setPixelValue = function(img, x, y, colR, colG, colB, colA = 255) {
	if (x < 0 || x > img.width - 1 || y < 0 || y > img.height - 1) return null;
	if (!img.pixels.length) img.loadPixels();
	let i = 4 * (x + y * img.width);
	img.pixels[i] = colR;
	img.pixels[i + 1] = colG;
	img.pixels[i + 2] = colB;
	img.pixels[i + 3] = colA;
}

pixelSort = function(img, x, y, direction = "vertical") {
	direction =
		direction == "horizontal" ? createVector(1, 0) : createVector(0, 1);
	let pix = [];
	let start = direction.x ? x : y;
	let end = direction.x ? img.width : img.height;
	for (let i = start; i < end; i++) {
		let val = this.getPixelValue(img, direction.x ? i : x, direction.x ? y : i);
		pix.push(val);
	}

	pix.sort(this.sortFunction);
	let i = 0;
	for (let p of pix) {
		this.setPixelValue(
			img,
			x + direction.x * i,
			y + direction.y * i,
			p[0],
			p[1],
			p[2]
		);
		i++;
	}
}

pixelSortTo = function(img, x1, y1, x2, y2, direction = "vertical") {
	direction =
		direction == "horizontal" ? createVector(1, 0) : createVector(0, 1);
	let pix = [];
	let start = direction.x ? x1 : y1;
	let end = direction.x ? img.width : img.height;
	for (let i = start; i < end; i++) {
		let x = direction.x ? i : x1;
		let y = direction.x ? y1 : i;
		if (x == x2 && y == y2) break;
		let val = this.getPixelValue(img, x, y);
		pix.push(val);
	}

	pix.sort(this.sortFunction);
	let i = 0;
	for (let p of pix) {
		this.setPixelValue(
			img,
			x1 + direction.x * i,
			y1 + direction.y * i,
			p[0],
			p[1],
			p[2]
		);
		i++;
	}
}

sortFunction = function(a, b) {
	//return brightness(color(b[0], b[1], b[2])) - brightness(color(a[0], a[1], a[2]));
	//return b[0] * b[1] * b[2] - a[0] * a[1] * a[2];
	return -(b[0] - a[0] + b[1] - a[1] + b[2] - a[2]);
}

removeChangesCloseTo = function(x, y, r) {
	for (let i = this.changes.length - 1; i >= 0; i--) {
		if (dist(this.changes[i].x, this.changes[i].y, x, y) < r) {
			this.changes.splice(i, 1);
		}
	}
}
}
