(function() {
  'use strict';

  window.setLoading = function(progress, selector) {
    var $container = $(selector);
    var $loading = $container.find('.loading');
    if ($loading.length === 0) {
      $loading = $('<div class="loading" />');
      $loading.appendTo($container);
    }
    if (progress >= 0 && progress < 1.0) {
      $container.addClass('is-loading');
      $loading.addClass('is-visible');
      $loading.css('font-size', (progress * 100).toFixed(0) + 'px');
    } else {
      $container.removeClass('is-loading');
      $loading.removeClass('is-visible');
      $loading.css('font-size', '100px');
    }
  }

})();
