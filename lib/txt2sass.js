let fs = require('fs');
let path = require('path');
let gulp = require('gulp');
let gutil = require('gulp-util');
let CONFIG = require('../config.js');

const FIX_OPACITY = true;

COLOR_MAP = {};

// init variable data
module.exports.setColorVariable = (_path) => {
    let COLOR_CONFIG = fs.readFileSync(path.join(CONFIG.root_path, _path || 'src/css/variable.scss')).toString();
    // only scss, TODO:less
    COLOR_CONFIG = COLOR_CONFIG.split('\n');
    // 清空
    COLOR_MAP = {};
    COLOR_CONFIG.forEach(function(line, index) {
        let re = null;
        // less
        // if (line && (re = line.match(/^(\@[\w\d-_]+):\s*(RGBA?[^;]+|#[a-z0-9]+)/i))) {
        // sass
        if (line && (re = line.match(/^(\$[\w\d-_]+):\s*(RGBA?[^;]+|#[a-z0-9]+|\w+)/i))) {
            COLOR_MAP[re[2].toUpperCase()] = re[1];
        }
    });
    if (CONFIG.log_level >= 2) gutil.log('COLOR_MAP:', COLOR_MAP);
}

module.exports.setColorVariable(CONFIG.style.variable);

// replace color value by variable
const buildColor = (ctext, _COLOR_MAP = COLOR_MAP) => {
    console.log('buildColor', ctext) //rgba(0, 0, 0, 1)RGBA
    if (ctext.indexOf('rgba') >= 0) {
        let re = ctext.substring(0, ctext.indexOf('RGBA'));
        return _COLOR_MAP[re.toUpperCase()] || re;
    } else if (ctext.indexOf('hex') >= 0) {
        var cc = ctext.split(' ');
        cc[1] = parseInt(cc[1]);
        return cc[1] == 100 ? `${cc[0]}` : `fade(${cc[0]}, ${cc[1]})`
    }
}

// style object -> css code
let buildCssCodeFromStyleObj = (styleObj, className) => {
    let str = '';
    if (className) str += `.${className} {\n`;
    for (var key in styleObj) {
        if (styleObj[key].indexOf('*/') > 0) {
            str += `\t${key}: ${styleObj[key].replace('*/',';*/')}\n`;
        } else {
            str += `\t${key}: ${styleObj[key]};\n`;
        }
    }
    if (className) str += '}\n';
    return str;
}

// pc sass func
let buildPCSassCodeFromStyleObj = (styleObj, className) => {
    let str = buildCssCodeFromStyleObj(styleObj, className);
    let str2 = `${str}`;
    if (styleObj['font-size']) str2 = str2.replace(/letter-spacing:\s*([\-\.\d]+px)?/g, '@include letterspacing(' + styleObj['font-size'] + ',$1)');
    str2 = str2.replace(/line-height:\s*([\.\d]+px)/g, '@include lh($1)');
    str2 = str2.replace(/width:\s*([\.\d]+px)/g, '@include w($1)');
    str2 = str2.replace(/height:\s*([\.\d]+px)/g, '@include h($1)');
    str2 = str2.replace(/font-size:\s*([\.\d]+px)/g, '@include fs($1)');
    return str2;
}

// H5 sass func
let buildH5SassCodeForFromStyleObj = (styleObj, className) => {
    let str = buildCssCodeFromStyleObj(styleObj, className);
    let str2 = `${str}`;
    if (styleObj['font-size']) str2 = str2.replace(/letter-spacing:\s*([\-\.\d]+px)?/g, '@include letterspacing_(' + styleObj['font-size'] + ',$1)');
    str2 = str2.replace(/\/line-height:\s*([\.\d]+px)/g, '@include lh_($1)');
    str2 = str2.replace(/width:\s*([\.\d]+px)/g, '@include w_($1)');
    str2 = str2.replace(/height:\s*([\.\d]+px)/g, '@include h_($1)');
    str2 = str2.replace(/font-size:\s*([\.\d]+px)/g, '@include fs_($1)');
    str2 = str2.replace(/\s([\.\d]+px)/g, ' rem($1)');
    return str2;
}

// txt -> style object
let buildstyleObjFromStrArr = (strArr, section, totalSection) => {
    let styleObj = {};
    let re = null;
    let prop = '';
    let propType = '';
    for (var index = 0; index < strArr.length; index++) {
        var text = strArr[index];
        // gutil.log(index, text);
        if (re = /字体(\w+)/.exec(text)) {
            styleObj['font-family'] = re[1];
        } else if (re = /字重([\w-]+)/.exec(text)) {
            // TODO Medium
            styleObj['font-weight'] = re[1].indexOf('Semi Bold') >= 0 ? 600 : (re[1].indexOf('Bold') >= 0 ? 'bold' : (re[1].indexOf('Light') >= 0 ? '300' : (re[1].indexOf('Regular') >= 0 ? 'normal' : (re[1].indexOf('Medium') >= 0 ? 500 : '?'))));
            console.log('字重', text, re, re[1], styleObj['font-weight'])
        } else if (re = /(\w+)对齐/.exec(text)) {
            styleObj['text-align'] = re[1] == '左' ? 'left' : (re[1] == '右' ? 'right' : 'center');
        } else if (text == '内边框') {
            if ('粗细' === strArr[index + 1] && '颜色' === strArr[index + 3]) {
                styleObj['border'] = strArr[index + 2] + ' solid ' + buildColor(strArr[index + 4]);
                index += 4;
            } else {
                console.error('⚠️警告 内边框 未编译')
            }
        } else if (text == '颜色') {
            if (section == 0 && totalSection > 2) {
                styleObj['background-color'] = buildColor(strArr[index + 1]);
                index++;
            } else {
                styleObj['color'] = buildColor(strArr[index + 1]);
                index++;
            }
        } else if (text == '空间') { // 空间\n\n0\n字间距\n40px\n行间距
            let spacing = strArr[index + 1];
            let lineHeight = strArr[index + 3];
            index += 4;
            if (spacing != '0') styleObj['letter-spacing'] = spacing;
            styleObj['/* line-height'] = lineHeight + ' */';
        } else if (text == '字号') {
            // prop = 'font-size';
            // propType = 'font-size';
            styleObj['font-size'] = parseInt(strArr[index + 1]) + 'px';
            index++;
        }
        // else if (re = /([\.\d]+)pt/.exec(text)) {
        //   prop = parseInt(re[1]) + 'px';
        //   propType = '...';
        // } else if (propType == '...') {
        //   let p = text == '行间距' ? 'line-height' : '';
        //   if (p) styleObj[p] = prop;
        //   propType = '';
        //   prop = '';
        // }
        if (text == '外阴影' || text == '投影') {
            var x, y, b, s, c;
            if (strArr[index + 1] == 'Offset' &&
                strArr[index + 3] == 'X' &&
                strArr[index + 5] == 'Y' &&
                strArr[index + 6] == 'Effect' &&
                strArr[index + 8] == 'blur' &&
                strArr[index + 10] == 'spread' &&
                strArr[index + 11] == '颜色') {
                x = strArr[index + 2].replace('pt', 'px');
                y = strArr[index + 4].replace('pt', 'px');
                b = strArr[index + 7].replace('pt', 'px');
                s = strArr[index + 9].replace('pt', 'px');
                c = buildColor(strArr[index + 12]);
                styleObj['box-shadow'] = [x, y, b, s, c].join(' ');
                index += 12;
            } else if (strArr[index + 1] == 'Offset' &&
                strArr[index + 3] == 'X' &&
                strArr[index + 5] == 'Y' &&
                strArr[index + 6] == 'Effect' &&
                strArr[index + 8] == '大小' &&
                strArr[index + 9] == '颜色') {
                x = strArr[index + 2].replace('pt', 'px');
                y = strArr[index + 4].replace('pt', 'px');
                b = strArr[index + 7].replace('pt', 'px');
                s = '0px'.replace('pt', 'px');
                c = buildColor(strArr[index + 10]);
                styleObj['box-shadow'] = [x, y, b, s, c].join(' ');
                index += 10;
            } else if (strArr[index + 1] == 'Offset' &&
                strArr[index + 3] == '距离' &&
                strArr[index + 5] == '扩展' &&
                strArr[index + 6] == 'Effect' &&
                strArr[index + 8] == '大小' &&
                strArr[index + 9] == '角度' &&
                strArr[index + 11] == '颜色') {
                /*
                Offset    1
                3px
                距离    3
                36%
                扩展    5
                Effect    6
                8px
                大小    8
                角度    9
                90°
                颜色    11
                rgba(242, 240, 240, 0.89)RGBA
                 */
                s = parseInt(strArr[index + 2]);
                _total_size = parseInt(strArr[index + 7]);
                b = _total_size - s + 'px';
                // if (_s.indexOf('%') > 0) b = _size * parseInt(s) / 100 + 'px';
                // else b = _s.replace('pt', 'px');
                const angle = parseInt(strArr[index + 10]) / 180 * Math.PI;
                y = s * Math.cos(angle);
                x = s * Math.sin(angle);
                if (x < 1e-10) x = 0;
                if (y < 1e-10) y = 0;
                c = buildColor(strArr[index + 12]);
                y = y + 'px';
                x = x + 'px';
                s = s + 'px';
                styleObj['box-shadow'] = [x, y, b, s, c].join(' ');
                index += 12;
            }
        } else if (text == '大小') {
            var w, h;
            w = parseInt(strArr[index + 1]);
            h = parseInt(strArr[index + 2]);
            styleObj['width'] = `${w}px`;
            styleObj['height'] = `${h}px`;
            index += 2;
        } else if (re = /不透明度([\.\d]+)%/.exec(text)) {
            if (re[1] != 100) {
                styleObj['opacity'] = parseFloat(re[1] / 100).toFixed(2);
            }
        } else if (re = /圆角([\.\d]+)(px|pt)/.exec(text)) {
            styleObj['border-radius'] = `${re[1]}px`;
        }
    }
    if (FIX_OPACITY) {
        if (styleObj['opacity'] &&
            styleObj['color'] &&
            styleObj['color'].indexOf('rgb') >= 0 &&
            styleObj['color'].indexOf('1)') >= 0) {

            styleObj['color'] = styleObj['color'].replace('1)', `${styleObj['opacity']})`);
            delete styleObj['opacity'];
        }
    }
    return styleObj;
}

module.exports.buildTxtToScss = (srcPath, distPath, colorAliasMap) => {
    fs.readFile(srcPath, function(err, data) {
        if (!data || !(data = data.toString().trim())) return;
        let groupedStr = data.split(/[\n\r]{5}/);
        let str = '',
            str2 = '',
            str3 = '';
        groupedStr.forEach(function(data, index) {
            let strArr = data.split(/[\n\r]+/);
            let styleObj = buildstyleObjFromStrArr(strArr, index, groupedStr.length);
            gutil.log('style object:', styleObj);
            str += buildCssCodeFromStyleObj(styleObj, ``) + '\n';
            str2 += buildPCSassCodeFromStyleObj(styleObj, ``) + '\n';
            str3 += buildH5SassCodeForFromStyleObj(styleObj, ``) + '\n';
        });
        gutil.log('\n======================================================\n')
        gutil.log('\n' + [str, str2, str3].join('\n---------------------------\n'));
        gutil.log('\n======================================================\n')

        fs.writeFile(distPath.replace(/\.\w+$/, '.css'),
            [str, str2, str3].join('\n========================\n'),
            () => {
                gutil.log('build style success!');
            });
    });
}
