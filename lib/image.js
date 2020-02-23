const imageToRgbaMatrix = require('image-to-rgba-matrix');
const R = 0;
const G = 1;
const B = 2;
const A = 3;

let fs = require('fs');
let path = require('path');

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function randomPoints(rgbMatrix, n = 30) {
  let points = [];
  let h = rgbMatrix.length;
  let w = rgbMatrix[0].length;
  for (let i = 0; i < h * w; i++) {
    let y = parseInt(i / w);
    let x = parseInt(i % w);
    if (rgbMatrix[y][x][A] === 255) {
      points.push({ i: i, y, x, rgba: rgbMatrix[y][x] });
    }
  }
  points = getRandomArrayElements(points, n).filter(p => !!p);
  return points;
}

function getH(res) {
  return res.length;
}

function getW(res) {
  return res[0].length;
}

function labelImagebyRandom(path, fn, n) {
  imageToRgbaMatrix(path).then((res) => {
    let h = res.length;
    let w = res[0].length;
    fn({ path, h, w, points: randomPoints(res, n || 30) });
  });
}

function getImageWH(path, fn) {
  imageToRgbaMatrix(path).then((res) => {
    fn({
      h: res.length,
      w: res[0].length,
    })
  })
}

function getSimilarRate(bgData, y, x, points) {
  // 点差和
  return points.map(p => {
      // rgb和
      return [R, G, B].map((i) => Math.abs(bgData[y + p.y][x + p.x][i] - p.rgba[i])).reduce((a, b) => a + b)
    })
    .reduce((a, b) => a + b, 0);
}

function getMostPoint(bgData, res) {
  let maxh = bgData.length - res.h;
  let maxw = bgData[0].length - res.w;
  let mostPoint = [0, 0, Infinity];
  for (let y = 0; y < maxh; y++) {
    for (let x = 0; x < maxw; x++) {
      let r = getSimilarRate(bgData, y, x, res.points);
      // console.log(r);
      if (r < mostPoint[2]) { mostPoint = [y, x, r]; }
    }
  }
  return { y: mostPoint[0], x: mostPoint[1], w: res.w, h: res.h, disparity: mostPoint[2] }
}


function checkFile(filePath, bgData, cb) {
  labelImagebyRandom(filePath, res => {
    // console.log(res);
    let maxh = bgData.length - res.h;
    let maxw = bgData[0].length - res.w;
    let mostPoint = [0, 0, Infinity];
    for (let y = 0; y < maxh; y++) {
      for (let x = 0; x < maxw; x++) {
        let r = getSimilarRate(bgData, y, x, res.points);
        // console.log(r);
        if (r < mostPoint[2]) { mostPoint = [y, x, r]; }
      }
    }
    // console.log('re', mostPoint);
    cb && cb({ path: res.path, y: mostPoint[0], x: mostPoint[1], w: res.w, h: res.h })
  });
}

function checkFilePromise(filePath, bgData) {
  return new Promise((resolve, reject) => {
    checkFile(filePath, bgData, resolve);
  })
}

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  // console.log(files);
  files.forEach((item, index) => {
    console.log(item)
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else {
      if (item.indexOf('.png') < 0 && item.indexOf('.jpg') < 0 && item.indexOf('.jpeg') < 0) return;
      filesList.push(fullPath);
    }
  });
  return filesList;
}


let filterFile = (fname) => fname.match(/\.png|jpg|jpeg$/);
const rootPath = path.join(__dirname, '../');

function readFileRelativeList(dir, relativePath = rootPath, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileRelativeList(path.join(dir, item), relativePath, filesList); //递归读取文件
    } else {
      if (filterFile(fullPath)) filesList.push(path.relative(relativePath, fullPath));
    }
  });
  return filesList;
}


function checkPath(dir, bgData) {
  var fs = require('fs');
  var path = require('path');
  var exec = require('child_process').exec;

  function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    // console.log(files);
    let ps = [];
    files.forEach((item, index) => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFileList(path.join(dir, item), filesList); //递归读取文件
      } else {
        if (item.indexOf('.png') < 0 && item.indexOf('.jpg') < 0 && item.indexOf('.jpeg') < 0) return;
        filesList.push(fullPath);
        ps.push(checkFilePromise(fullPath, bgData));
      }
    });
    Promise.all(ps).then(res => {
      console.log(res.sort((a, b) => a.path > b.path));
    })
    return filesList;
  }
  var filesList = [];
  readFileList(dir, filesList);
  // console.log(filesList);
}


module.exports = {
  getRandomArrayElements,
  labelImagebyRandom,
  randomPoints,
  getImageWH,
  getSimilarRate,
  getMostPoint,
  checkFile,
  checkFilePromise,
  readFileList,
  readFileRelativeList,
  checkPath,
  readFileList,
}