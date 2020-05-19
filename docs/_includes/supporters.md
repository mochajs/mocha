## Sponsors

Use Mocha at Work? Ask your manager or marketing team if they'd help [support](https://opencollective.com/mochajs#support) our project. Your company's logo will also be displayed on [npmjs.com](http://npmjs.com/package/mocha) and our [GitHub repository](https://github.com/mochajs/mocha#sponsors).

<ul class="image-list" id="sponsors">
{%- for supporter in supporters.sponsors -%}
  <li>
    {%- if supporter.website -%}
    <a href="{{ supporter.website }}" target="_blank" rel="noopener" title="{{ supporter.name }}">
    {%- endif -%}
      <img src="{{ supporter.avatar }}" width="{{ supporter.dimensions.width }}" height="{{ supporter.dimensions.height }}" alt="{{ supporter.name }}" />
    {%- if supporter.website -%}
    </a>
    {%- endif -%}
  </li>
{%- endfor -%}
</ul>

## Backers

Find Mocha helpful? Become a [backer](https://opencollective.com/mochajs#support) and support Mocha with a monthly donation.

<ul class="image-list faded-images" id="backers">
{%- for supporter in supporters.backers -%}
  <li>
    {%- if supporter.website -%}
    <a href="{{ supporter.website }}" target="_blank" rel="noopener" title="{{ supporter.name }}">
    {%- endif -%}
      <img src="{{ supporter.avatar }}" alt="{{ supporter.name }}" />
    {%- if supporter.website -%}
    </a>
    {%- endif -%}
  </li>
{%- endfor -%}
</ul>

<script>
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
</script>
