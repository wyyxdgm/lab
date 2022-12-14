import * as wxml from "wxml";
import { filterKV, filterV, readFileStr, writeFileSync } from "./utils";
import { isEmpty, omit, pick } from 'lodash';
const attrMap = new Map<string, string>([
  ['bindtap', '@click'],
  ['wx:if', 'v-if'],
  ['wx:else', 'v-else'],
  ['wx:key', 'v-key'],
]);

const resolveKeys = Array.from(attrMap.keys())
resolveKeys.push('class', 'src', 'wx:for', 'wx:for-item', 'wx:for-index')
// tagName picker {
//   bindchange: 'buildingChange',
//   bindtap: 'buildingTap',
//   range: '{{pickerList}}',
//   value: '{{pickerIndex}}',
//   'range-key': 'value',
//   disabled: '{{shopFold}}'
// }
const todoList: any = [];
export function miniprogramToVue(s: string, d: string, opt: any) {
  const parsed = wxml.parse(readFileStr(s));
  wxml.traverse(parsed[0], function visitor(node: any, parent: any) {
    const type = node.type;
    // const parentNode = node.parentNode;
    if (type === wxml.NODE_TYPES.ELEMENT) {
      // handle element node
      const tagName = node.tagName;
      const attributes = node.attributes; // an object represents the attributes
      // const childNodes = node.childNodes;
      // const selfClosing = node.selfClosing; // if a node is self closing, like `<tag />`
      const keys = omit(attributes, resolveKeys);
      // console.log(`tagName`, tagName, keys); // , childNodes, selfClosing, parentNode, parent
      // tag
      if (node.tagName === 'import' || node.tagName === 'include') {
        console.log(`import-----s`, node.attributes.src);
      } else if (node.tagName === 'view') {
        node.tagName = 'div';
      }

      // attr
      for (let attr in node.attributes) {
        if (attr === 'wx:for') { // for k,v
          let [item, key, index, arr] = [
            node.attributes['wx:for-item'] || 'item',
            node.attributes['wx:for-key'] || 'key',
            node.attributes['wx:for-index'] || 'index',
            node.attributes['wx:for'],
          ]
          let forStr = `(${item},${key},${index}) in ${filterV('v-for', arr)[1]}`
          node.attributes['v-for'] = forStr;
          delete node.attributes['wx:for']
        }
        let re = null;
        let [k, v] = filterKV(attr, node.attributes[attr]);
        node.attributes[k] = v;
        if (k != attr && attr) delete node.attributes[attr];
      }

      // for (let attr2 in node.attributes) { // 
      //   let re = null;
      //   if (!attr2.startsWith('v-') && !attr2.startsWith(':') && (re = /^{{([^{}]+)}}$/.exec(node.attributes[attr2]))) {// 单个表达式
      //     console.log(`re`, attr2, re);
      //     node.attributes[`v-bind:${attr2}`] = node.attributes[attr2];
      //     delete node.attributes[attr2]
      //   }
      // }
      if (!isEmpty(keys)) todoList.push([node.tagName, keys])


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
    let src = node.attributes?.src;
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
  todoList.forEach(([t, attr]: any) => {
    console.log(t, attr);
  });
  const transformedCode = wxml.serialize(parsed[0]);
  return writeFileSync(d, transformedCode);
};
