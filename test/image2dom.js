const imageToRgbaMatrix = require('image-to-rgba-matrix');
const moment = require('moment');
const { pad } = require('../lib/util');
// const { fromPng } = require('@rgba-image/png');
// const fs = require('fs');
// const png = fs.readFileSync('in.png')


const getPath = p => path.join(__dirname, p);

let fs = require('fs');
let path = require('path');
const ImageModel = require('../lib/ImageModel');

const Shape = require('../lib/Shape');
const ShapeRect = require('../lib/ShapeRect');

const input2File = getPath('./input/input2.png');
const tagFile = getPath('./input/tag.png');
const tagsFile = getPath('./input/tags.png');
const pageFile = getPath('./input/help-center@70%.png');


function ri(res, i) {
  const imageModel = new ImageModel(res, i);
  const model = imageModel.analysModel();
  imageModel.drawArea(getPath(`./output/${pad(i,2)}.png`));
  // imageModel.drawEmptyArea(path.join(__dirname, `./output-${pad(i,2)}-${tt}-empty.png`));
}

Shape.newInstance(tagFile).then(shapeModel => {
  shapeModel.getTagShape();
  shapeModel.console();
  ImageModel.newInstance(tagsFile).then(pageModel => {
    const points = pageModel.searchShape(shapeModel);
    console.log(`points matched size: ${points.length}`);
    // console.log(points);
    let shapeRects = pageModel.getReacAreaAroundPoints(points, shapeModel);
    console.log('shapeRects', shapeRects.filter(sr => sr.w > 0));
    shapeRects = shapeRects.filter(sr => sr.w > 0);
    // pageModel.sliceRectsToFile(shapeRects, getPath('./output/{name}.png'));
    pageModel.drawRectsOnSelfToFile(shapeRects, getPath('./output/all.png'));
  })
})

// imageToRgbaMatrix(tagFile).then((res) => {
//   // for (let i = 1; i < 30; i++) {
//   //   ri(res, i);
//   // }
//   ri(res, 11);

// });