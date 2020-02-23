// const imageToRgbaMatrix = require('image-to-rgba-matrix');

let fs = require('fs');
let path = require('path');

const SIMILAR_VALUE = 30;

class ImageModel {
  constructor(data) {
    this.data = data;
    this.height = data.length;
    this.width = data[0].length;

  }
  _initArray(h, w) {
    const m = [];
    for (let i = 0; i < h; i++) {
      m[i] = [];
      for (let j = 0; j < w; j++) {
        m[i][j] = 0;
      }
    }
    return m;
  }
  analysModel() {
    this.area = this._initArray(this.height, this.width);
    this._drawSimilarArea(0, 0);
  }
  _drawSimilarArea(x, y) {
    if (this.area[x][y] === -1) return;
    // 设置当前为 1
    this.area[x][y] = 1;
    const [r, g, b, a] = this.data[x][y];
    const points = [
      [x - 1, y], // 上
      [x + 1, y], // 下
      [x, y - 1], // 左
      [x, y + 1], // 右
    ].filter(([_x, _y]) => (_x >= 0 && _x < this.height && _y >= 0 && _y < this.width));
    // 设置 -1
    points.forEach(([_x, _y]) => {
      const [_r, _g, _b, _a] = this.data[_x][_y];
      if (this._isSimilar(r, g, b, _r, _g, _b)) this._drawSimilarArea(_x, _y);
    });

    // for (let line = 0; line < imageModel.height; line++) {
    //   const lineArray = imageModel.data[line];
    //   for (let line = 0; line < imageModel.height; line++) {
    //     const lineArray = imageModel.data[line];
    //   }
    // }
  }

  _isSimilar(r1, g1, b1, _r, _g, _b) {
    return Math.abs(r1 - _r) + Math.abs(g1 - _g) + Math.abs(b1 - _b) < SIMILAR_VALUE;
  }
}

module.exports = ImageModel;