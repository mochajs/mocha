(function() {
  'use strict';

  var imageLists = document.querySelectorAll('.image-list');

  function getListItem(img) {
    var parent = img.parentNode;
    while (parent && parent.nodeName !== 'LI') {
      parent = parent.parentNode;
    }

    return parent;
  }

  function onloadHandler() {
    getListItem(this).classList.add('is-loaded');
  }

  Array.prototype.forEach.call(imageLists, function(imageList) {
    var images = imageList.querySelectorAll('img');

    for (var i = 0; i < images.length; i += 1) {
      if (!images[i].complete) {
        getListItem(images[i]).classList.add('faded-image');
        images[i].onload = onloadHandler;
        images[i].onerror = onloadHandler;
      }
    }
  });
})();
