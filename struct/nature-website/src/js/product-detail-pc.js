$(document).ready(function() {
  console.log('page product-detail loaded');
  $window = $(window);
  var elaborateSwiper;

  var initElaborateSwiper = _.debounce(function() {
    console.log('initElaborateSwiper')
    if (elaborateSwiper) elaborateSwiper.destroy(true, true);
    if ($window.width() > 767) {
      // s5 swiper
      var elaborateSwiper = new Swiper('.elaborate-swiper-container', {
        // effect: 'fade',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          // disabledClass: 'disable'
        },
        pagination: {
          el: '.js-pagination',
          type: 'custom',
          renderCustom: function(swiper, current, total) {
            return '<span class="no">' + current + '</span><span class="gap"> / </span><span class="total">' + total + '</span>';
          }
        },

        // scrollbar: {
        //   el: '.swiper-scrollbar',
        //   hide: true,
        // },
      });
      elaborateSwiper.on('slideChange', function(e) {
        console.log('slide changed', elaborateSwiper.activeIndex);
        let num = elaborateSwiper.activeIndex + 1;

      });
    } else {
      // s5 swiper
      var elaborateSwiper = new Swiper('.elaborate-swiper-container', {
        // effect: 'fade',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          // disabledClass: 'disable'
        },
        pagination: {
          el: '.js-pagination',
          type: 'custom',
          renderCustom: function(swiper, current, total) {
            return '<span class="no">' + current + '</span><span class="gap"> / </span><span class="total">' + total + '</span>';
          }
        },
      });
    }
  }, 300);

  initElaborateSwiper();

  window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', function() {
    initElaborateSwiper();
  }, false);
})
