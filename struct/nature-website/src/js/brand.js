$(document).ready(function() {
  console.log('page brand loaded');

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
      triggerElement: '.section-1',
      offset: -200 // start this scene after scrolling for 50px
    })
    .setTween(".abo", { y: -250, ease: Linear.easeNone })
    // .setPin('.years') // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller

  // create a scene
  new ScrollMagic.Scene({
      duration: 800, // the scene should last for a scroll distance of 100px
      triggerElement: '.section-2 .images-container',
      offset: -200 // start this scene after scrolling for 50px
    })
    .setTween(".c3", { y: -250, ease: Linear.easeNone })
    // .setPin('.years') // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller

  // create a scene
  new ScrollMagic.Scene({
      duration: 800, // the scene should last for a scroll distance of 100px
      triggerElement: '.section-5 .images-container',
      offset: -200 // start this scene after scrolling for 50px
    })
    .setTween(".icon-995", { y: -250, ease: Linear.easeNone })
    // .setPin('.years') // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller




})
