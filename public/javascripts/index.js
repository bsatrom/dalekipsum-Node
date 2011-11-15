(function() {
  (function($) {
    return $('a').click(function() {
      return $(this).addClass('clicked').delay(300).queue(function(next) {
        $(this).removeClass('clicked');
        return next();
      });
    });
  })(jQuery);
}).call(this);
