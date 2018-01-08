Partup.client.element = {
  hasAttr: function(element, attribute) {
    let attr = $(element).attr(attribute);
    return !!(typeof attr !== typeof undefined && attr !== false);
  },
};
