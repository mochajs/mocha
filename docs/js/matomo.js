// don't trigger analytics for local development environments
if (document.domain.indexOf('mochajs.org') >= 0) {
  // don't know if this must be a global variable
  var _paq = _paq || [];
  // subdomain tracking support, e.g., next.mochajs.org vs. mochajs.org
  _paq.push(['setDocumentTitle', document.domain + '/' + document.title]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['trackPageView']);
  (function() {
    var u = 'https://mochajs.matomo.cloud/';
    _paq.push(['setTrackerUrl', u + 'piwik.php']);
    _paq.push(['setSiteId', '1']);
    var d = document;
    var g = d.createElement('script');
    var s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.defer = true;
    g.src = u + 'piwik.js';
    s.parentNode.insertBefore(g, s);
  })();
}
