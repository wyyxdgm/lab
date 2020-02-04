const parse5 = require('parse5');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const _ = require('underscore');
const cssBeautify = require('js-beautify').css;

const CONFIG = require('../config.js');


// const htmlString = fs.readFileSync(path.join(__dirname, '../src/dom.html')).toString();

const obj2css = (el) => {
    const classAttr = _.find(el.attrs, attr => attr.name === 'class');
    const className = classAttr ? classAttr.value : '';
    const tagName = el.tagName;
    let identify = tagName;
    if (className) {
        const cIdentify = className.split(/\s+/).map(c => `.${c}`).join('');
        if (['i', 'img', 'canvas', 'ul', 'li', 'a'].indexOf(tagName) >= 0) {
            identify = tagName + cIdentify;
        } else {
            identify = cIdentify;
        }
    }
    // console.log(tagName, className)
    let cssCode = '';
    if (tagName) {
        cssCode += `${identify} { `;
        if (el.childNodes) {
            cssCode += el.childNodes.map(item => obj2css(item)).join('\n');
        }
        cssCode += ` }`;
    } else if (el.nodeName === "#document") {
        // document
        const htmlDom = _.find(el.childNodes, el => el.tagName === 'html');
        const bodyDom = _.find(htmlDom.childNodes, el => el.tagName === 'body');
        return bodyDom.childNodes.map(item => obj2css(item)).join('\n');
    }
    return cssCode;
}

const buildHtmlDomToCss = (srcPath, distPath) => {
    fs.readFile(srcPath, function(err, data) {
        const dom = parse5.parse(data.toString());
        const cssCode = cssBeautify(obj2css(dom));
        gutil.log('\n======================================================\n')
        fs.writeFile(distPath, cssCode, () => {
            gutil.log('build html dom css success!');
        });
    });
}


module.exports.buildHtmlDomToCss = buildHtmlDomToCss;
