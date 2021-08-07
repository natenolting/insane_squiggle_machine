// https://www.html-code-generator.com/javascript/color-converter-script
class Colors {
  constructor() {}

  HEXtoRGB = function (hex) {
      hex = hex.replace(/#/g, '');
      if (hex.length === 3) {
          hex = hex.split('').map(function (hex) {
              return hex + hex;
          }).join('');
      }
      var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
      if (result) {
          var red = parseInt(result[1], 16);
          var green = parseInt(result[2], 16);
          var blue = parseInt(result[3], 16);

          return [red, green, blue];
      } else {
          return null;
      }
  };

  RGBtoHSL = function(red, green, blue) {
      red = red < 0 ? 0 : red > 255 ? 255 : red;
      green = green < 0 ? 0 : green > 255 ? 255 : green;
      blue = blue < 0 ? 0 : blue > 255 ? 255 : blue;

      var r = red / 255,
          g = green / 255,
          b = blue / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, l;
      if (max == min) {
          h = 0;
      } else if (r == max) {
          h = (g - b) / delta;
      } else if (g == max) {
          h = 2 + (b - r) / delta;
      } else if (b == max) {
          h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) h += 360;
      l = (min + max) / 2;
      if (max == min) s = 0;
      else if (l <= 0.5) s = delta / (max + min);
      else s = delta / (2 - max - min);
      return {
          h: Math.round(h),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
      };
  };
}
