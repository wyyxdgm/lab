const { SIMILAR_VALUE } = require('./config');
const path = require('path');

const pad = function(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}
// 初始化 [0,h][0,w]的0矩阵
const initMatrix0 = (h, w) => {
  const m = [];
  for (let i = 0; i < h; i++) {
    m[i] = [];
    for (let j = 0; j < w; j++) {
      m[i][j] = 0;
    }
  }
  return m;
}
const randomColor = (opacity = 255) => {
  return [255, 255, 255, 255].map((c, i) => i == 3 ? opacity : Math.floor(Math.random() * c));
}
const getAntiColor = (color) => color.map((c, i) => i == 3 ? 255 : 255 - c);
const isSimilarRGBA = (rgba1, rgba2, similarValue = SIMILAR_VALUE) => {
  return rgba1.map((cx1, idx) => {
    let v = Math.abs(cx1 - rgba2[idx]);
    return v;
  }).reduce((a, b) => a + b) < similarValue;
}

const isEqualRGBA = (rgba1, rgba2) => {
  for (let i = rgba1.length - 1; i > -1; i--) {
    if (rgba1[i] !== rgba2[i]) return false;
  }
  return true;
  // return rgba1.map((cx1, idx) => {
  //   let v = Math.abs(cx1 - rgba2[idx]);
  //   return v;
  // }).reduce((a, b) => a + b) === 0;
}

const getBounds = (xy, radius, xyMin, xyMax) => {
  return [Math.max(xy - radius, xyMin), Math.min(xy + radius, xyMax)];
}

const checkBounds = (x, y, w, h) => {
  return x >= 0 && x < h && y >= 0 && y < w;
}

const findMaxProp = (obj) => {
  let key = '';
  let value = 0;
  for (let k in obj) {
    if (obj[k] > value) {
      value = obj[k];
      key = k;
    }
  }
  return { key, value };
}

const cloneXYChange = (arr, maxXY) => {
  let arr2 = [];
  if (maxXY) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i][1] <= maxXY && arr[i][0] <= maxXY) arr2.push([arr[i][1], arr[i][0]]);
    }
  } else {
    for (let i = arr.length - 1; i >= 0; i--) {
      arr2.push([arr[i][1], arr[i][0]]);
    }
  }
  return arr2;
}

const transform90 = (arr, size) => {
  const last = size - 1;
  let arr2 = [];
  if (size) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i][1] < size && arr[i][0] < size) arr2.push([arr[i][1], last - arr[i][0]]);
    }
  } else {
    for (let i = arr.length - 1; i >= 0; i--) {
      arr2.push([arr[i][1], last - arr[i][0]]);
    }
  }
  return arr2;
}

const cloneXY = (arr, maxXY) => {
  let arr2 = [];
  if (maxXY) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i][1] <= maxXY && arr[i][0] <= maxXY) arr2.push([arr[i][0], arr[i][1]]);
    }
  } else {
    for (let i = arr.length - 1; i >= 0; i--) {
      arr2.push([arr[i][0], arr[i][1]]);
    }
  }
  return arr2;
}

const imageToRgbaMatrix = require('image-to-rgba-matrix');

const fixPath = (p) => path.join(__dirname, '../', p);

module.exports = {
  fixPath,
  randomColor,
  initMatrix0,
  pad,
  isSimilarRGBA,
  isEqualRGBA,
  getBounds,
  checkBounds,
  findMaxProp,
  imageToRgbaMatrix,
  cloneXYChange,
  cloneXY,
  transform90
}