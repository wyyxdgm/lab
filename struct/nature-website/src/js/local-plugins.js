function kvMain(opt) {
  var that = this;
  this.leftShowMin = opt.leftShowMin;
  this.windowWidth = $(window).width();
  this.showLeft = this.windowWidth >= this.leftShowMin;
  this.time = Date.now(),
    this.durationTransformMain = 1300,
    this.durationTransformLeft = 700,
    this.durationCountDownDefault = 8000,
    this.durationTotal = this.durationTransformMain + (this.showLeft ? this.durationTransformLeft : 0),
    this.durationCountDown = this.durationCountDownDefault,
    this.durationCountDownH5 = opt.durationCountDownH5 || this.durationCountDownDefault,
    this.duration = this.durationCountDown + this.durationTotal,
    this.isAnimation = !1,
    this.isLoop = !1,
    this.slideActive = 0,
    this.slideMax = 3,
    this.bar = $("#progress")[0],
    this.kvMainIndex = $("#js-kv-main-index")[0],
    this.kvMainImg = [],
    this.kvMainImgObj = [];
  for (var n = 0; n < this.slideMax; n++)
    this.kvMainImg[n] = document.getElementById("js-kv-main-img" + n),
    this.kvMainImgObj[n] = document.getElementById("js-kv-main-img-obj" + n);
  this.kvNavImg = [],
    this.kvNavImgObj = [];
  for (var r = 0; r < this.slideMax; r++)
    this.kvNavImg[r] = document.getElementById("js-kv-nav-img" + r),
    this.kvNavImgObj[r] = document.getElementById("js-kv-nav-img-obj" + r)
  var e = this;

  $('.kv-nav-button').click(function() {
    var nav = $(this).data('nav');
    if (nav == 'pre') e.changeSlide((e.slideActive - 1 + e.slideMax) % e.slideMax);
    else e.changeSlide((e.slideActive + 1 + e.slideMax) % e.slideMax);
  });

  function recalc() {
    that.windowWidth = $(window).width();
    that.showLeft = that.windowWidth >= that.leftShowMin;
    that.durationTotal = that.durationTransformMain + (that.showLeft ? that.durationTransformLeft : 0);
    that.durationCountDown = !that.showLeft ? that.durationCountDownH5 : that.durationCountDown;
    console.log(that.durationCountDown)
  }
  window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', recalc, false);

  this.start = function() {
    this.kvMainImg[0].classList.add("scale"),
      this.kvMainImg[0].classList.add("on-init"),
      this.isLoop = !0
  }

  this.stop = function() {
    this.isLoop = !1
  }

  this.resize = function() {
    var t = this.modules.scrollManager.resolution.x,
      e = 600;
    t <= 1024 && (t = Math.max(t, 1024),
      e = 540);
    for (var n = t - e - 80 + "px", r = 0; r < this.slideMax; r++)
      this.kvMainImgObj[r].style.width = n;
    var o = e / 3 + "px";
    for (r = 0; r < 3; r++)
      for (var i = 0; i < this.slideMax; i++)
        this.kvNavImgObj[r][i].style.width = o,
        this.kvNavImgObj[r][i].style.width = o,
        this.kvNavImgObj[r][i].style.width = o
  }

  this.update = function() {
    if (this.isLoop) {
      var t = Date.now(),
        e = Math.min(1, (t - this.time) / this.durationCountDown);
      this.bar.style.transform = "scaleX(" + e + ")",
        this.durationCountDown <= t - this.time && (this.isAnimation || this.changeSlide((this.slideActive + 1) % this.slideMax))
    }
  }

  this.updateLoop = function() {
    var t = this;
    this.update(),
      requestAnimationFrame(function() {
        t.updateLoop()
      })
  }

  this.changeSlide = function(index) {
    var n = this;
    if (index == this.slideActive) return;
    if (!this.isAnimation) {
      this.isAnimation = !0;
      var r = this.slideActive;
      this.slideActive = index,
        this.kvMainImg[r].classList.remove("scale"),
        this.kvMainImg[r].classList.remove("on-init"),
        this.kvMainImg[r].classList.remove("on"),
        this.kvMainImg[r].classList.add("off"),
        this.kvMainImg[this.slideActive].classList.add("on"),
        this.changeIndex(0, this.kvMainIndex, this.slideActive + 1),
        this.bar.classList.add("off");
      setTimeout(function() {
        if (n.showLeft) n.changeSlideNav(r, index)
      }, this.durationTransformMain);
      // setTimeout(function() {
      //   n.kvNavImg[r].classList.remove("off")
      // }, 2600),
      setTimeout(function() {
        n.time = Date.now(),
          n.bar.classList.remove("off")
        n.kvMainImg[r].classList.remove("off");
        n.kvNavImg[r].classList.remove("off");
        n.isAnimation = !1
      }, this.durationTotal)
    }
  }

  this.changeSlideNav = function(e, n) {
    this.kvNavImg[e].classList.remove("on"),
      this.kvNavImg[e].classList.add("off"),
      this.kvNavImg[n].classList.add("on")
  }

  this.changeIndex = function(t, e, n) {
    if (!e) return;
    var r = this;
    if (0 != t) {
      if (requestAnimationFrame(function() {
          r.changeIndex(t - 1, e, n)
        }),
        t % 2 == 0) {
        var o = "";
        o += Math.floor(10 * Math.random()),
          o += Math.floor(10 * Math.random()),
          e.innerHTML = o
      }
    } else
      e.innerHTML = "0" + n
  }

  this.updateLoop()
  return this;
}
