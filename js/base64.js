//--------------------------

function btoa(s) { //修改过的版本，直接从buffer读内容，省去了转字符串的过程
    let i;
    for (i = 0; i < s.length; i++) {
        if (s[i] > 255) {
            return null;
        }
    }
    let out = "";
    for (i = 0; i < s.length; i += 3) {
        const groupsOfSix = [undefined, undefined, undefined, undefined];
        groupsOfSix[0] = s[i] >> 2;
        groupsOfSix[1] = (s[i] & 0x03) << 4;
        if (s.length > i + 1) {
            groupsOfSix[1] |= s[i + 1] >> 4;
            groupsOfSix[2] = (s[i + 1] & 0x0f) << 2;
        }
        if (s.length > i + 2) {
            groupsOfSix[2] |= s[i + 2] >> 6;
            groupsOfSix[3] = s[i + 2] & 0x3f;
        }
        for (let j = 0; j < groupsOfSix.length; j++) {
            if (typeof groupsOfSix[j] === "undefined") {
                out += "=";
            } else {
                out += btoaLookup(groupsOfSix[j]);
            }
        }
    }
    return out;
}

const cA = "A".charCodeAt(0);
const ca = "a".charCodeAt(0);
const c0 = "0".charCodeAt(0);

function btoaLookup(idx) {
    if (idx < 26) {
        return String.fromCharCode(idx + cA);
    }
    if (idx < 52) {
        return String.fromCharCode(idx - 26 + ca);
    }
    if (idx < 62) {
        return String.fromCharCode(idx - 52 + c0);
    }
    if (idx === 62) {
        return "+";
    }
    if (idx === 63) {
        return "/";
    }
    // Throw INVALID_CHARACTER_ERR exception here -- won't be hit in the tests.
    return undefined;
}

//--------------------------

const xbase64 = function (str) { //https://github.com/henry42/xbase64/blob/master/xbase64.js

  const BASE64CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  return function (str) {

    let r = [],
        i = 0,
        t = 0,
        len = str.length,
        c;
    for (; i < len; i++) {
      if (++t === 3)
        t = 0;
      c = str[i];

      switch (t) {
        case 1:
          r.push(c >> 2 & 0x3F);
          break;
        case 2:
          r.push((str[i - 1] << 4 | c >> 4) & 0x3F);
          break;
        case 0:
          r.push((str[i - 1] << 2 | c >> 6) & 0x3F);
          r.push(c & 0x3F);
          break;

      }

      if (i === len - 1 && t > 0) {
        r.push(c << ((3 - t) << 1) & 0x3F);
      }
    }

    for (let i = 0, len = r.length; i < len; i++)
      r[i] = BASE64CHARS.charAt(r[i]);

    if (t)
      while (3 - t++ > 0)
        r.push('=');

    return r.join('');

  };
}();

//--------------------------

const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

function fast_base64_encode(source) { //https://github.com/LinusU/fast-base64-encode/blob/master/index.js
    let target = '';

    let i, tmp;
    const length = source.length;
    const extraLength = length % 3;
    const baseLength = length - extraLength;

    for (i = 0; i < baseLength; i += 3) {
        tmp = (source[i] & 0xFF) << 16 | (source[i + 1] & 0xFF) << 8 | (source[i + 2] & 0xFF);
        target += (lookup[tmp >> 18 & 0x3F] + lookup[tmp >> 12 & 0x3F] + lookup[tmp >> 6 & 0x3F] + lookup[tmp & 0x3F]);
    }

    if (extraLength === 1) {
        tmp = (source[baseLength] & 0xFF);
        target += lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==';
    }

    if (extraLength === 2) {
        tmp = (source[baseLength] & 0xFF) << 8 | (source[baseLength + 1] & 0xFF);
        target += lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=';
    }

    return target;
}

//--------------------------