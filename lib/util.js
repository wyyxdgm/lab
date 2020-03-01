const { SIMILAR_VALUE } = require('./config');

const pad = function(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

const isSimilarRGBA = (rgba1, rgba2, similarValue = SIMILAR_VALUE) => {
  return rgba1.map((cx1, idx) => {
    let v = Math.abs(cx1 - rgba2[idx]);
    return v;
  }).reduce((a, b) => a + b) < similarValue;
}

const isEqualRGBA = (rgba1, rgba2) => {
  return rgba1.map((cx1, idx) => {
    let v = Math.abs(cx1 - rgba2[idx]);
    return v;
  }).reduce((a, b) => a + b) === 0;
}

const getBounds = (xy, radius, xyMin, xyMax) => {
  return [Math.max(xy - radius, xyMin), Math.min(xy + radius, xyMax)];
}

const imageToRgbaMatrix = require('image-to-rgba-matrix');

module.exports = {
  pad,
  isSimilarRGBA,
  isEqualRGBA,
  getBounds,
  imageToRgbaMatrix
}