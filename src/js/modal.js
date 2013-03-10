(function($) {
  'use strict';

  function Modal($el) {
    var modal = this;

    $el
      .addClass('modal')
      .attr({
        role: 'dialog',
        ariaHidden: true
      });

    $el.wrap('<div class="modal-backdrop"/>');
    var $backdrop = $el.parent();
    $backdrop.on('click', function(e) {
      if (e.target.className === 'modal-backdrop' && modal.options.closable) {
        modal.hide();
        return false;
      }
    });

    $el.wrapInner('<div class="modal-content"/>');

    var $heading = $(
      '<div class="modal-heading">' +
        '<span class="modal-close">&times;</span>' +
        '<h3></h3>' +
      '</div>'
    );
    $heading.find('.modal-close').on('click', function(e) {
      if (modal.options.closable) {
        modal.hide();
      }
      return false;
    });
    $el.prepend($heading);

    this.$el = $el;
    this.$backdrop = $backdrop;
    this.options = {
      closable: true,
      title: '&nbsp;'
    };

    return this;
  };

  Modal.prototype.config = function(options) {
    if ('closable' in options) {
      this.options.closable = options.closable;
    }
    if ('title' in options) {
      this.options.title = options.title;
    }
  };

  Modal.prototype.show = function() {
    this.$el.trigger('show');
    this.$el.attr('aria-hidden', false);
    this.$el.find('.modal-close')[this.options.closable ? 'show' : 'hide']();
    this.$el.find('.modal-heading > h3').html(this.options.title);

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
        cmd = 'config';
      }

      var modalObj = $el.data('modal');
      if (!modalObj) {
        modalObj = new Modal($el);
        $el.data('modal', modalObj);
      }
      modalObj[cmd](options);
    }
    return this;
  }
})(jQuery);
