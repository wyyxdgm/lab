const imageToRgbaMatrix = require('image-to-rgba-matrix');
const moment = require('moment');
const { pad } = require('../lib/util');
// const { fromPng } = require('@rgba-image/png');
// const fs = require('fs');
// const png = fs.readFileSync('in.png')



let fs = require('fs');
let path = require('path');
const ImageModel = require('../lib/imageModel');

const _path = './input2.png';


function ri(res, i) {
  const imageModel = new ImageModel(res, i);
  const model = imageModel.analysModel();
  const tt = 'aa' || moment().format('HHmmss');
  imageModel.drawArea(path.join(__dirname, `./output-${pad(i,2)}-${tt}.png`));
  // imageModel.drawEmptyArea(path.join(__dirname, `./output-${pad(i,2)}-${tt}-empty.png`));
}

imageToRgbaMatrix(path.join(__dirname, _path)).then((res) => {
  for (let i = 1; i < 30; i++) {
    ri(res, i);
  }
  // ri(res, 11);

});