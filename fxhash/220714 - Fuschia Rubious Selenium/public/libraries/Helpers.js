class Helpers {
  constructor() {}

  makeid = function (length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(fxrand() * charactersLength));
  }

  return result;
};


  mean = function (array)
  {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
      total += array[i];
    }

    return total / array.length;
  };

  average = function(array)
  {
    return this.mean(array);
  };

  /**
  * https://jonlabelle.com/snippets/view/javascript/calculate-mean-median-mode-and-range-in-javascript
  * The "median" is the "middle" value in the list of numbers.
  *
  * @param {Array} numbers An array of numbers.
  * @return {Number} The calculated median value from the specified numbers.
  */
  median = function (numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    let median = 0;
    let numsLen = numbers.length;
    numbers.sort();

    if (
      numsLen % 2 ===
      0 // is even
    ) {
      // average of two middle numbers
      median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else {
      // is odd
      // middle number only
      median = numbers[(numsLen - 1) / 2];
    }

    return median;
  };

  coinFlip = function ()
  {
    return boolean(round(fxrand()));
  };

  flipACoin = function ()
  {
    return this.coinFlip();
  };

  rollADie = function (sides=6) {
    return round(map(fxrand(), 0, 1, 1, sides));
  };

  between = function(low, high) {
    console.log(noise(high , low));
    return low + ((high - low) * noise(low, high));
  }

  //https://stackoverflow.com/a/2450976
  shuffleArray = function (array) {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(fxrand() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  range = function (start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
  }

  isEven = function(number) {
    return number % 2 == 0
  }


}
