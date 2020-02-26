// const imageToRgbaMatrix = require('image-to-rgba-matrix');
var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');

const SIMILAR_VALUE = 4;

class ImageModel {
  constructor(data, similarValue, xywh) {
    this.data = data;
    this.height = data.length;
    this.width = data[0].length;
    this.similarValue = similarValue;

    if (xywh) {
      const [x, y, w, h] = xywh;
      this.data = this.data.slice(x, x + h).map(line => line.slice(y, y + w));
      this.width = w;
      this.height = h;
    }

    console.log(this.height, this.width, similarValue);
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
  analysModel(i = 0, j = 0) {
    this.area = this._initArray(this.height, this.width);
    this._drawSimilarArea(i, j);
    // this._getEmptyArea();
    return this.area;
  }
  _getEmptyArea() {
    let x = 0;
    let h = 0;
    const emptyArea = [];
    for (let line = 0; line < this.height; line++) {
      const lineArray = this.area[line];
      let isAllBlack = true;
      for (let w = 0; w < this.width; w++) {
        if (lineArray[w] !== 1) {
          isAllBlack = false;
          break;
        }
      }
      if (isAllBlack) {
        if (h) {
          emptyArea.push({ x, h });
          h = 0;
          x = 0;
        }
      } else {
        if (!x) {
          x = line;
          h = 0;
        } else {
          h++;
        }
      }
    }
    this.emptyArea = emptyArea;
    // console.log(matrixs);

    // drawEmptyArea()
  }

  drawEmptyArea(file) {
    this.emptyAreaData = this.genAreaData();
    for (let e = 0; e < this.emptyArea.length; e++) {
      for (let i = this.emptyArea[e].x; i < this.emptyArea[e].x + this.emptyArea[e].h; i++) {
        for (let w = 0; w < 10; w++) {
          this.emptyAreaData[i][w] = [255, 0, 0, 255];
        }
      }
    }
    output({
      data: _.flatten(this.emptyAreaData),
      width: this.width,
      height: this.height
    }, file);
    console.log(`emptyAreaData ${file}`);
  }
  genAreaData() {
    return this.data.map((line, i) => line.map((rgba, j) => {
      return this.area[i][j] == 1 ? [0, 0, 0, 255] : [0, 0, 0, 0];
    }));
  }
  genAreaBorderData() {
    return this.data.map((line, i) => line.map((rgba, j) => {
      return this.area[i][j] == -1 ? [0, 0, 0, 255] : [0, 0, 0, 0];
    }));
  }
  drawArea(file) {
    this.areaData = this.genAreaData();
    output({
      data: _.flatten(this.areaData),
      width: this.width,
      height: this.height
    }, file);
    console.log(`drawArea ${file}`);
  }
  _drawSimilarArea(__x, __y) {
    // if (this.area[x][y] === -1) return;
    // console.log('current', __x, __y);
    // 当前 rgba
    const stack = [
      [__x, __y]
    ];
    let item = null;
    while (item = stack.pop()) {
      const [x, y] = item;
      const [r, g, b, a] = this.data[x][y];
      // 周围4点
      const points = [
        [x - 1, y], // 上
        [x + 1, y], // 下
        [x, y - 1], // 左
        [x, y + 1], // 右
      ].filter(([_x, _y]) => (_x >= 0 && _x < this.height && _y >= 0 && _y < this.width && this.area[_x][_y] === 0));
      // 设置 -1
      points.forEach(([_x, _y]) => {
        // -1 是分类边界，1 已经处理过
        // if (this.area[_x][_y] !== 0) return;
        // 未处理的点
        const [_r, _g, _b, _a] = this.data[_x][_y];
        if (this._isSimilar(r, g, b, _r, _g, _b)) {
          this.area[_x][_y] = 1;
          stack.push([_x, _y]);
        } else {
          this.area[_x][_y] = -1;
        }
      });
      // points.forEach(([_x, _y]) => {
      //   if (this.area[_x][_y] === 1) {
      //     stack.push([_x, _y]);
      //   }
      // })
    }


    // this._drawSimilarArea(_x, _y);

    // for (let line = 0; line < imageModel.height; line++) {
    //   const lineArray = imageModel.data[line];
    //   for (let line = 0; line < imageModel.height; line++) {
    //     const lineArray = imageModel.data[line];
    //   }
    // }
  }

  _isSimilar(r1, g1, b1, _r, _g, _b) {
    return Math.abs(r1 - _r) + Math.abs(g1 - _g) + Math.abs(b1 - _b) < (this.similarValue || SIMILAR_VALUE);
  }
}

module.exports = ImageModel;