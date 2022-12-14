"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.miniprogramToVue = void 0;
const wxml = __importStar(require("wxml"));
const utils_1 = require("./utils");
const lodash_1 = require("lodash");
const attrMap = new Map([
    ['bindtap', '@click'],
    ['wx:if', 'v-if'],
    ['wx:else', 'v-else'],
    ['wx:key', 'v-key'],
]);
const resolveKeys = Array.from(attrMap.keys());
resolveKeys.push('class', 'src', 'wx:for', 'wx:for-item', 'wx:for-index');
// tagName picker {
//   bindchange: 'buildingChange',
//   bindtap: 'buildingTap',
//   range: '{{pickerList}}',
//   value: '{{pickerIndex}}',
//   'range-key': 'value',
//   disabled: '{{shopFold}}'
// }
const todoList = [];
function miniprogramToVue(s, d, opt) {
    const parsed = wxml.parse((0, utils_1.readFileStr)(s));
    wxml.traverse(parsed[0], function visitor(node, parent) {
        var _a;
        const type = node.type;
        // const parentNode = node.parentNode;
        if (type === wxml.NODE_TYPES.ELEMENT) {
            // handle element node
            const tagName = node.tagName;
            const attributes = node.attributes; // an object represents the attributes
            // const childNodes = node.childNodes;
            // const selfClosing = node.selfClosing; // if a node is self closing, like `<tag />`
            const keys = (0, lodash_1.omit)(attributes, resolveKeys);
            // console.log(`tagName`, tagName, keys); // , childNodes, selfClosing, parentNode, parent
            // tag
            if (node.tagName === 'import' || node.tagName === 'include') {
                console.log(`import-----s`, node.attributes.src);
            }
            else if (node.tagName === 'view') {
                node.tagName = 'div';
            }
            // attr
            for (let attr in node.attributes) {
                if (attr === 'wx:for') { // for k,v
                    let [item, /* key, */ index, arr] = [
                        node.attributes['wx:for-item'] || 'item',
                        // node.attributes['wx:for-key'] || 'key',
                        node.attributes['wx:for-index'] || 'index',
                        node.attributes['wx:for'],
                    ];
                    let forStr = `(${item},${index}) in ${(0, utils_1.filterV)('v-for', arr)[1]}`;
                    node.attributes['v-for'] = forStr;
                    delete node.attributes['wx:for'];
                }
                else {
                    let re = null;
                    let [k, v] = (0, utils_1.filterKV)(attr, node.attributes[attr]);
                    node.attributes[k] = v;
                    if (k != attr)
                        delete node.attributes[attr];
                }
            }
            console.log(Object.keys(node.attributes));
            // for (let attr2 in node.attributes) { // 
            //   let re = null;
            //   if (!attr2.startsWith('v-') && !attr2.startsWith(':') && (re = /^{{([^{}]+)}}$/.exec(node.attributes[attr2]))) {// 单个表达式
            //     console.log(`re`, attr2, re);
            //     node.attributes[`v-bind:${attr2}`] = node.attributes[attr2];
            //     delete node.attributes[attr2]
            //   }
            // }
            if (!(0, lodash_1.isEmpty)(keys))
                todoList.push([node.tagName, keys]);
            // if (opt.removeComponents?.[node.tagName]) {
            //   if (!parent?.childNodes && parsed.indexOf(node) > -1) {
            //     parsed.splice(parsed.indexOf(node), 1)
            //   } else {
            //     parent.childNodes.splice(parent.childNodes.indexOf(node), 1);
            //   }
            // }
            // if (node.tagName === 'wxs') {
            //   if (node.attributes.src) relations.wxs.push(node.attributes.src)
            //   else console.warn('wxs src 为空!', f)
            //   // console.log(`import-----s`, node.attributes.src);
            // }
        }
        let src = (_a = node.attributes) === null || _a === void 0 ? void 0 : _a.src;
        if (src && !/^https?/ig.test(src) && src.indexOf('images/') >= 0) {
            // relations.images[opt?.resolvePath(f, src)] = 1
        }
        //  else if (type === wxml.NODE_TYPES.TEXT) {
        //   // handle text node
        //   // const textContent = node.textContent;
        // } else if (type === wxml.NODE_TYPES.COMMENT) {
        //   // handle comment node
        //   const comment = node.comment;
        // }
    });
    console.log(`todoList----`);
    todoList.forEach(([t, attr]) => {
        console.log(t, attr);
    });
    const transformedCode = wxml.serialize(parsed[0]);
    return (0, utils_1.writeFileSync)(d, transformedCode);
}
exports.miniprogramToVue = miniprogramToVue;
;
