const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const gutil = require("gulp-util");
const CONFIG = require("../config.js");
const txt2sass = require("./txt2sass");
const txt2less = require("./txt2less");
const dom2css = require("./dom2css");
const xmlTranform = require("./xmlTranform");
const wxssToless = require('./wxssToless')

module.exports.buildTxtToScss = (srcPath, distPath, colorAliasMap) => {
  txt2sass.buildTxtToScss(srcPath, distPath, colorAliasMap);
};

module.exports.buildTxtToLess = (srcPath, distPath, colorAliasMap) => {
  txt2less.buildTxtToLess(srcPath, distPath, colorAliasMap);
};

module.exports.updateVariableCache = (srcPath, distPath) => {
  txt2sass.setColorVariable(srcPath);
};

module.exports.toH5 = (srcPath, distPath) => {
  txt2sass.toH5(srcPath, distPath);
};

module.exports.buildHtmlDomToCss = (srcPath, distPath) => {
  dom2css.buildHtmlDomToCss(srcPath, distPath, CONFIG.DOM_TO_CSS_TYPE);
};

module.exports.miniprogramToVue = (srcPath, distPath) => {
  if (process.argv.indexOf("-d") > -1) {
    delete require.cache[require.resolve("./xmlTranform.js")];
    delete require.cache[require.resolve("./utils.js")];
    require("./xmlTranform.js").miniprogramToVue(srcPath, distPath);
  } else {
    xmlTranform.miniprogramToVue(srcPath, distPath);
  }
};

module.exports.wxssToless = (srcPath, distPath) => {
  if (process.argv.indexOf("-d") > -1) {
    delete require.cache[require.resolve("./wxssToless.js")];
    require("./wxssToless.js").rpx2less(srcPath, distPath);
  } else {
    wxssToless.rpx2less(srcPath, distPath);
  }
};

