Partup.client.chat = {
  _chat_timekeeper: new ReactiveDict(),
  _current_chat: undefined,
  MAX_TYPING_PAUSE: 5000, // 5s
  initialize: function(template) {
    this._current_chat = template;
  },
  destroy: function() {
    this._chat_timekeeper.clear();
    this._current_chat = undefined;
  },
  instantlyScrollToBottom: function() {
    if (!this._current_chat) return;

    this._current_chat.instantlyScrollToBottom();
  },
  onNewMessageRender: function(cb) {
    if (!this._current_chat) return;

    this._current_chat.onNewMessageRender(cb);
  },
  showingContext: false,
  showMessageContext: function(message) {
    let self = this;
    if (!self._current_chat) return;

    $('.pu-state-highlight').removeClass('pu-state-highlight');

    let getElementTop = function() {
      let top = 0;
      let element = $('[data-pu-reversed-scroller]')[0];
      if (!element) return false;
      while (element !== document.body) {
        top += element.offsetTop;
        element = element.offsetParent;
      }
      return top;
    };

    setTimeout(function() {
      if (!self._current_chat) return;
      window.location.hash = message._id;
      let $msg = $('[data-chat-message-id=' + message._id + ']');
      let $scroller = $('[data-pu-reversed-scroller]')[0];
      $msg.addClass('pu-state-highlight');
      $scroller.scrollTop =
        $scroller.scrollHeight / 2 - $scroller.clientHeight / 2;
      self._current_chat.activeContext.set(message);
      self.showingContext = true;
    }, 100);
  },
  clearMessageContext: function() {
    if (!this._current_chat) return;

    if (!this._current_chat.activeContext.curValue) return;

    if (this._current_chat.data.config.onClearContext) {
      this._current_chat.data.config.onClearContext('');
    }

    $('.pu-state-highlight').removeClass('pu-state-highlight');
    this._current_chat.activeContext.set(false);
    this.showingContext = false;
    if ($('[data-search]').length) $('[data-search]').val('');
    Partup.client.window.clearUrlHash();
    this._current_chat.instantlyScrollToBottom();
  },
};
