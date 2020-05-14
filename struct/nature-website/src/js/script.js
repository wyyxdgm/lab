function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值
}
(function($) {
  'use strict';

  var $window = $(window);
  // :: Preloader Active Code
  $window.on('load', function() {
    console.log('loaded')
    $('#preloader').fadeOut('1000', function() {
      $(this).remove();
    });
  });
  // :: Sticky Active Code
  $window.on('scroll', function() {
    var st = $window.scrollTop();
    // if (st > 0) {
    //   $('.header-area').addClass('sticky');
    // } else {
    //   $('.header-area').removeClass('sticky');
    // }

  });

  if ($.fn.scrollTo) {
    $('.go-top').click(function() {
      console.log('go-top')
      window.scrolling = true;
      $.scrollTo(0, {
        duration: 1000,
        easing: 'easeOutQuad',
        onAfter: function() {
          console.log('go-top done');
          setTimeout(function() {
            window.scrolling = false;
          }, 10)
        }
      })
    })
  }
  new WOW().init();
  AOS.init();
  // if ($window.width() > 767) {
  // }
  $(document).activeNavigation('#nav');

  $('.menu-container').niceScroll({
    touchbehavior: true, //是否是触摸式滚动效果
    cursorcolor: "rgba(171, 171, 171, 0.4)", //滚动条的颜色值
    cursorborder: "none",
    smoothscroll: true,
    cursoropacitymax: 1, //滚动条的透明度值
    cursorwidth: 1, //滚动条的宽度值
    railalign: "left",
    // nativeparentscrolling: false, // 取消父节点滚动
    background: "rgba(149, 149, 149, .14)", //滚动条的背景色，默认是透明的
    autohidemode: false, //滚动条是否是自动隐藏，默认值为 true
  });
  $('.nav-brand-left').click(function() {
    $('.left-menu').addClass('on').focus();
    $('.header-area').addClass('left-menu-on');
  })
  $('.left-menu').blur(function(e) {
    $('.left-menu').removeClass('on');
    $('.header-area').removeClass('left-menu-on');
  })
  $('#menu-toggle').click(function() {
    $(this).toggleClass('open');
    $('.h5-menu').toggleClass('on');
    $('.header-area').toggleClass('h5-menu-on');
    $('.h5-menu .menu-item .menu-block').toggleClass('fadeInUpBig');
  })
  setTimeout(function() {
    $('#menu-toggle').addClass('transition')
  }, 1000);
  $('body').delegate('[a-link]', 'click', function(event) {
    window.location.href = $(this).attr('a-link');
  });

  /* h5-bg support */
  function resolveH5Bg() {
    if ($(window).width() <= 767) {
      console.log('h5');
      $('[data-h5-bg]').each(function() {
        console.log($(this).css('backgroundImage'), $(this).data('h5-bg'))
        $(this).data('pc-bg', $(this).css('backgroundImage'));
        $(this).css({ backgroundImage: 'url(' + $(this).data('h5-bg') + ')' });
      })
    } else {
      $('[data-h5-bg]').each(function() {
        $(this).css({ backgroundImage: $(this).data('pc-bg') });
      })
    }
  }
  resolveH5Bg();
  window.addEventListener('resize', resolveH5Bg)
})(jQuery);
