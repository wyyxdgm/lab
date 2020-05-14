/*居中方案*/
$(".mask").mouseover(function() {
  $(".float_layer").show()
})
// $(".mask").mouseout(function() {
//   $(".float_layer").hide()
// })
$("img.original-image").load(function() {
  $('.large-image').css({ 'width': $('.original-image').width() * 2 + 'px', 'height': $('.original-image').height() * 2 + 'px' });
  console.log($('.large-image').width(), $('.large-image').height());
});
var container = '.float_layer' || '.big_box';
$(".mask").mousemove(function(e) {
  var l = e.pageX - $(".small_box").offset().left - ($(".float_layer").width() / 2);
  var t = e.pageY - $(".small_box").offset().top - ($(".float_layer").height() / 2);
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

  console.log(l, t);
  $(".float_layer").css({
    "left": l,
    "top": t
  })
  var pX = (l + $(".float_layer").width() / 2) / ($(".mask").width())
  var pY = (t + $(".float_layer").height() / 2) / ($(".mask").height())
  $(container + " img").css({
    "left": -pX * ($(container + " img").width()) + 75,
    "top": -pY * ($(container + " img").height()) + 75
  })
})
