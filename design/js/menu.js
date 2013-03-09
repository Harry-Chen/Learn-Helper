(function() {
  'use strict';

  $('.folder > a').on('click', function(e) {
    var $this = $(this);
    var subfolder = $this.siblings('.subfolder');
    if (subfolder.length === 0) {
      return true;
    }
    e.preventDefault();
    $('.folder > .subfolder').slideUp();
    if (!subfolder.is(':visible')) {
      subfolder.slideDown();
    }
  });

})();
