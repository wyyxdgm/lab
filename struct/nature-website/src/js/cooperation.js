$(document).ready(function() {
  console.log('page cooperation loaded');
  var $dialog = $('.dialogs .dialog-job-info').modal();
  $dialog.on('click', '.js-close-dialog', function(e) {
    e.preventDefault();
    $dialog.modal('close');
    $('.close_dialog_layer').hide();
  });
  $('.js-apply').on('click', function(e) {
    e.preventDefault();
    $dialog.modal('open');
    $('.close_dialog_layer').show();
  });
  $('.close_dialog_layer').on('click', function(e) {
    e.preventDefault();
    $dialog.modal('close');
    $('.close_dialog_layer').hide();
  });


  function initManager() {
    var $dialog = $('.dialogs .dialog-manager-info').modal();
    $dialog.on('click', '.js-close-dialog', function(e) {
      e.preventDefault();
      $dialog.modal('close');
    });
    $('.js-apply-coop').on('click', function(e) {
      e.preventDefault();
      $dialog.modal('open');
    });
  }
  initManager();



  button = document.querySelector('.button.apply');

  button.addEventListener('mouseup', function() {
    this.classList.add('active');
    setTimeout(function() {
      button.classList.remove('active');
    }, 300);
  });
})
