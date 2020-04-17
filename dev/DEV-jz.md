
## require

```js
var utils = require('../../utils/util.js');
const JZBgAudio = require('../../utils/utils.JZBgAudio.js');
```

```js
utils.getCdnUrl('/wangzhe/cover_words.png')
```

## touch
```xml
<view class="wrap" bindtouchstart="handleTouchStart" bindtouchend="handleTouchEnd">
```
```js

  pointer: {
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0
  },
  handleTouchStart(e) {
    const pointer = this.pointer;
    pointer.startx = e.touches[0].pageX;
    pointer.starty = e.touches[0].pageY;
  },
  handleTouchEnd(e) {
    const pointer = this.pointer;
    pointer.endx = e.changedTouches[0].pageX;
    pointer.endy = e.changedTouches[0].pageY;
    var direction = utils.getDirection(pointer.startx, pointer.starty, pointer.endx, pointer.endy);
    const index = this.data.index;
    switch (direction) {
      case 0:
        //  console.log("未滑动！");
        break;
      case 1:
        // console.log("向上！");
        break;
      case 2:
        // console.log("向下！");
        break;
      case 3:
        // 右
        const nextIndex = index + 1;
        if (nextIndex == 1) {
          var self = this;
          setTimeout(function() {
            self.setData({
              showNotice: true
            })
            self.data.noticeAudioCtx.play();
          }, 1000);
          setTimeout(function() {
            self.setData({
              showFinger: true
            });
          }, 1500);

          this.setData({
            index: nextIndex
          })
        }
        if (index == 2) {
          if (this.data.picIndex >= 3) {
            this.setData({
              picIndex: 0
            })
          } else {
            this.setData({
              picIndex: this.data.picIndex + 1
            })
          }
        }
        if (nextIndex > 2) {
          wx.navigateTo({
            url: '../endPage/endPage',
          })
        }
        break;
      case 4:
        if (index == 2) {
          if (this.data.picIndex <= 0) {
            this.setData({
              index: index - 1 < 0 ? 0 : index - 1,
              picIndex: 0
            })
          } else {
            this.setData({
              picIndex: this.data.picIndex - 1
            })
          }
        } else {
          this.setData({
            index: index - 1 < 0 ? 0 : index - 1
          })
        }
        break;
      default:
    }
  },
```

## tap do

```js
  bindtap(e) {
    const self = this;
    let { id } = e.currentTarget.dataset;
    console.log('bindtap', id);
  }
```





## animate config
```js
[{
  type: "image", // 图片
  imageType: "normal", // 图片类型 
  url: utils.getCdnUrl('/zuxinjie/P1-3.jpg'), // 小图地址(用于每页展示)
  downloadUrl: utils.getCdnUrl('/zuxinjie/yuan/P1-3.jpg'), // 大图地址(用于长按下载)
  animation: 'far-near2'
}, {
  type: "video", // 视频类型
  videoType: "full_screen", // 全屏视频
  videoClose: utils.getCdnUrl('/duanyien/close.png'),
  url: 'http://video01.app.happyjuzi.com/o_1e0n8bg5a1hh7v47e7cfm0c2e9_828x1792.mp4',
}, {
  type: "image", // 图片
  imageType: "normal", // 图片类型 
  url: utils.getCdnUrl('/zuxinjie/P1-6.jpg'), // 小图地址(用于每页展示)
  downloadUrl: utils.getCdnUrl('/zuxinjie/yuan/P1-6.jpg'), // 大图地址(用于长按下载)
  showCanvas: true
}, {
  type: "image", // 图片
  imageType: "normal", // 图片类型 
  url: utils.getCdnUrl('/zuxinjie/P1-1.jpg'), // 小图地址(用于每页展示)
  downloadUrl: utils.getCdnUrl('/zuxinjie/yuan/P1-1.jpg'), // 大图地址(用于长按下载)
  children: [{
    type: "yindaoImage", // 图片
    url: utils.getCdnUrl('/zuxinjie/p1-1-txt.png'),
    style: 'top: 167rpx;width: 516rpx;height: 187rpx;',
    items: [{
      style: 'height:37rpx;top:0rpx;background-position:0 -0rpx;background-size:516rpx 187rpx'
    }, {
      style: 'height:37rpx;top:37rpx;background-position:0 -37rpx;background-size:516rpx 187rpx'
    }, {
      style: 'height:37rpx;top:74rpx;background-position:0 -74rpx;background-size:516rpx 187rpx'
    }, {
      style: 'height:37rpx;top:111rpx;background-position:0 -111rpx;background-size:516rpx 187rpx'
    }, {
      style: 'height:40rpx;top:148rpx;background-position:0 -148rpx;background-size:516rpx 187rpx'
    }, ],
    // class: 'title-txt p1-1 animated fadeIn slow',
  }]
}]

```




## scratch

```xml
<image src="./sw.jpg" mode="scaleToFill" class="frosted {{hideCanvasMask ? 'h-frosted' : ''}}" wx:if="{{page.showCanvas}}"></image>
    <canvas wx:if="{{page.showCanvas}}" disable-scroll="false" canvas-id="luck" class="tui-luck {{hideCanvas ? 'h-luck' : ''}}" bindtouchstart="touchStart" bindtouchmove="touchMove" bindtouchend="touchEnd"></canvas>
```

```js
import Scratch from './scratch.js';
new Scratch(this, {
        canvasId: 'luck',
        width: viewSize.width,
        height: viewSize.height
      });
```