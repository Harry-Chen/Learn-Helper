$(function() {
  'use strict';

  $('.folder-list').on('click', function(e) {
    var $el = $(e.target);
    if (!$el.is('.folder > a')) return true;

    var subfolder = $el.siblings('.subfolder');
    if (subfolder.length === 0) {
      return true;
    }
    e.preventDefault();
    $('.folder > .subfolder').slideUp();
    if (!subfolder.is(':visible')) {
      subfolder.slideDown();
    }
  });

  $('#collapse-button').click(function(){
    $('.pane-message').toggle("fast");
    $('.pane-folder').toggle("fast");
    if ($('.pane-content').css("left")=="0px"){
      $('.pane-content').animate({left:'561px'});
    } 
    else{
      $('.pane-content').animate({left:'0px'});
    };
  });

  $('#collapse-button').mouseover(function(){
      $('#collapse-button').css("opacity",1);
  });

  $('#collapse-button').mouseleave(function(){
      $('#collapse-button').delay(1500).animate({opacity:'0.3'});
  });

});
