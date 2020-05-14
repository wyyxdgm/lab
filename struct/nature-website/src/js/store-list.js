$(document).ready(function() {
  console.log('page store-list loaded');
  $('.tab-bar .tab-item').click(function() {
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');
  });
  var container = $('.store-area-name-list');
  const leftappend = $(window).width() / 2;

  function gotoid(id) {
    if ($(window).width() > 767) return;
    console.log('gotoid', id)
    var scrollTo = $('[href="#' + id + '"]');
    container.scrollLeft(
      scrollTo.offset().left - container.offset().left + container.scrollLeft() - leftappend
    );
  }
  // ('.store-area-name-list').niceScroll({
  //   touchbehavior: true, //是否是触摸式滚动效果
  //   cursorcolor: "rgba(171, 171, 171, 0)", //滚动条的颜色值
  //   cursorborder: "none",
  //   smoothscroll: true,
  //   cursoropacitymax: 0, //滚动条的透明度值
  //   cursorwidth: 0, //滚动条的宽度值
  //   railalign: "left",
  //   // nativeparentscrolling: false, // 取消父节点滚动
  //   background: "rgba(149, 149, 149, .0)", //滚动条的背景色，默认是透明的
  //   autohidemode: false, //滚动条是否是自动隐藏，默认值为 true
  // });

  // 暂时去掉modal效果
  // var $dialog = $('.dialogs .dialog').modal();
  // $dialog.on('click', '.js-close-dialog', function(e) {
  //   e.preventDefault();
  //   $dialog.modal('close');
  // });
  // const modals = {
  //   shunde: null,
  //   shanghai: null,
  //   nanjing: null
  // }
  //
  // modals.shunde = $('#modal-shunde').modal()
  // modals.shanghai = $('#modal-shanghai').modal()
  // modals.nanjing = $('#modal-nanjing').modal()
  //
  // $('.store-list .store-item').on('click', function(e) {
  //   e.preventDefault();
  //   var modal_id = $(this).attr('id')
  //   console.log(modals[modal_id])
  //   modals[modal_id].modal('open')
  //   $('.close_dialog_layer').show()
  // });

  // $('.close_dialog_layer').on('click', function(e) {
  //   e.preventDefault();
  //   let modal_id = $('.dialog').attr('id')
  //   modal_id = modal_id.substring(6)
  //   // console.log(modal_id)
  //   modals[modal_id].modal('close')
  //   $(this).hide()
  // });





  var lastId,
    topMenu = $(".store-area-name-list"),
    topMenuHeight = 75,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function() { // 即<a id="foo">Foo</a>，等
      var item = $($(this).attr("href"));
      // console.log($(this).attr("href")); // debug
      // console.log(item); // debug
      console.log(menuItems.length); // debug
      if (item.length) { return item; }
    });

  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  menuItems.click(function(e) {
    var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
    $('html, body').stop().animate({
      scrollTop: offsetTop
    }, 300);
    e.preventDefault();
  });

  // Bind to scroll
  $(window).scroll(function() {
    // Get container scroll position
    var fromTop = $(this).scrollTop() + topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function() {
      if ($(this).offset().top < fromTop)
        return this;
    });
    // Get the id of the current element
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";

    if (lastId !== id) {
      lastId = id;
      // Set/remove active class
      menuItems
        .parent().removeClass("active")
        .end().filter("[href='#" + id + "']").parent().addClass("active");
    }
    if (id) gotoid(id);
  });



  var top1 = topMenu.offset().top;
  var left = topMenu.offset().left;
  console.log(left)

  $(window).scroll(function() {

    var win_top = $(this).scrollTop();

    var top = topMenu.offset().top;

    if (win_top + topMenuHeight >= top) {

      topMenu.addClass("sfixed").css('left', (left - $(this).scrollLeft()) + 'px');

    } //如果此处用else判断来remove sfixed这个类的话是不行的，因为当加上这个类的时候，".scroll"这个元素fixed的top值是0，获取到的offset.top就相当于是当前滚动条的滚动的距离，win_top与top值就一直相等了，这样会导致抖动；只有与以前的距离做比较才能实现滑上去的时候能回到原来的位置。

    if (win_top + topMenuHeight < top1) {

      topMenu.removeClass("sfixed").css('left', '');

    }

  })

})
