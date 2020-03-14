const imageToRgbaMatrix = require('image-to-rgba-matrix');
const moment = require('moment');
// const util = require('../lib/util');
const { pad, fixPath } = require('../lib/util');
// const { fromPng } = require('@rgba-image/png');
// const fs = require('fs');
// const png = fs.readFileSync('in.png')


let fs = require('fs');
let path = require('path');
const ImageModel = require('../lib/ImageModel');

const Shape = require('../lib/Shape');
const ShapeRect = require('../lib/ShapeRect');

const input2File = fixPath('test/input/input2.png');
const tagFile = fixPath('test/input/tag.png');
const tagsFile = fixPath('test/input/tags.png');
const pageFile = fixPath('test/input/help-center@70%.png');


function ri(res, i) {
  const imageModel = new ImageModel(res, i);
  const model = imageModel.analysModel();
  imageModel.drawArea(fixPath(`test/output/${pad(i,2)}.png`));
  // imageModel.drawEmptyArea(path.join(__dirname, `./output-${pad(i,2)}-${tt}-empty.png`));
}

Shape.newInstance(tagFile).then(shapeModel => {
  shapeModel.getTagShape();
  shapeModel.console();
  ImageModel.newInstance(tagsFile).then(pageModel => {
    const points = pageModel.searchShape(shapeModel);
    console.log(`points matched size: ${points.length}`);
    console.log(points);
    let shapeRects = pageModel.getReacAreaAroundPoints(points, shapeModel);
    console.log('shapeRects', shapeRects.filter(sr => sr.w > 0));
    shapeRects = shapeRects.filter(sr => sr.w > 0);
    pageModel.sliceRectsToFile(shapeRects, fixPath('test/output/{name}.png'));
    pageModel.drawRectsOnSelfToFile(shapeRects, fixPath('test/output/all.png'));
  })
})

// imageToRgbaMatrix(tagFile).then((res) => {
//   // for (let i = 1; i < 30; i++) {
//   //   ri(res, i);
//   // }
//   ri(res, 11);

// });