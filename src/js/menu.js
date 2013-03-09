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

});
