var output = require('image-output')
let fs = require('fs');
let path = require('path');
const _ = require('underscore');
_.mixin(require('underscore.deepclone'));

const {
  SIMILAR_VALUE,
  POSITIVE_NOT_MATCH_COUNT,
  NAGTIVE_MATCH_COUNT,
  LINE_MOST_MATCH_COUNT,
  DIR
} = require('./config');
const {
  isSimilarRGBA,
  pad,
  isEqualRGBA,
  getBounds,
  imageToRgbaMatrix,
  checkBounds
} = require('./util');

const ShapeRect = require('./ShapeRect');

class ImageModel {
  constructor(data, similarValue = SIMILAR_VALUE, shapeRect) {
    this.similarValue = similarValue;
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

    if (shapeRect) {
      // ↓x,→y
      const { x, y, w, h } = shapeRect;
      if (!x || !y || !w || !h) return;
      this.data = this.data.slice(x, x + h).map(line => line.slice(y, y + w));
      this.rect = shapeRect;
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.name = `${x}_${y}_${w}_${h}`;
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
    this.emptyAreaData = this.genYToBlackAreaData();
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
  genYToBlackAreaData() {
    return this.data.map((line, i) => line.map((rgba, j) => {
      return this.area[i][j] == 1 ? [0, 0, 0, 255] : [0, 0, 0, 0];
    }));
  }
  genNToBlackData() {
    return this.data.map((line, i) => line.map((rgba, j) => {
      return this.area[i][j] == -1 ? [0, 0, 0, 255] : [0, 0, 0, 0];
    }));
  }
  drawArea(file) {
    this.areaData = this.genYToBlackAreaData();
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
    const trShape = shape.getTR();
    trShape.console();
    const brShape = shape.getBR();
    brShape.console();
    const blShape = shape.getBL();
    blShape.console();
    const rects = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const [x, y] = points[i];
      if (!(x + shape.h < this.height && y + shape.w < this.width)) continue;
      const rect = this.lineToGetRect([x, y], shape);
      rects.push(rect);
    }
    return rects;
  }
  // 原图上绘制点多个矩形，写入文件
  drawRectsOnSelfToFile(rects, file) {
    // const data = _.deepClone(this.data);
    let points = [];
    for (var i = rects.length - 1; i >= 0; i--) {
      points = points.concat(rects[i].getBorderPoints());
    }
    console.log(points)
    this.drawWidthPointsToFile(file, points, [0, 0, 255, 255]);
  }
  // 原图上绘制点数组，写入文件
  drawWidthPointsToFile(file, points, color) {
    const data = _.deepClone(this.data);
    for (var i = points.length - 1; i >= 0; i--) {
      const [x, y] = points[i];
      data[x][y] = color;
    }
    output({
      data: _.flatten(data),
      width: this.width,
      height: this.height
    }, file);
    console.log(`drawDataToFile ${this.name||''} ${file}`);
  }
  static drawDataToFile(file, data) {
    output({
      data: _.flatten(data),
      width: data[0].length,
      height: data.length
    }, file);
    console.log(`drawDataToFile ${this.name||''} ${file}`);
  }
  captureRectImage(rect) {
    return new ImageModel(this.data, SIMILAR_VALUE, rect);
  }
  sliceRectToFile(rect, file) {
    const imageModel = this.captureRectImage(rect);
    imageModel.drawToFile(file.replace('{name}', imageModel.name));
  }
  sliceRectsToFile(rects, file) {
    rects.forEach(rect => {
      this.sliceRectToFile(rect, file);
    })
  }
  drawToFile(file) {
    output({
      data: _.flatten(this.data),
      width: this.width,
      height: this.height
    }, file);
    console.log(`drawToFile ${this.name||''} ${file}`);
  }
  joinToGetMostMatchedRect([x, y], shape, rLikes, bLikes) {
    const shapeRect = new ShapeRect();
    const brShape = shape.getBR();
    for (var i = rLikes.length - 1; i >= 0; i--) {
      const [tx, ty] = rLikes[i];
      for (var i = bLikes.length - 1; i >= 0; i--) {
        const [lx, ly] = bLikes[i];
        if (this.checkShapeAt(brShape, lx, ty, { similarValue: 8, positive_not_match_count: 3, nagtive_match_count: 3 })) {
          // 找到直接返回，看效果，不行优化。
          shapeRect.tl = { p: [x, y], shape: shape.getTL() };
          shapeRect.tr = { p: [x, ty], shape: shape.getTR() };
          shapeRect.bl = { p: [tx, y], shape: shape.getBL() };
          shapeRect.br = { p: [lx, ty], shape: shape.getBR() };
          // 含border的x,y,w,h
          shapeRect.x = x;
          shapeRect.y = y;
          shapeRect.w = ty - y + shape.w;
          shapeRect.h = lx - x + shape.h;
          return shapeRect;
        }
      }
    }
    return shapeRect;
  }
  // 可以顺时针多次调用，闭环为止否则失败处理
  lineToGetRect([x, y], shape) {
    // 1.向右，统计概率，获取前3方案
    // 2.向下，统计概率，获取前3方案
    // 3.右+下,确定右下位置，计算一个概率 9个方案，并计算综合概率
    // 获取3的最大综合概率即为答案
    const rLikes = this.lineTo([x, y], shape, DIR.R);
    const bLikes = this.lineTo([x, y], shape, DIR.B);
    const rect = this.joinToGetMostMatchedRect([x, y], shape, rLikes, bLikes);
    return rect;
    // while (checkShapeAt(shape, x, y)) { y++ };
  }
  lineTo([x, y], shape, dir) {
    let countAddFunc, searchedShape;
    const [dx, dy] = shape.centerPoint;
    let errors = 0;
    let likes = [];
    let [forX, forY] = [dx + x, dy + y];
    switch (dir) {
      case DIR.R:
        countAddFunc = () => {
          y++;
          // forX = dx + x;
          forY = dy + y;
        }
        searchedShape = shape.getTR();
        break;
      case DIR.B:
        countAddFunc = () => {
          x++;
          forX = dx + x;
          // forY = dy + y;
        }
        searchedShape = shape.getBL();
        break;
      default:
        // statements_def
        break;
    }

    while (!(errors > shape.borderRadius + shape.borderWidth) && checkBounds(forX, forY, this.width, this.height)) {
      if (isEqualRGBA(shape.color, this.data[forX][forY])) {
        // this.sliceRectToFile(new ShapeRect([x, y, searchedShape.w, searchedShape.h]), path.join(__dirname, `../test/output/{name}.png`));
        if (this.checkShapeAt(searchedShape, x, y, { similarValue: 8, positive_not_match_count: 7, nagtive_match_count: 7 })) {
          likes.push([x, y]);
        }
      } else {
        errors++;
      }
      countAddFunc();
    }
    if (likes.length > LINE_MOST_MATCH_COUNT) {
      // 筛选
      console.log(`${likes.length} likes. TODO filter the mosts`)
    }
    return likes;
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

  checkShapeAt(shape, xx, yy, config) {
    let similarValue, positive_not_match_count, nagtive_match_count;
    if (config) {
      similarValue = config.similarValue, positive_not_match_count = config.positive_not_match_count, nagtive_match_count = config.nagtive_match_count;
    }
    const { color, positivePoints, negativePoints, centerPoint } = shape;
    let positivePointsNotMatchCount = 0;
    for (var i = positivePoints.length - 1; i >= 0; i--) {
      let [x, y] = positivePoints[i];
      if (positivePointsNotMatchCount > (positive_not_match_count || POSITIVE_NOT_MATCH_COUNT)) return false;
      if (!(xx + x < this.h && yy + y < this.w)) continue;
      if (!isSimilarRGBA(this.data[xx + x][yy + y], color, similarValue)) {
        positivePointsNotMatchCount++;
      }
    }
    var negativePointsMatchCount = 0;
    for (var j = negativePoints.length - 1; j >= 0; j--) {
      let [x, y] = negativePoints[j];
      if (!(xx + x < this.h && yy + y < this.w)) continue;
      if (isSimilarRGBA(this.data[xx + x][yy + y], color, similarValue || 0)) {
        negativePointsMatchCount++;
      }
    }
    if (negativePointsMatchCount > (nagtive_match_count || NAGTIVE_MATCH_COUNT)) return false;
    return true;
  }

  static newInstance(file, ...args) {
    return imageToRgbaMatrix(file).then((res) => {
      return new ImageModel(res, ...args);
    });
  }
}

module.exports = ImageModel;