const parse5 = require('parse5');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const htmlString = fs.readFileSync(path.join(__dirname, '../src/dom.html')).toString();
const htmlDom = parse5.parse(htmlString);
const cssBeautify = require('js-beautify').css;


let obj = {
    "nodeName": "html",
    "tagName": "html",
    "attrs": [],
    "namespaceURI": "http://www.w3.org/1999/xhtml",
    "childNodes": [{
        "nodeName": "body",
        "tagName": "body",
        "attrs": [],
        "namespaceURI": "http://www.w3.org/1999/xhtml",
        "childNodes": [{
            "nodeName": "div",
            "tagName": "div",
            "attrs": [{
                "name": "class",
                "value": "trending-grid"
            }]
        }]
    }]
}

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

const stringify = (obj) => {
    // 声明cache变量，便于匹配是否有循环引用的情况
    let cache = [];
    let str = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // 移除
                return;
            }
            // 收集所有的值
            cache.push(value);
        }
        return value;
    }, ' ');
    cache = null; // 清空变量，便于垃圾回收机制回收
    return str;
}
console.log(stringify(htmlDom));
console.log('--------------------------');
console.log(htmlDom)
console.log('--------------------------');
console.log(obj2css(htmlDom));

console.log('--------------------------');
console.log(cssBeautify(obj2css(htmlDom)));
