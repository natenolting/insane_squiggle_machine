class LoadImages {
  constructor(list) {
    this.list = list;
  }

  listSquggles() {
    let list = [];
    for (var l = 0; l < this.list.length; l++) {
      switch (this.list[l]) {
        case (0):
          for (let i = 1; i <= 49; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (1):
          for (let i = 1; i <= 26; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (2):
          for (let i = 1; i <= 12; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (3):
          for (let i = 1; i <= 48; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (4):
          for (let i = 1; i <= 26; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (5):
          for (let i = 1; i <= 60; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (5):
          for (let i = 1; i <= 60; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (6):
          for (let i = 1; i <= 43; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (7):
          for (let i = 1; i <= 67; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (8):
          for (let i = 1; i <= 33; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (9):
          for (let i = 1; i <= 22; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (10):
          for (let i = 1; i <= 23; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (10):
          for (let i = 1; i <= 23; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (11):
          for (let i = 1; i <= 60; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (12):
          for (let i = 1; i <= 34; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        case (13):
          for (let i = 1; i <= 12; i++) {
            list.push(`../images/squiggles/set-${this.list[l]}/${i}.png`);
          }

          break;
        default:
          break;

      }
    }

    return list;
  };

  listStorm = function () {
    let list = [];
    for (var l = 0; l < this.list.length; l++) {
      switch (this.list[l]) {
        case (0):
          for (let i = 1; i <= 14; i++) {
            list.push(`../images/storm/cloud${i}.png`);
          }

          break;
        case (1):
          for (let i = 1; i <= 10; i++) {
            list.push(`../images/storm/lightning${i}.png`);
          }

          break;
        case (2):
          for (let i = 1; i <= 16; i++) {
            list.push(`../images/storm/raindrop${i}.png`);
          }

          break;
      }
    }

    return list;
  };

  listJellyFish = function () {
    let list = [];
    for (var l = 0; l < this.list.length; l++) {
      switch (this.list[l]) {
        case (1):
          for (let i = 1; i <= 53; i++) {
            list.push(`../images/jelly_fish/set-${this.list[l]}/${i}.png`);
          }

          break;
      }
    }

    return list;
  };
};
