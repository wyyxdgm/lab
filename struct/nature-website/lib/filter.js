'use strict';
var through = require('through2');
module.exports = function(opt = {}) {

  function doSomething(file, encoding, callback) {

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(createError(file, 'Streaming not supported'));
    }
    const { host } = opt;
    //do something
    if (host) file.contents = Buffer.from(file.contents.toString().replace(new RegExp('../img', 'g'), `${host}/img`));

    callback(null, file);
  }

  return through.obj(doSomething);
};
