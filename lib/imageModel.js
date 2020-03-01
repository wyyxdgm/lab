var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');

const { SIMILAR_VALUE, POSITIVE_NOT_MATCH_COUNT, NAGTIVE_MATCH_COUNT } = require('./config');
const { isSimilarRGBA, pad, isEqualRGBA, getBounds, imageToRgbaMatrix } = require('./util');

class ImageModel {
  constructor(data, similarValue, xywh) {
    this.similarValue = similarValue || SIMILAR_VALUE;
    if (!data) {
      this.data = [];
      this.height = 0;
      this.width = 0;
      return this;
    }
    this.data = data;
    this.height = data.length;
    this.width = data[0].length;
    this.similarValue = similarValue || SIMILAR_VALUE;

    if (xywh) {
      const [x, y, w, h] = xywh;
      this.data = this.data.slice(x, x + h).map(line => line.slice(y, y + w));
      this.width = w;
      this.height = h;
    }

    console.log(`new ImageModel([${this.height}x${this.width}])-similar:${this.similarValue}`);
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
    return this.findAllRectTag();
    // return this._drawSimilarArea(0, 0);
    // this._getEmptyArea();
  }
  findAllRectTag() {

  }
  /**
   * 从某点起，绘制相似点为1,非相似点-1
   * @param  {[type]} __x [description]
   * @param  {[type]} __y [description]
   * @return {[type]}     [description]
   */
  _drawSimilarArea(__x, __y) {
    this.area = this._initArray(this.height, this.width);
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
    }
    return this.area;
  }
  /**
   * 获取矩形区域中的div分块
   * @param  RectangleObject rectObj {x,y,w,h}
   * @return {[type]}         [description]
   */
  getLineBlocks(rectObj, parentRGBA) {
    let { x, y, w, h } = rectObj;
    let bgba = this.data[x][y];
    if (isSimilarRGBA(bgba, parentRGBA)) { // 左上角的点和父节点的颜色一致，可能：1.有border-radius+(有背景或有边框),2.本容器无背景

    } else { // 左上角颜色不一致，可能：1.本容器有背景，2.本容器有边框（上，左）

    }
    const lineBlocks = [];
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
          lineBlocks.push({ x, h });
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
    this.lineBlocks = lineBlocks;
    return this.lineBlocks;
  }
  /**
   * 找出area中，含有与非相似点的行
   * @return [Object] 结构[{x,h},{x,h}]
   */
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
    return this.emptyArea;
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

  _isSimilar(r1, g1, b1, _r, _g, _b) {
    return Math.abs(r1 - _r) + Math.abs(g1 - _g) + Math.abs(b1 - _b) < this.similarValue;
  }

  getReacAreaAroundPoints(points, shape) {
    const trShape = shape.transformTopRright();
    trShape.console();
    const brShape = shape.transformBottomRight();
    brShape.console();
    const blShape = shape.transformBottomLeft();
    blShape.console();
    for (let i = points.length - 1; i >= 0; i--) {
      const [x, y] = points[i];
      const rect = this.lineToGetRect([x, y], shape);
    }

  }
  // 可以顺时针多次调用，闭环为止否则失败处理
  lineToGetRect([x, y], shape) {
    // while (checkShapeAt(shape, x, y)) { y++ };
  }

  searchShape(shape) {
    let points = [];
    for (var i = this.data.length - shape.h - 1; i >= 0; i--) {
      for (var j = this.data[i].length - shape.w - 1; j >= 0; j--) {
        if (this.checkShapeAt(shape, i, j)) {
          points.push([i, j]);
        }
      }
    }
    return points;
  }

  checkShapeAt(shape, xx, yy) {
    const { color, positivePoints, negativePoints, centerPoint } = shape;
    let positivePointsNotMatchCount = 0;
    for (var i = positivePoints.length - 1; i >= 0; i--) {
      let [x, y] = positivePoints[i];
      if (positivePointsNotMatchCount > POSITIVE_NOT_MATCH_COUNT) break;
      if (!isSimilarRGBA(this.data[xx + x][yy + y], color)) {
        positivePointsNotMatchCount++;
      }
    }
    if (i != -1) return false;
    var negativePointsMatchCount = 0;
    for (var j = negativePoints.length - 1; j >= 0; j--) {
      let [x, y] = negativePoints[j];
      if (isEqualRGBA(this.data[xx + x][yy + y], color)) {
        negativePointsMatchCount++;
      }
    }
    if (negativePointsMatchCount > NAGTIVE_MATCH_COUNT) return false;
    return true;
  }

  static newInstance(file, ...args) {
    return imageToRgbaMatrix(file).then((res) => {
      return new ImageModel(res, ...args);
    });
  }
}

module.exports = ImageModel;