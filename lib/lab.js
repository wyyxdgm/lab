const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const CONFIG = require('../config.js');
const txt2sass = require('./txt2sass');
const dom2css = require('./dom2css');

module.exports.buildTxtToScss = (srcPath, distPath, colorAliasMap) => {
    txt2sass.buildTxtToScss(srcPath, distPath, colorAliasMap);
}

module.exports.buildHtmlDomToCss = (srcPath, distPath) => {
    dom2css.buildHtmlDomToCss(srcPath, distPath);
}
