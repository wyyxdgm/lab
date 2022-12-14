import { readFileStr, writeFileSync } from "./utils";
export function rpx2less(s: string, d: string, opt?: any) {
  let str = readFileStr(s);
  let re = str.replace(/(\-?[\d\.]*\d)rpx/g, 'unit($1 * 0.01, rem)');
  return writeFileSync(d, re);
};
