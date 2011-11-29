
  (function($) {
    return $('#makeSuggestion').click(function() {
      var form, phrase, response;
      form = $('#suggestionForm');
      phrase = $('#phrase').val();
      response = $('#response');
      if (phrase === '') {
        response.addClass('error');
        return response.html('Enter a suggestion, or prepare for EXTERMINATION!');
      } else {
        response.addClass('success');
        $.post("" + (form.attr('action')), {
          phrase: phrase
        }, function(data) {
          response.html(data);
          return response.addClass('successEm').delay(2000).queue(function(next) {
            return response.removeClass('successEm');
          });
        });
        return next();
      }
    });
  })(jQuery);
