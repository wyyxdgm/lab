const pad = function(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}

module.exports = {
  pad,
}