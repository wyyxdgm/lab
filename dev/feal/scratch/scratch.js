var f_position = {
  x: 150,
  y: 150,
  vx: 2,
  vy: 2
}
var m_width = 300;
var m_height = 300;
class Scratch {
  constructor(page, opts) {
    opts = opts || {};
    this.page = page;
    this.canvasId = opts.canvasId || 'luck';
    this.width = opts.width || 300;
    this.height = opts.height || 300;
    this.maskColor = opts.maskColor || '#dddddd';
    this.size = opts.size || 20,
    this.r = this.size * 2;
    this.area = this.r * this.r;
    this.scale = opts.scale || 0.3;
    this.totalArea = this.width * this.height;

    this.pointer = {
      startx: 0,
      starty: 0,
      endx: 0,
      endy: 0
    };

    m_width = this.width;
    m_height = this.height;

    this.init();
  }
  init() {
    this.show = false;
    this.clearPoints = [];
    this.ctx = wx.createCanvasContext(this.canvasId, this);
    this.drawMask();
    this.interval = setInterval(this.drawBall, 30);
    this.bindTouch();
  }
  drawMask() {
    // this.ctx.setFillStyle(this.maskColor);
    // this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.drawImage("./sw.jpg", 0, 0, this.width, this.height);
    this.ctx.draw();
    
    this.page.setData({
      hideCanvasMask: true
    });
  }

  drawBall() {
    var p = f_position;
    p.y += p.vy;
    if (p.y >= 300) {
      p.vy = -2
    }
    if (p.y <= 150) {
      p.vy = 2
    }

    var context = wx.createContext();
    function ball(x, y) {
      context.drawImage("./sw.jpg", 0, 0, m_width, m_height);
      context.drawImage("./tap.png", x, y, 50, 50);
    }
    
    ball(150, p.y);

    wx.drawCanvas({
      canvasId: 'luck',
      actions: context.getActions()
    })

  }

  bindTouch(){
    this.page.touchStart = (e) => {
      // console.log("触摸");
      // this.eraser(e, true);
      clearInterval(this.interval);

      const pointer = this.pointer;
      pointer.startx = e.touches[0].x;
      pointer.starty = e.touches[0].y;
    }
    this.page.touchMove = (e) => {
      this.eraser(e, false);
    }
    this.page.touchEnd = (e) => {
      if (this.show) {
        this.page.setData({
          hideCanvas: true
        })
        
        const pointer = this.pointer;
        pointer.endx = e.changedTouches[0].x;
        pointer.endy = e.changedTouches[0].y;
        var direction = this.getDirection(pointer.startx, pointer.starty, pointer.endx, pointer.endy);
        switch (direction) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            this.page.setData({
              current: this.page.data.current + 1
            })
            // this.page.wx.navigateBack();
            break;
          case 4:
            this.page.setData({
              current: this.page.data.current - 1
            })
            break;
          default:
        }
        
      }

      let len = this.clearPoints.length;
      if (len && this.r * this.r * len > this.scale * this.totalArea) {
        this.show = true;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.draw();
      }
    }
  }

  getAngle = (angx, angy) => {
    return Math.atan2(angy, angx) * 180 / Math.PI;
  };
  //根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
  getDirection = (startx, starty, endx, endy) => {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;

    //如果滑动距离太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
      return result;
    }

    var angle = this.getAngle(angx, angy);
    // console.log(angle);
    if (angle >= -135 && angle <= -45) {
      result = 1;
    } else if (angle > 45 && angle < 135) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    } else if (angle >= -45 && angle <= 45) {
      result = 4;
    }

    return result;
  }

  eraser(e, bool) {
    let len = this.clearPoints.length;
    let count = 0;
    let x = e.touches[0].x, y = e.touches[0].y;
    let x1 = x - this.size;
    let y1 = y - this.size;
    if (bool) {
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      })
    }
    for (let item of this.clearPoints) {
      // if (item.x1 > x || item.y1 > y || item.x2 < x || item.y2 < y) {
      //   count++;
      // }else{
      //   break;
      // }
      count++;
    }
    if(len === count){
      this.clearPoints.push({
        x1: x1,
        y1: y1,
        x2: x1 + this.r,
        y2: y1 + this.r
      });
    }
    // if (len && this.r * this.r * len > this.scale * this.totalArea) {
    //   this.show = true;
    //   this.ctx.clearRect(0, 0, this.width, this.height);
    //   this.ctx.draw();
    // }
    this.clearArcFun(x, y, this.r, this.ctx);
    this.ctx.draw(true);
  }
  clearArcFun(x, y, r, ctx) {
    let stepClear = 1;
    clearArc(x, y, r);
    function clearArc(x, y, radius) {
      let calcWidth = radius - stepClear;
      let calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);

      let posX = x - calcWidth;
      let posY = y - calcHeight;

      let widthX = 2 * calcWidth;
      let heightY = 2 * calcHeight;

      if (stepClear <= radius) {
        ctx.clearRect(posX, posY, widthX, heightY);
        stepClear += 1;
        clearArc(x, y, radius);
      }
    }
  }
}

export default Scratch