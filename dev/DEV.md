
## require

```js
const app = getApp();
const { req } = app;
const util = req('utils/util');
const api = req('config/api');
const user = req('utils/user');
const _ = req('utils/underscore');

const bgImage = req('images/title-bg');

const { AUTH_STATUS, EXAM_TYPE } = req('config/v');
```

## pagination

```js
 onLoad: function(options) {
    const page = 1;
    api.positionMyCollects({ page }).then(res => this.loadPagination(res.data, true));
  },
   // 拼接数据显示
  loadPagination(nextPage, init) {
    let oldData = this.data.data || [];
    if (init) oldData = [];
    // 设置新分页等数据
    nextPage.data = oldData.concat(nextPage.data)
    this.setData(nextPage);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const { total, current_page } = this.data;
    const page = current_page + 1;
    const to = page * 10;
    if (to >= total) {
      if (total > 1) wx.showToast({ icon: 'none', title: "没有新数据" });
      this.data.noMoreData = true;
    }
    if (this.data.noMoreData) {
      return false;
    }
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 1500 });
    api.positionMyCollects({ page }).then(res => this.loadPagination(res.data))
  },
```

## tap request

```js
  ,
  cancelFavorite(e) {
    const self = this;
    let { id } = e.currentTarget.dataset;
    console.log('cancelFavorite', id);
    if (self.cancelFavorite_ing) return;
    self.cancelFavorite_ing = true;
    api.positionCollect({ postId: id }).then(res => {
      const { data } = self.data;
      util.splice(data, id, 'postId');
      self.setData({ data });
      self.cancelFavorite_ing = false;
      util.success('取消成功');
    }).catch((err) => self.cancelFavorite_ing = false);
  },
```




```xml
<view wx:if="{{page.url && page.videoType && !playVideo}}" class="video-btn-wrapper" bindtap="clickPlayVideo">
          <view class="play animated fadeInUp slow"></view>
          <view class="play-txt animated fadeIn slow delay-2s"></view>
        </view>
```