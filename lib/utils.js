"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterV = exports.filterKV = exports.writeFileSync = exports.readFileStr = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const readFileStr = (p) => {
    return (0, fs_1.readFileSync)(p, { encoding: 'utf-8' });
};
exports.readFileStr = readFileStr;
const writeFileSync = (d, str) => {
    if (!(0, fs_1.existsSync)((0, path_1.dirname)(d)))
        (0, fs_1.mkdirSync)((0, path_1.dirname)(d), { recursive: true });
    (0, fs_1.writeFileSync)(d, str);
};
exports.writeFileSync = writeFileSync;
const attrMap = new Map([
    ['bindtap', '@click'],
    ['wx:if', 'v-if'],
    ['wx:else', 'v-else'],
    ['wx:key', 'v-key'],
]);
function filterKV(k, v) {
    let re = null;
    if (attrMap.has(k)) { // k wx:if,wx:else,wx:key,bindtap
        k = attrMap.get(k);
    }
    else if (re = /^bind(:?)(\w+)$/.exec(k)) { // k bind*
        if (re[2])
            k = `@${re[2]}`;
    }
    else {
        // console.warn('key 未处理', k)
    }
    return filterV(k, v);
    // if (re = /^{{([^{}]+)}}$/.exec(v)) { // v
    //   return [k, re[1]]
    // } else if (re = /({{([^{}]+)}})+/.test(v)) {
    //   let strs = v.split(/({{[^{}]+}})/).filter(s => !!s);
    //   console.log(`strs------------------`, strs);
    //   v = strs.map(x => {
    //     let r = x.trim().startsWith('{{') ? x.replace(/{{(.+)}}/, '($1)') : JSON.stringify(x)
    //     console.log(`x`, x, r);
    //     return r
    //   }).join('+')
    //   if (!k.startsWith('v-') && !k.startsWith('@')) k = 'v-bind:' + k;
    //   return [k, v];
    // } else {
    //   console.warn('/???')
    //   return [k, v]
    // }
}
exports.filterKV = filterKV;
function filterV(k, v) {
    let re = null;
    if (re = /^{{([^{}]+)}}$/.exec(v)) { // v
        // console.log(`filterV`, v);
        return [k, resolveProp(re[1])];
    }
    else if (re = /({{([^{}]+)}})+/.test(v)) {
        let strs = v.split(/({{[^{}]+}})/).filter(s => !!s);
        // console.log(`strs------------------`, strs);
        v = strs.map(x => {
            let r = x.trim().startsWith('{{') ? resolveProp(x.replace(/{{(.+)}}/, '($1)')) : JSON.stringify(x);
            // console.log(`x`, x, r);
            return r;
        }).join('+');
        if (!k.startsWith('v-') && !k.startsWith('@'))
            k = 'v-bind:' + k;
        return [k, v];
    }
    else {
        // console.warn('/???')
        return [k, v];
    }
}
exports.filterV = filterV;
function resolveProp(props) {
    return props.replace(/\b([\w_\d]+(\.[\w_\d]+)+)\b/g, function (match, p1, p2, p3) {
        console.log('match', match, 'p1', p1, 'p2', p2, 'p3', p3);
        let str = '';
        let arr = match.split('.');
        return '(' + arr.slice(1).reduce((p, c) => p + '&&' + p + '.' + c, arr[0]) + ')';
    });
}
