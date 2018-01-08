Template.registerHelper('isIEorEdge', function() {
  let ua = window.navigator.userAgent;
  let msie = ua.indexOf('MSIE ');

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    return true;
  }

  if (/Edge/.test(navigator.userAgent)) {
    // this is Microsoft Edge
    return true;
  }

  return false;
});
