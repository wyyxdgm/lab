"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpx2less = void 0;
const utils_1 = require("./utils");
function rpx2less(s, d, opt) {
    let str = (0, utils_1.readFileStr)(s);
    let re = str.replace(/(\-?[\d\.]*\d)rpx/g, 'unit($1 * 0.01, rem)');
    return (0, utils_1.writeFileSync)(d, re);
}
exports.rpx2less = rpx2less;
;
