(function() {
  /*
   * GET home page.
  */  exports.index = function(req, res) {
    return res.render('index', {
      title: 'Dalek Ipsum!'
    });
  };
}).call(this);
