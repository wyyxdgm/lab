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
}
module.exports = ShapeRect;