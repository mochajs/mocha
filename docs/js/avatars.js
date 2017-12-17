(function () {
  'use strict';

  var imageLists = document.querySelectorAll('.image-list');

  Array.prototype.forEach.call(imageLists, function (imageList) {
    var images = imageList.querySelectorAll('img');
    var counter = images.length;

    function onloadHandler() {
      counter -= 1;

      if (counter === 0) {
        imageList.classList.add('is-loaded');
      }
    }

    for (var i = 0; i < images.length; i += 1) {
      images[i].onload = onloadHandler;
    }
  });

}());
