import autolinker from '../helpers/autolink';

Partup.client.message = function(content) {
  this.content = content;
};

Partup.client.message.prototype.sanitize = function() {
  this.content = Partup.client.sanitize(this.content);
  return this;
};

Partup.client.message.prototype.highlight = function(highlightText) {
  let text = highlightText;
  if (!text.length) return this;
  let highlight = Partup.client.sanitize(text);
  let description = this.content || '';
  let descriptionArray = Partup.client.strings.splitCaseInsensitive(
    description,
    highlight
  );
  if (descriptionArray.length <= 1) return description;
  this.content = descriptionArray.join('<span>' + highlight + '</span>');
  return this;
};

Partup.client.message.prototype.autoLink = function() {
  this.content = autolinker(this.content);
  return this;
};

Partup.client.message.prototype.lineBreakToBr = function() {
  this.content = this.content.replace(/(?:\r\n|\r|\n)/g, '<br />');
  return this;
};

Partup.client.message.prototype.parseMentions = function(options) {
  var options = options || {};
  let link = options.link || false;
  let userId = Meteor.userId();
  if (link) {
    this.content = Partup.helpers.mentions.decodeForChatMessage(
      this.content,
      userId
    );
  }
  if (!link) {
    this.content = Partup.helpers.mentions.decodeForNotification(
      this.content,
      userId
    );
  }
  return this;
};

Partup.client.message.prototype.emojify = function() {
  this.content = Partup.client.strings.emojify(this.content);
  return this;
};

Partup.client.message.prototype.getContent = function() {
  return this.content;
};
