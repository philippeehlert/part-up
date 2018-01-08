import * as Autolinker from './Autolinkjs';

let autolinker = function(text) {
  return Autolinker.link(text, {
    hashtag: false, // do not parse hashtags
    phone: false, // i've set this to false, because it does not work with dutch phone-number formatting
    newWindow: true, // target="_blank"
    truncate: 50, // max length displayed
    stripPrefix: true, // strip http:// etc
    className: 'pu-external-url',
    // this replacefunction is for emails only
    // autolinker will put a target="_blank" on all urls
    // if newWindow is true
    replaceFn: function(match) {
      let type = match.getType();
      if (type === 'email') {
        let email = match.getEmail();
        return (
          '<a href="mailto:' +
          email +
          '" class="pu-external-url" rel="nofollow">' +
          email +
          '</a>'
        );
      }
      let tag = match.buildTag(); // returns an Autolinker.HtmlTag instance
      tag.setAttr('rel', 'nofollow');
      return tag;
    },
  });
};
// full documentation for Autolinker at http://gregjacobs.github.io/Autolinker.js/docs/#!/api/Autolinker
Template.registerHelper('partupAutolink', function(text) {
  return autolinker(text);
});

Template.registerHelper('partupHighlight', function(message, highlightText) {
  let text = highlightText;
  if (!text.length) return message;
  let highlight = Partup.client.sanitize(text);
  let description = message || '';
  let descriptionArray = Partup.client.strings.splitCaseInsensitive(
    description,
    highlight
  );
  if (descriptionArray.length <= 1) return description;
  let outputText = descriptionArray.join('<span>' + highlight + '</span>');
  return outputText;
});

export default autolinker;
