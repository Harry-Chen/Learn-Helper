(function($) {
  'use strict';

  function Modal($el, options) {
    var modal = this;
    var closable = options.closable !== false;

    $el
      .addClass('modal')
      .attr({
        role: 'dialog',
        ariaHidden: true
      });

    $el.wrap('<div class="modal-backdrop"/>');
    var $backdrop = $el.parent();
    if (closable) {
      $backdrop.on('click', function(e) {
        if (e.target.className === 'modal-backdrop') {
          modal.hide();
          return false;
        }
      });
    }

    $el.wrapInner('<div class="modal-content"/>');

    var $heading = $(
      '<div class="modal-heading">' +
        (closable ? '<span class="modal-close">&times;</span>' : '') +
        '<h3>' + (options.title || '&nbsp;') + '</h3>' +
      '</div>'
    );
    $heading.find('.modal-close').on('click', function(e) {
      modal.hide();
      return false;
    });
    $el.prepend($heading);

    this.$el = $el;
    this.$backdrop = $backdrop;

    return this;
  };

  Modal.prototype.show = function() {
    this.$el.trigger('show');
    this.$el.attr('aria-hidden', false);

    var that = this;
    this.$backdrop.fadeIn(200, function() {
      that.$el.css('display', 'block')
              .animate({top: '10px', opacity: 1}, 200);
    });
  };

  Modal.prototype.hide = function() {
    this.$el.trigger('hide');
    this.$el.attr('aria-hidden', true)

    var that = this;
    this.$el.animate({top: '-5px', opacity: 0}, 200, function() {
      that.$el.css('display', 'none');
      that.$backdrop.fadeOut(200);
    });
  };

  $.fn.modal = function(cmd, options) {
    var $el;
    for (var i = 0; i < this.length; i += 1) {
      $el = $(this[i]);
      options || (options = {});
      if (typeof cmd === 'object') {
        options = cmd;
        cmd = 'init';
      }

      var modalObj = $el.data('modal');
      if (cmd === 'init') {
        modalObj = new Modal($el, options);
        $el.data('modal', modalObj);
      } else if (modalObj) {
        modalObj[cmd](options);
      }
    }
    return this;
  }
})(jQuery);
