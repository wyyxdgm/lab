
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