import { existsSync, mkdirSync, readFileSync, writeFileSync as fsWriteFileSync } from "fs"
import { dirname } from "path";

export const readFileStr = (p: string) => {
  return readFileSync(p, { encoding: 'utf-8' })
}

export const writeFileSync = (d: string, str: string) => {
  if (!existsSync(dirname(d))) mkdirSync(dirname(d), { recursive: true });
  fsWriteFileSync(d, str);
}
const attrMap = new Map([
  ['bindtap', '@click'],
  ['wx:if', 'v-if'],
  ['wx:else', 'v-else'],
  ['wx:key', 'v-key'],
]);

export function filterKV(k: string, v: string): [string, string] {
  let re = null;
  if (attrMap.has(k)) { // k wx:if,wx:else,wx:key,bindtap
    k = attrMap.get(k) as string
  } else if (re = /^bind(:?)(\w+)$/.exec(k)) { // k bind*
    if (re[2]) k = `@${re[2]}`
  } else {
    // console.warn('key 未处理', k)
  }
  return filterV(k, v);
}
export function filterV(k: string, v: string): [string, string] {
  let re = null;
  if (re = /^{{([^{}]+)}}$/.exec(v)) { // v
    // console.log(`filterV`, v);
    if (!k.startsWith('v-') && !k.startsWith('@') && !k.startsWith(':')) k = ':' + k;
    return [k, resolveProp(re[1])]
  } else if (re = /({{([^{}]+)}})+/.test(v)) {
    let strs = v.split(/({{[^{}]+}})/).filter(s => !!s);
    // console.log(`strs------------------`, strs);
    v = strs.map(x => {
      let r = x.trim().startsWith('{{') ? resolveProp(x.replace(/{{(.+)}}/, '($1)')) : JSON.stringify(x)
      // console.log(`x`, x, r);
      return r
    }).join('+')
    if (!k.startsWith('v-') && !k.startsWith('@') && !k.startsWith(':')) k = ':' + k;
    return [k, v];
  } else {
    // console.warn('/???')
    return [k, v]
  }
}

function resolveProp(props: string) {
  return props.replace(/\b([\w_\d]+(\.[\w_\d]+)+)\b/g, function (match, p1, p2, p3) {
    // console.log('match', match, 'p1', p1, 'p2', p2, 'p3', p3);
    let arr = match.split('.');
    return '(' + arr.slice(1).reduce((p, c) => p + '&&' + p + '.' + c, arr[0]) + ')';
  })
}
