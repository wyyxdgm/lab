module.exports = function parseParam(param, key) {

  var paramStr = "";
  if (['string', 'number', 'boolean'].indexOf(typeof param) > -1) {
    paramStr += `&${key}=${param}`;
  } else if (param instanceof Array) {
    param.forEach((p, i) => {
      var k = key == null ? i : `${key}[${i}]`;
      paramStr += '&' + parseParam(p, k);
    });
  } else if (undefined === param) {
    return '';
  } else { // object
    Object.keys(param).forEach((i) => {
      var k = !key ? i : `${key}.${i}`;
      paramStr += '&' + parseParam(param[i], k);
    })
  }
  return paramStr.substr(1);
};