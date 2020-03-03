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
}
module.exports = ShapeRect;