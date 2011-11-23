(function() {
  (function($) {
    return $('#generate').click(function() {
      var multiplier, pTags, paragraphs;
      multiplier = $('#exterminateMultiplier option:selected').text();
      paragraphs = $('#numParagraphs option:selected').text();
      pTags = !$('#exterminatePTags').is(":checked");
      $('#ipsumText').val('');
      $.ajaxSetup({
        cache: false
      });
      return $.getJSON("/text/" + multiplier + "/" + paragraphs + "/" + pTags, function(data) {
        return $('#ipsumText').val(data.text);
      });
    });
  })(jQuery);
}).call(this);
