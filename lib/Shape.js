var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');

const { AROUND_RADIUS, SHAPE_SIZE } = require('./config');
const { isSimilarRGBA, pad, isEqualRGBA, getBounds, imageToRgbaMatrix, findMaxProp } = require('./util');

const ImageModel = require('./ImageModel');

class Shape extends ImageModel {
  constructor(data, similarValue, xywh) {
    super(data, similarValue, xywh);
    this.shapeSize = SHAPE_SIZE;
    this.color = [];
    this.positivePoints = [];
    this.negativePoints = [];
    this.centerPoint = [];
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
  console() {
    console.log(`w:${this.w} h:${this.h} centerPoint:${this.centerPoint} borderWidth:${this.borderWidth} borderRadius:${this.borderRadius}`)
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
    if (positivePoints.length > SHAPE_SIZE) {
      // positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
      let step = positivePoints.length / SHAPE_SIZE;
      if (step > 1) {
        this.positivePoints = [];
        for (var i = 0; i < positivePoints.length; i++) {
          if (i / step >= this.positivePoints.length) this.positivePoints.push(positivePoints[i])
        }
      }
    }
    // this.negativePoints
    this.negativePoints = negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
    if (negativePoints.length > SHAPE_SIZE) {
      let step = negativePoints.length / SHAPE_SIZE;
      if (step > 1) {
        this.negativePoints = [];
        for (var i = 0; i < negativePoints.length; i++) {
          if (i / step >= this.negativePoints.length) this.negativePoints.push(negativePoints[i])
        }
      }
    }
    // this.centerPoint
    this.centerPoint = this.positivePoints[Math.ceil((this.positivePoints.length - 1) / 2)];

    // 对外提供sample数据方式，用于灵活控制匹配样本
    // let points = colorCountObject[maxKey];
    this.normalize();
    return this;
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

module.exports = Shape;