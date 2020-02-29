const imageToRgbaMatrix = require('image-to-rgba-matrix');
var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');

const SIMILAR_VALUE = 4;
const SHAPE_SIZE = 50;
const AROUND_RADIUS = 10;
const POSITIVE_NOT_MATCH_COUNT = 8;
const NAGTIVE_MATCH_COUNT = 5;

class ImageModel {
  constructor(data, similarValue, xywh) {
    this.data = data;
    this.height = data.length;
    this.width = data[0].length;
    this.similarValue = similarValue || SIMILAR_VALUE;
    this.shapeSize = SHAPE_SIZE;

    if (xywh) {
      const [x, y, w, h] = xywh;
      this.data = this.data.slice(x, x + h).map(line => line.slice(y, y + w));
      this.width = w;
      this.height = h;
    }

    console.log(`new ImageModel=>[${this.height}x${this.width}]`, 'similar:', this.similarValue);
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
    if (_isSimilarRGBA(bgba, parentRGBA)) { // 左上角的点和父节点的颜色一致，可能：1.有border-radius+(有背景或有边框),2.本容器无背景

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
      if (!ImageModel.isSimilarRGBA(this.data[xx + x][yy + y], color)) {
        positivePointsNotMatchCount++;
      }
    }
    if (i != -1) return false;
    var negativePointsMatchCount = 0;
    for (var j = negativePoints.length - 1; j >= 0; j--) {
      let [x, y] = negativePoints[j];
      if (ImageModel.isEqualRGBA(this.data[xx + x][yy + y], color)) {
        negativePointsMatchCount++;
      }
    }
    if (negativePointsMatchCount > NAGTIVE_MATCH_COUNT) return false;
    return true;
  }


  // 获得tag的特殊标志，轮廓
  tranTag() {
    this.tagShape = ImageModel.getTagShape(this.data);
    ImageModel.getShowShape(this.tagShape);
    return this.tagShape;
  }
  static getShowShape(shape) {
    let shapeMatrix = [];
    const { positivePoints, negativePoints } = shape;
    for (let i = 0; i < 20; i++) {
      shapeMatrix[i] = [];
      for (let j = 0; j < 20; j++) {
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
    console.log('shape-> ---------------------');
    for (let line = 0; line < 20; line++) {
      console.log(shapeMatrix[line].join('\t'));
    }
    console.log('----------------------------------');
  }
  static isSimilarRGBA(rgba1, rgba2) {
    return rgba1.map((cx1, idx) => {
      let v = Math.abs(cx1 - rgba2[idx]);
      return v;
    }).reduce((a, b) => a + b) < SIMILAR_VALUE;
  }
  static isEqualRGBA(rgba1, rgba2) {
    return rgba1.map((cx1, idx) => {
      let v = Math.abs(cx1 - rgba2[idx]);
      return v;
    }).reduce((a, b) => a + b) === 0;
  }
  static getBounds(xy, radius, xyMin, xyMax) {
    return [Math.max(xy - radius, xyMin), Math.min(xy + radius, xyMax)];
  }
  // 获取某点周边的正点和反点
  static getBetterDiffShapeAroundPoint(matrix, xy) {
    const result = { color: [], positivePoints: [], negativePoints: [], centerPoint: [] };
    if (!xy) return result;
    const rgba00 = matrix[0][0];
    let { x, y } = xy;
    const radius = AROUND_RADIUS;
    const [xMin, xMax] = ImageModel.getBounds(x, radius, 0, matrix.length);
    const [yMin, yMax] = ImageModel.getBounds(y, radius, 0, matrix[0].length);
    // 统计[x±radius][y±radius]区域内，非rgba00颜色的其他颜色中最多的颜色
    // 这里，键：颜色值；值：存放此颜色坐标数组
    const colorCountObject = {};
    for (x = xMin; x <= xMax; x++) {
      for (y = yMin; y <= yMax; y++) {
        if (!ImageModel.isSimilarRGBA(matrix[x][y], rgba00)) {
          let colorKey = matrix[x][y].join(',');
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
    // result.color
    result.color = maxKey.split(',');
    let positivePoints = colorCountObject[maxKey];
    let positivePointsMap = _.indexBy(positivePoints, xy => xy.join(','));
    let negativePoints = [];
    let negativePointsMap = {}; // 记录key，用于 negativePoints 去重存储
    // 搜集 negativePoints: 找出 positivePoints 周边的非同色的点，放入 negativePoints
    for (let i = positivePoints.length - 1; i >= 0; i--) {
      let [_x, _y] = positivePoints[i];
      const radius = 1;
      const [_xMin, _xMax] = ImageModel.getBounds(_x, radius, xMin, xMax);
      const [_yMin, _yMax] = ImageModel.getBounds(_y, radius, yMin, yMax);
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
    // result.positivePoints
    result.positivePoints = positivePoints;
    if (positivePoints.length > SHAPE_SIZE) {
      positivePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
      let step = positivePoints.length / SHAPE_SIZE;
      if (step > 1) {
        result.positivePoints = [];
        for (var i = 0; i < positivePoints.length; i++) {
          if (i / step >= result.positivePoints.length) result.positivePoints.push(positivePoints[i])
        }
      }
    }
    // result.negativePoints
    result.negativePoints = negativePoints;
    if (negativePoints.length > SHAPE_SIZE) {
      negativePoints.sort(([x, y], [x2, y2]) => x !== x2 ? (x - x2) : (y2 - y));
      let step = negativePoints.length / SHAPE_SIZE;
      if (step > 1) {
        result.negativePoints = [];
        for (var i = 0; i < negativePoints.length; i++) {
          if (i / step >= result.negativePoints.length) result.negativePoints.push(negativePoints[i])
        }
      }
    }
    // result.centerPoint
    result.centerPoint = result.positivePoints[Math.ceil(result.positivePoints.length / 2)];

    // 对外提供sample数据方式，用于灵活控制匹配样本
    // let points = colorCountObject[maxKey];

    return result;
  }
  // 获取标签轮廓：左上角向右下角，45度斜切线平移，取最新触碰的点。再取周围的正点和反点
  static getTagShape(matrix) {
    let shape = { color: [], positivePoints: [], negativePoints: [], centerPoint: [] };
    let x = 0;
    let y = 0;
    let find = false;
    const rgba00 = matrix[0][0];
    for (x = 0; x < matrix.length; x++) {
      for (y = 0; y <= x; y++) {
        if (!ImageModel.isSimilarRGBA(matrix[x - y][y], rgba00)) find = true;
        if (find) break;
      }
      if (find) break;
    }
    if (find) {
      shape = ImageModel.getBetterDiffShapeAroundPoint(matrix, { x: x - y, y });
    }
    ImageModel.normalizeShape(shape);
    return shape;
  }
  static normalizeShape(shape) {
    const { positivePoints, negativePoints, centerPoint } = shape;
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
    shape.h = h;
    shape.w = w;
    return shape;
  }
  static newInstance(file) {
    return imageToRgbaMatrix(file).then((res) => {
      return new ImageModel(res);
    });
  }
}

module.exports = ImageModel;