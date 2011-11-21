(function() {
  (function($) {
    $('a').click(function() {
      return $(this).addClass('clicked').delay(300).queue(function(next) {
        $(this).removeClass('clicked');
        return next();
      });
    });
    return $('#generate').click(function() {
      var multiplier, paragraphs;
      multiplier = $('#exterminateMultiplier option:selected').text();
      paragraphs = $('#numParagraphs option:selected').text();
      $.ajaxSetup({
        cache: false
      });
      return $.getJSON("/text/" + multiplier + "/" + paragraphs, function(data) {
        return $('#ipsumText').val(data.text);
      });
    });
  })(jQuery);
}).call(this);
