(function($) {
  'use strict';

  var $window = $(window);
  var s2t = $('.section-2')[0].offsetTop;
  $window.on('scroll', function() {
    var st = $window.scrollTop();
    // if (st > 0) {
    //   $('.header-area').addClass('sticky');
    // } else {
    //   $('.header-area').removeClass('sticky');
    // }

    if (st + $window.height() > s2t) {
      $('.scroll_guide').removeClass('fadeIn').addClass('fadeOut');
    } else {
      $('.scroll_guide').removeClass('fadeOut').addClass('fadeIn');
    }

  });

  // if ($window.width() > 767) {
  // }
  new kvMain({ leftShowMin: 768, durationCountDownH5: 6000 }).start();

  var section3Swiper;

  var initSection3Swiper = _.debounce(function() {
    console.log('initSection3Swiper')
    if (section3Swiper) section3Swiper.destroy(true, true);
    if ($window.width() > 767) {
      // s3 swiper
      section3Swiper = new Swiper('.section-3 .swiper-container', {
        slidesPerView: 3,
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiper-custom-next',
          prevEl: '.swiper-custom-prev',
          disabledClass: 'fadeOut'
        },
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        //   hide: true,
        // },
      });
    } else {
      // s3 swiper
      section3Swiper = new Swiper('.section-3 .swiper-container', {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.pagination',
          type: 'fraction',
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          // hide: true,
        },
      });
    }
  }, 300);

  initSection3Swiper();

  window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', function() {
    initSection3Swiper();
  }, false);


  var section5Swiper;

  var initSection5Swiper = _.debounce(function() {
    console.log('initSection5Swiper')
    if (section5Swiper) section5Swiper.destroy(true, true);
    if ($window.width() > 767) {
      // s5 swiper
      var section5Swiper = new Swiper('.section-5 .swiper-container', {
        effect: 'fade',
        navigation: {
          nextEl: '.swiper-custom-next',
          prevEl: '.swiper-custom-prev',
          disabledClass: 'disable'
        },
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        //   hide: true,
        // },
      });
    } else {
      // s5 swiper
      var section5Swiper = new Swiper('.section-5 .swiper-container', {
        effect: 'fade',
        navigation: {
          nextEl: '.swiper-custom-next',
          prevEl: '.swiper-custom-prev',
          disabledClass: 'disable'
        },
        pagination: {
          el: '.pagination',
          type: 'fraction',
        },
      });
    }
  }, 300);

  initSection5Swiper();

  window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', function() {
    initSection5Swiper();
  }, false);
  // var rellax = new Rellax('.rellax');

  /*滚动*/
  // init controller
  var controller = new ScrollMagic.Controller();
  controller.scrollTo(-500);
  // var blockTween = new TweenMax.to('.section-2', 1.5, {
  //   backgroundColor: 'red'
  // });
  // var tween = new TimelineMax()
  //       .add([
  //         TweenMax.fromTo("#parallaxText .layer1", 1, {scale: 3, autoAlpha: 0.05, left: 300}, {left: -350, ease: Linear.easeNone}),
  //         TweenMax.fromTo("#parallaxText .layer2", 1, {scale: 2, autoAlpha: 0.3, left: 150}, {left: -175, ease: Linear.easeNone})
  //       ]);

  // create a scene
  new ScrollMagic.Scene({
      duration: 800, // the scene should last for a scroll distance of 100px
      triggerElement: '.section-2',
      offset: -200 // start this scene after scrolling for 50px
    })
    .setTween(".years", { y: -250, ease: Linear.easeNone })
    // .setPin('.years') // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller


  /*hover-fullview*/
  $('.js-block-alone').hover(function() {
    // console.log('hover', $(this).html());
    // $('body>.block-alone-bg').remove();
    let bg = $(this).find('.block-alone-bg').clone();
    $('body').append(bg);
    // 隐藏swiper-container其他内容
    // $(this).parent().parent().find('.text-wrapper').css({ opacity: 0, pointerEvent: 'none' });
    // $(this).parent().parent().parent().parent().siblings('.swiper-slide').css({ opacity: 0, pointerEvent: 'none' });
    // var pbgItem = $(this).parent().parent().parent();
    // pbgItem.data('bg', pbgItem.css('background'));
    // pbgItem.css('background', 'transparent');
    // $('.section-3 .swiper-custom-next').css({ opacity: 0, pointerEvent: 'none' });
    $(this).parent().parent().parent().parent().addClass('current-cover');
    $('.section-3 .swiper-container').addClass('cover-model');
  }, function() {
    $('body>.block-alone-bg').remove();
    // console.log('leave', $(this).html());
    $('.section-3 .swiper-container').removeClass('cover-model');
    $(this).parent().parent().parent().parent().removeClass('current-cover');
    // $(this).parent().parent().find('.text-wrapper').css({ opacity: 1, pointerEvent: 'default' });
    // $(this).parent().parent().parent().parent().siblings('.swiper-slide').css({ opacity: 1, pointerEvent: 'default' });
    // var pbgItem = $(this).parent().parent().parent();
    // pbgItem.css('background', pbgItem.data('bg'));
    // $('.section-3 .swiper-custom-next').css({ opacity: 1, pointerEvent: 'default' });
  });
  const TIME_OUT = 10000;
  var navWrapperInterval = null;

  function changeView(c) {
    $(".js-nav-wrapper").attr('current', c);
    var showObj = null;
    var hideObj = null;
    switch (c) {
      case '1':
        showObj = $('#js-nav-target-1');
        hideObj = $('#js-nav-target-2');
        break;
      case '2':
        showObj = $('#js-nav-target-2');
        hideObj = $('#js-nav-target-1');
        break;
      default:
        showObj = $('#js-nav-target-1');
        hideObj = $('#js-nav-target-2');
        break;
    }
    showObj.addClass('fadeIn').removeClass('fadeOut');
    // showObj.find('.more-1').addClass('fadeIn').removeClass('fadeOut');
    // showObj.find('.more-2').fadeIn();

    hideObj.removeClass('fadeIn').addClass('fadeOut')
    // hideObj.find('.original-image').removeClass('fadeIn').addClass('fadeOut')
    // hideObj.find('.more-1').removeClass('fadeIn').addClass('fadeOut');
    // hideObj.find('.more-2').fadeOut();
    // setTimeout(function() {
    //   hideObj.removeClass('fadeOut');
    // }, 800);
  }

  function stopTimer() {
    if (navWrapperInterval) clearInterval(navWrapperInterval);
  }

  function startTimer() {
    navWrapperInterval = setInterval(function() {
      let c = $(".js-nav-wrapper").attr('current');
      c = c == '2' ? '1' : '2';
      changeView(c);
    }, TIME_OUT);
  }
  startTimer();
  /*js-nav-wrapper*/

  $(".js-nav-wrapper").mouseenter(function(e) {
    stopTimer();
  }).mousemove(function(e) {
    // console.log(e)
    let rate = e.offsetX / e.target.offsetWidth;
    var c = '1';
    if (rate >= 0.5) c = '2';
    changeView(c);
  }).mouseout(function(e) {
    startTimer();
    // if ('2' != $(this).attr('current')) $(this).removeClass('current-2');
    // else $(this).addClass('current-2');
  })
  // .click(function(e) {
  //   // console.log(e)
  //   // let rate = e.offsetX / e.target.offsetWidth;
  //   // if (rate < 0.5) $(this).attr('current', '1');
  //   // else $(this).attr('current', '2');
  // })


  /*放大*/

  function distance2(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y2 - y1) * (y2 - y1);
  }

  var SHOW_DISTANCE = 280 * 280;
  var SCALE_RATE = 2;
  var more1 = { el: $('.more-1'), left: parseInt($('.more-1').css('left')), top: parseInt($('.more-1').css('top')) };
  var more2 = { el: $('.more-2'), left: parseInt($('.more-2').css('left')), top: parseInt($('.more-2').css('top')) };
  // console.log(more1);
  // $(".mask").mouseover(function() {
  //   $(".float_layer").fadeIn()
  // })
  $(".mask").mouseout(function() {
    $(".float_layer").fadeOut();
    more1.el.fadeIn();
    more2.el.fadeIn();
    startTimer();
  })

  function setWH() {
    $('.large-image').css({ 'width': $('.original-image').width() * SCALE_RATE + 'px', 'height': $('.original-image').height() * SCALE_RATE + 'px' });
    console.log($('.large-image').width(), $('.large-image').height());
  }
  setWH();
  $("img.original-image").load(function() {
    setWH();
  });
  var container = '.float_layer' || '.big_box';
  $(".mask").mouseenter(function(e) {
    stopTimer();
  }).mousemove(function(e) {
    var absX = e.pageX - $(".small_box").offset().left;
    var absY = e.pageY - $(".small_box").offset().top;

    var d2_more1 = distance2(absX, absY, more1.left, more1.top);
    var d2_more2 = distance2(absX, absY, more2.left, more2.top);
    // console.log(d2_more1, d2_more2)
    if (d2_more1 < SHOW_DISTANCE) {
      more1.el.fadeOut();
      $(".float_layer").fadeIn()
    } else {
      more1.el.fadeIn();
    }
    if (d2_more2 < SHOW_DISTANCE) {
      more2.el.fadeOut();
      $(".float_layer").fadeIn()
    } else {
      more2.el.fadeIn();
    }
    if (!(d2_more1 < SHOW_DISTANCE) && !(d2_more2 < SHOW_DISTANCE)) {
      $(".float_layer").fadeOut()
    }
    var l = absX - ($(".float_layer").width() / 2);
    var t = absY - ($(".float_layer").height() / 2);
    // console.log(l, t);
    if (l < 0) {
      l = 0
    }
    if (l > $(this).width() - $(".float_layer").width()) {
      l = $(this).width() - $(".float_layer").width()
    }
    if (t < 0) {
      t = 0
    }
    if (t > $(this).height() - $(".float_layer").height()) {
      t = $(this).height() - $(".float_layer").height()
    }

    $(".float_layer").css({
      "left": l,
      "top": t
    })
    var pX = l / ($(".mask").width() - $(".float_layer").width())
    var pY = t / ($(".mask").height() - $(".float_layer").height())
    $(container + " img").css({
      "left": -pX * ($(container + " img").width() - $(container + "").width()),
      "top": -pY * ($(container + " img").height() - $(container + "").height())
    })

  })

})(jQuery);
