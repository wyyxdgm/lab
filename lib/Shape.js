var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');

const { AROUND_RADIUS, SHAPE_SIZE } = require('./config');
const {
  isSimilarRGBA,
  pad,
  isEqualRGBA,
  getBounds,
  imageToRgbaMatrix,
  findMaxProp,
  cloneXYChange,
  cloneXY,
  transform90
} = require('./util');

const ImageModel = require('./ImageModel');

class Shape extends ImageModel {

  constructor(data, similarValue, xywh) {
    super(data, similarValue, xywh);
    this.shapeSize = SHAPE_SIZE;
    this.color = [];
    this.positivePoints = [];
    this.negativePoints = [];
    this.centerPoint = [];
    this.angles = {};
    this.angles.TL = this;
    this.type = Shape.TYPE.TL;
    // shape有效w,h
    this.h = 0;
    this.w = 0;
    return this;
  }

  normalize() {
    const { positivePoints, negativePoints, centerPoint } = this;
    let allPoints = positivePoints.concat(negativePoints);
    let [xMin, xMax, yMin, yMax] = [1000000000000, -1, 1000000000000, -1];
    for (let i = allPoints.length - 1; i >= 0; i--) {
      if (allPoints[i][0] < xMin) xMin = allPoints[i][0];
      if (allPoints[i][1] < yMin) yMin = allPoints[i][1];
      if (allPoints[i][0] > xMax) xMax = allPoints[i][0];
      if (allPoints[i][1] > yMax) yMax = allPoints[i][1];
    }
    const [dx, dy] = [0 - xMin, 0 - yMin];
    const [h, w] = [xMax - xMin, yMax - yMin];
    // centerPoint[0] += dx; centerPoint[1] += dy; // 存的是引用，无需重复计算
    for (var i = positivePoints.length - 1; i >= 0; i--) {
      positivePoints[i][0] += dx;
      positivePoints[i][1] += dy;
    }
    for (var i = negativePoints.length - 1; i >= 0; i--) {
      negativePoints[i][0] += dx;
      negativePoints[i][1] += dy;
    }
    this.h = h + 1;
    this.w = w + 1;
    this.getBorder();
    return this;
  }
  getBorder() {
    const { negativePoints } = this;
    let lines = _.values(_.groupBy(negativePoints, ([x, y]) => x));
    // lines = lines.filter(arr => arr.length == 2 && Math.abs(arr[0].y - arr[1].y) > 1);
    let count = _.countBy(lines, ([a, b, c]) => (!c && a && b) ? Math.abs(a[1] - b[1]) : 'not2points');
    delete count['not2points'];
    console.log(count)
    let kv = findMaxProp(count);
    this.sampleWH = kv.value;
    this.borderWidth = parseInt(kv.key) - 1;
    this.borderRadius = this.centerPoint[0];
    return this;
  }

  toString() {
    let shapeMatrix = [];
    if (!this.h) this.normalize();
    const { positivePoints, negativePoints, color, centerPoint, w, h } = this;
    for (let i = 0; i < h; i++) {
      shapeMatrix[i] = [];
      for (let j = 0; j < w; j++) {
        shapeMatrix[i][j] = 0;
      }
    }
    for (let ii = positivePoints.length - 1; ii >= 0; ii--) {
      let [x, y] = positivePoints[ii];
      shapeMatrix[x][y] = 1;
    }
    for (let jj = negativePoints.length - 1; jj >= 0; jj--) {
      let [x, y] = negativePoints[jj];
      shapeMatrix[x][y] = -1;
    }
    return shapeMatrix.map(line => line.map(pn0 => pn0 == 0 ? '·' : (pn0 > 0 ? '@' : '#')).join(' ')).join('\n');

  }
  /**
   * 生成源Shape旋转90度后的shape
   * @param  {[type]} originalShape [description]
   * @return {[type]}               [description]
   */
  static getTransofrmed90(originalShape) {
    // this.data
    // this.width
    // this.height
    // this.shapeSize = SHAPE_SIZE;
    // this.color = [];
    let shape = new Shape();
    shape.positivePoints = transform90(originalShape.positivePoints, originalShape.w);
    shape.negativePoints = transform90(originalShape.negativePoints, originalShape.w);
    switch (originalShape.type) {
      case Shape.TYPE.TL:
        shape.type = Shape.TYPE.TR;
        shape.positivePoints = shape.positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x2 - x) : (y2 - y)); // x,y 同
        shape.negativePoints = shape.negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x2 - x) : (y2 - y)); // x,y 同
        break;
      case Shape.TYPE.TR:
        shape.type = Shape.TYPE.BR;
        shape.positivePoints = shape.positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y)); // 左下右上
        shape.negativePoints = shape.negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y)); // 左下右上
        break;
      case Shape.TYPE.BR:
        shape.type = Shape.TYPE.BL;
        shape.positivePoints = shape.positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x2 - x) : (y2 - y)); // x,y 同
        shape.negativePoints = shape.negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x2 - x) : (y2 - y)); // x,y 同
        break;
      case Shape.TYPE.BL:
        shape.type = Shape.TYPE.TL;
        shape.positivePoints = shape.positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y)); // 左下右上
        shape.negativePoints = shape.negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y)); // 左下右上
        break;
      default:
        shape.type = Shape.TYPE.TL;
        break;
    }
    shape.generateCenterPoint();
    shape.w = originalShape.h;
    shape.h = originalShape.w;
    shape.color = originalShape.color;
    shape.borderWidth = originalShape.borderWidth;
    shape.borderRadius = originalShape.borderRadius;
    return shape;
  }
  getTL() {
    return this;
  }
  getTR() {
    if (this.angles.TR) return this.angles.TR;
    this.angles.TR = Shape.getTransofrmed90(this);
    return this.angles.TR;
  }
  getBR() {
    if (this.angles.BR) return this.angles.BR;
    // 先拿到或生成this.angles.TR
    if (!this.angles.TR) this.getTR();
    this.angles.BR = Shape.getTransofrmed90(this.angles.TR);
    return this.angles.BR;
  }
  getBL() {
    if (this.angles.BL) return this.angles.BL;
    // 先拿到或生成this.angles.BR
    if (!this.angles.BR) this.getBR();
    this.angles.BL = Shape.getTransofrmed90(this.angles.BR);
    return this.angles.BL;
  }

  console() {
    console.log(`w=${this.w} h=${this.h} direction:${this.type} centerPoint=${this.centerPoint} borderWidth=${this.borderWidth} borderRadius=${this.borderRadius}`)
    console.log('=====================================');
    console.log(this.toString());
    console.log('=====================================');
  }

  // 获取某点周边的正点和反点
  getBetterDiffShapeAroundPoint(xy) {
    if (!xy) return this;
    const rgba00 = this.data[0][0];
    let { x, y } = xy;
    const radius = AROUND_RADIUS;
    const [xMin, xMax] = getBounds(x, radius, 0, this.data.length);
    const [yMin, yMax] = getBounds(y, radius, 0, this.data[0].length);
    // 统计[x±radius][y±radius]区域内，非rgba00颜色的其他颜色中最多的颜色
    // 这里，键：颜色值；值：存放此颜色坐标数组
    const colorCountObject = {};
    for (x = xMin; x <= xMax; x++) {
      for (y = yMin; y <= yMax; y++) {
        if (!isSimilarRGBA(this.data[x][y], rgba00)) {
          let colorKey = this.data[x][y].join(',');
          if (!colorCountObject[colorKey]) colorCountObject[colorKey] = [];
          colorCountObject[colorKey].push([x, y]);
        }
      }
    }
    let maxNum = -1;
    let maxKey = '';
    for (let colorKey in colorCountObject) {
      if (colorCountObject[colorKey].length > maxNum) {
        maxNum = colorCountObject[colorKey].length;
        maxKey = colorKey;
      }
    }
    // this.color
    this.color = maxKey.split(',');
    let positivePoints = colorCountObject[maxKey];
    let positivePointsMap = _.indexBy(positivePoints, xy => xy.join(','));
    let negativePoints = [];
    let negativePointsMap = {}; // 记录key，用于 negativePoints 去重存储
    // 搜集 negativePoints: 找出 positivePoints 周边的非同色的点，放入 negativePoints
    for (let i = positivePoints.length - 1; i >= 0; i--) {
      let [_x, _y] = positivePoints[i];
      const radius = 1;
      const [_xMin, _xMax] = getBounds(_x, radius, xMin, xMax);
      const [_yMin, _yMax] = getBounds(_y, radius, yMin, yMax);
      for (let xx = _xMin; xx <= _xMax; xx++) {
        for (let yy = _yMin; yy <= _yMax; yy++) {
          let xxyy = [xx, yy];
          let key = xxyy.join(',');
          if ((xx != x || yy != y) && !positivePointsMap[key] && !negativePointsMap[key]) {
            negativePoints.push(xxyy);
            negativePointsMap[key] = 1
          }
        }
      }
    }

    // 根据左下到右上排列，分别取50个样本(sample)
    // this.positivePoints
    this.positivePoints = positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
    if (positivePoints.length > this.shapeSize) {
      // positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
      let step = positivePoints.length / this.shapeSize;
      if (step > 1) {
        this.positivePoints = [];
        for (var i = 0; i < positivePoints.length; i++) {
          if (i / step >= this.positivePoints.length) this.positivePoints.push(positivePoints[i])
        }
      }
    }
    // this.negativePoints
    this.negativePoints = negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
    if (negativePoints.length > this.shapeSize) {
      let step = negativePoints.length / this.shapeSize;
      if (step > 1) {
        this.negativePoints = [];
        for (var i = 0; i < negativePoints.length; i++) {
          if (i / step >= this.negativePoints.length) this.negativePoints.push(negativePoints[i])
        }
      }
    }
    // this.centerPoint
    this.generateCenterPoint();

    // 对外提供sample数据方式，用于灵活控制匹配样本
    // let points = colorCountObject[maxKey];
    this.normalize();
    return this;
  }

  generateCenterPoint() {
    this.centerPoint = this.positivePoints[Math.ceil((this.positivePoints.length - 1) / 2)];
    return this.centerPoint;
  }
  // 获得tag的特殊标志，轮廓
  // 获取标签轮廓：左上角向右下角，45度斜切线平移，取最新触碰的点。再取周围的正点和反点
  getTagShape() {
    const rgba00 = this.data[0][0];
    let findPoints = [];
    for (let x = 0; x < this.data.length; x++) {
      for (let y = 0; y <= x; y++) {
        if (!isSimilarRGBA(this.data[x - y][y], rgba00)) findPoints.push({ x: x - y, y });
      }
      if (findPoints.length) break;
    }
    if (findPoints.length) {
      // 取中间的点
      while (findPoints.length > 2) {
        findPoints.pop();
        findPoints.shift();
      }
      let { x, y } = findPoints[0];
      return this.getBetterDiffShapeAroundPoint({ x, y });
      findPoints = null;
    }
    return this;
  }
  static newInstance(file, ...args) {
    return imageToRgbaMatrix(file).then((res) => {
      return new Shape(res, ...args);
    });
  }
}

Shape.TYPE = {
  TL: 'TL',
  TR: 'TR',
  BL: 'BL',
  BR: 'BR',
};

module.exports = Shape;