$(function () {
  setTimeout(function () {
    var prev;
    var headings = $('h2').map(function (i, el) {
      return {
        top: $(el).offset().top,
        id: el.id
      };
    }).get();

    headings.unshift({top: 0, id: 'content'});

    function closest() {
      var mid = $(window).scrollTop() + ($(window).height() / 2);
      var i = headings.length;
      while (i--) {
        if (mid >= headings[i].top) {
          return headings[i];
        }
      }
    }

    $(document).scroll(function () {
      var heading = closest();
      if (heading) {
        if (prev) {
          prev.removeClass('active');
        }

        prev = $('a[href="#' + heading.id + '"]').addClass('active');
      }
    });
    
    $('a[href="#content"]').addClass('active');
  }, 1000);
});

