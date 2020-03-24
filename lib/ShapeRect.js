class ShapeRect {
  // ↓x,→y
  constructor(xywh) {
    if (xywh) {
      let [x, y, w, h] = xywh;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  }
  // 获取矩形边界像素点坐标数组
  getBorderPoints() {
    let points = [];
    let { x, y, h, w } = this;
    if (!x || !y || !h || !w) return points;
    const x0 = x;
    const y0 = y;
    let xh = x + h;
    let yw = y + w;
    while (x < xh) {
      points.push([x++, y]);
    }
    points.push([x, y]);
    while (y < yw) {
      points.push([x, y++]);
    }
    points.push([x, y]);
    while (x > x0) {
      points.push([x--, y]);
    }
    points.push([x, y]);
    while (y > y0) {
      points.push([x, y--]);
    }
    return points;
  }
  static fromPointsBounds(points) {
    if (!points || !points.length) return new ShapeRect();
    let x = parseInt(points[0][0]) || 0;
    let y = parseInt(points[0][1]) || 0;
    let w = 0;
    let h = 0;
    for (let [_x, _y] of points) {
      _x = parseInt(_x);
      _y = parseInt(_y);
      if (_x < x) {
        x = _x;
        h = h + _x - x;
      } else {
        h = Math.max(_x - x, h);
      }
      if (_y < y) {
        y = _y;
        w = w + _y - y;
      } else {
        w = Math.max(_y - y, w);
      }
    }
    return new ShapeRect([x, y, w, h]);
  }
}
module.exports = ShapeRect;