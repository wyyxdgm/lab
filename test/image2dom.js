const imageToRgbaMatrix = require('image-to-rgba-matrix');
// const { fromPng } = require('@rgba-image/png');
// const fs = require('fs');
// const png = fs.readFileSync('in.png')



let fs = require('fs');
let path = require('path');
const ImageModel = require('../lib/imageModel');

const _path = './input.png';
imageToRgbaMatrix(path.join(__dirname, _path)).then((res) => {
    const imageModel = new ImageModel(res);
    const model = imageModel.analysModel();

    // console.log(model);
});