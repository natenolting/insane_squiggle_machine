// https://www.html-code-generator.com/javascript/color-converter-script
class Colors {
  constructor() {}

  // https://www.codegrepper.com/code-examples/javascript/javascript+hsl+to+hex
  HSLtoHEX = function(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `${f(0)}${f(8)}${f(4)}`;
  }

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

    h_s_lToHex = function(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = function(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = function(x) {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#'+toHex(r)+toHex(g)+toHex(b);
  }
}
