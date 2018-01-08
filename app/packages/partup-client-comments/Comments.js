import { strings } from 'meteor/partup-client-base';

// jscs:disable
/**
 * Widget to render comments and a comment field
 *
 * @module client-commentfield
 * @param {Object} update               The update object containing the comments
 * @param {Number} LIMIT                Limit the amount of comments shown to this number, then add "show more" link
 * @param {Boolean} SHOW_COMMENTS       Show existing comments
 *
 */
// jscs:enable

/** ***********************************************************/
/* Widget rendered */
/** ***********************************************************/
Template.Comments.onCreated(function() {
  let template = this;

  // template states
  template.submittingForm = new ReactiveVar(false);
  template.expanded = new ReactiveVar(false);
  template.submitButtonActive = new ReactiveVar(false);
  template.showCommentClicked = new ReactiveVar(false);
  template.showSystemMessages = new ReactiveVar(false);

  template.LIMIT = template.data.LIMIT || 0;
  template.showComments =
    template.data.SHOW_COMMENTS === undefined ||
    template.data.SHOW_COMMENTS === true;
  template.messageRows = new ReactiveVar(1);
  template.tooManyCharacters = new ReactiveVar(false);
  template.tooManyUpdateCharacters = new ReactiveVar(false);

  template.updateMessageRows = new ReactiveVar(1);
  template.currentEditCommentId = new ReactiveVar();

  template.currentComment = new ReactiveVar();
  template.uniqueId = _.uniqueId();
  template.formId =
    template.uniqueId + 'commentForm-' + template.data.update._id;

  template.resetEditCommentForm = function() {
    if (template.mentionsEditInput) template.mentionsEditInput.destroy();
    template.currentEditCommentId.set(false);
  };

  let updateId = template.data.update._id;
  template.removeComment = function(commentId) {
    Partup.client.prompt.confirm({
      title: 'Please confirm',
      message:
        'Do you really want to remove this comment? This action cannot be undone.',
      onConfirm: function() {
        template.resetEditCommentForm();

        Meteor.call('updates.comments.remove', updateId, commentId, function(
          error,
          result
        ) {
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('error-method-' + error.reason)
            );
          }
          Partup.client.notify.success('Comment removed');
        });
      },
    });
  };
});

Template.Comments.onRendered(function() {
  let template = this;
  template.list = template.find('[data-comments-container]');
  template.input = template.find('[name=content]');
  let partupId = template.data.update.partup_id;
  template.mentionsInput = Partup.client.forms.MentionsInput(template.input, {
    partupId: partupId,
  });
  Partup.client.elements.onClickOutside(
    [template.list],
    template.resetEditCommentForm
  );
});

Template.afFieldInput.onRendered(function() {
  // makes sure it only goes on if it's a mentions input
  if (!this.data.hasOwnProperty('data-update-comment')) return;

  // comment template
  let template = this.parent();
  let currentComment = template.currentComment.get();

  // destroy other edit mentionsinputs to prevent conflicts
  if (template.mentionsEditInput) template.mentionsEditInput.destroy();

  let input = template.find('[data-update-comment]');
  template.mentionsEditInput = Partup.client.forms.MentionsInput(input, {
    partupId: template.data.update.partup_id,
    autoFocus: true,
    autoAjustHeight: true,
    prefillValue: currentComment,
  });
});

Template.Comments.onDestroyed(function() {
  let template = this;
  // destroy all evil memory leaks
  if (template.mentionsInput) template.mentionsInput.destroy();
  if (template.mentionsEditInput) template.mentionsEditInput.destroy();
  Partup.client.elements.offClickOutside(template.resetEditCommentForm);
});

Template.Comments.helpers({
  // state helpers
  state: function() {
    let self = this;
    let template = Template.instance();
    let data = Template.currentData();
    return {
      submitButtonActive: function() {
        return template.submitButtonActive.get();
      },
      commentFormId: function() {
        return template.uniqueId + 'commentForm-' + data.update._id;
      },
      showComments: function() {
        return template.showComments;
      },
      submittingForm: function() {
        return template.submittingForm.get();
      },
      messageRows: function() {
        return template.messageRows.get();
      },
      updateMessageRows: function() {
        return template.updateMessageRows.get();
      },
      messageTooLong: function() {
        return template.tooManyCharacters.get();
      },
      updateMessageTooLong: function() {
        return template.tooManyUpdateCharacters.get();
      },
      editCommentId: function() {
        return template.currentEditCommentId.get();
      },
      showCommentBox: function() {
        let authorized = Meteor.user();
        if (!authorized) return false;

        let motivation = get(template, 'data.type') === 'motivation';
        if (motivation) return true;

        let clicked =
          self.showCommentClicked || template.showCommentClicked.get();
        if (self.FULLVIEW) {
          // This caused an IE bug where one could not unfocus the focused input.
          // update detail
          return true;
        } else {
          // partup detail
          return clicked || self.update.comments_count;
          // return clicked !== undefined ? clicked : self.update.comments_count;
        }
      },
      commentCount: function() {
        let allComments = self.update.comments || [];
        return lodash.reject(allComments, 'type', 'system').length;
      },
      systemCount: function() {
        let allComments = self.update.comments || [];
        return lodash.filter(allComments, 'type', 'system').length;
      },
      showSystemMessages: function() {
        return template.showSystemMessages.get();
      },
    };
  },
  // data helpers
  data: function() {
    let self = this;
    let template = Template.instance();
    return {
      shownComments: function() {
        if (!self.update) return [];
        let allComments = self.update.comments || [];
        let comments;
        let showSystemMessages = template.showSystemMessages.get();
        if (showSystemMessages) {
          comments = allComments;
        } else {
          comments = lodash.reject(allComments, 'type', 'system');
        }

        let commentsExpanded = template.expanded.get();
        if (commentsExpanded) return comments;

        let limit = template.LIMIT;
        if (!limit) return comments;

        return comments.slice(-limit);
      },
    };
  },
  // placeholders namespace
  placeholders: {
    comment: function() {
      return TAPi18n.__('widgetcommentfield-comment-placeholder');
    },
  },
  updateCommentId: function() {
    return 'updateCommentForm-' + this._id;
  },
  formSchema: Partup.schemas.forms.updateComment,
  content: function() {
    return Partup.client.strings.emojify(
      Partup.helpers.mentions.decode(Partup.client.sanitize(this.content))
    );
  },
  systemMessage: function(content) {
    return TAPi18n.__('comment-field-content-' + content);
  },
  isSystemMessage: function() {
    return this.type === 'system' || this.system;
  },
  isMotivation: function() {
    return this.type === 'motivation';
  },
  partup: function() {
    return Partups.findOne(this.update.partup_id);
  },
  newComments: function(upper_data) {
    upper_data = upper_data.hash.upper_data;
    let newComments = [];
    upper_data.forEach(function(upperData) {
      if (upperData._id === Meteor.userId()) {
        newComments = upperData.new_comments;
      }
    });
    return newComments.length;
  },
  imageForComment: function() {
    let commentImage = Images.findOne(this.creator.image);
    if (commentImage) {
      return this.creator.image;
    } else {
      commentUser = Meteor.users.findOne(this.creator._id);
      if (commentUser) {
        return commentUser.profile.image;
      } else {
        return '';
      }
    }
  },
  isUserComment: function() {
    return this.creator._id === Meteor.userId() ? 'data-comment' : '';
  },
  commentDoc: function() {
    return {
      content: this.content, // needs to be decoded for input
    };
  },
  autoLink() {
    return function(content) {
      return Partup.client.strings.autoLinkHTML(content);
    };
  },
});

Template.Comments.events({
  'click [data-expand-comments]': function(event, template) {
    event.preventDefault();
    let updateId = this.update._id;
    let proceed = function() {
      template.showCommentClicked.set(true);

      Meteor.defer(function() {
        let commentForm = template.find('[id$=commentForm-' + updateId + ']');
        let field = lodash.find(commentForm, { name: 'content' });
        if (field) field.focus();
      });
    };
    if (Meteor.user()) {
      proceed();
    } else {
      Intent.go({ route: 'login' }, function() {
        if (Meteor.user()) {
          proceed();
        } else {
          this.back();
        }
      });
    }
  },
  'click [data-toggle-systemmessages]': function(event, template) {
    event.preventDefault();
    template.showSystemMessages.set(!template.showSystemMessages.get());
  },
  'keyup [data-commentfield]': function(event, template) {
    let totalCharacters = event.currentTarget.value.length;
    if (totalCharacters > 1000) {
      template.tooManyCharacters.set(true);
    } else {
      template.tooManyCharacters.set(false);
    }
    if ([8, 46].indexOf(event.keyCode) > -1) {
      AutoForm.validateForm(
        template.uniqueId + 'commentForm-' + template.data.update._id
      );
    }
  },
  'keyup [data-update-comment]': function(event, template) {
    let updateCommentFormId = $(event.currentTarget).data('update-comment');
    let totalCharacters = event.currentTarget.value.length;
    if (totalCharacters > 1000) {
      template.tooManyUpdateCharacters.set(true);
    } else {
      template.tooManyUpdateCharacters.set(false);
    }
    if ([8, 46].indexOf(event.keyCode) > -1) {
      AutoForm.validateForm(updateCommentFormId);
    }
  },
  'keydown [data-submit=return]': function(event, template) {
    // get form id
    let formId = $(event.currentTarget)
      .closest('form')
      .attr('id');
    // split from id to get form type and update or comment id
    let formNameParts = formId.split('-');

    // determine keycode (with cross browser compatibility)
    let pressedKey = event.which ? event.which : event.keyCode;

    // check if it's the 'return' key and if shift is NOT held down
    if (pressedKey == 13 && !event.shiftKey) {
      event.preventDefault();

      if (template.submittingForm.get()) return false;

      let value = event.currentTarget.value;
      // call remove comment method if there's no value
      if (
        !value &&
        (formNameParts.length === 2 && formNameParts[0] === 'updateCommentForm')
      ) {
        template.removeComment(formNameParts[1]);
      } else {
        $(event.currentTarget)
          .closest('form')
          .submit();
      }
    }
  },
  // textarea height manipulators
  'input [data-commentfield]': function(event, template) {
    template.submitButtonActive.set(!!event.currentTarget.value);
    if (event.currentTarget.offsetHeight < event.currentTarget.scrollHeight) {
      template.messageRows.set(template.messageRows.get() + 1);
    }
  },
  'input [data-update-comment]': function(event, template) {
    if (event.currentTarget.offsetHeight < event.currentTarget.scrollHeight) {
      template.updateMessageRows.set(template.updateMessageRows.get() + 1);
    }
  },
  // edit comment
  'dblclick [data-comment], click [data-edit-comment]': function(
    event,
    template
  ) {
    event.preventDefault();
    template.currentEditCommentId.set(this._id);
    template.currentComment.set(this.content);
  },
  // remove comment
  'click [data-remove-comment]': function(event, template) {
    event.preventDefault();
    let commentId = this._id;
    template.removeComment(commentId);
  },
});

AutoForm.addHooks(null, {
  onSubmit: function(insertDoc) {
    let self = this;
    let formNameParts = self.formId.split('-');
    let template = self.template.parent();
    // abort if it's the wrong form
    if (
      formNameParts.length !== 2 ||
      (formNameParts[0] !== 'updateCommentForm' &&
        formNameParts[0] !== template.uniqueId + 'commentForm')
    ) {
      return false;
    }
    self.event.preventDefault();

    // the parent of the autoform
    // var template = self.template.parent();
    let formId = template.formId;

    // change form state
    template.submittingForm.set(true);

    if (formId !== self.formId) {
      // get comment id from the formId
      let commentId = formNameParts[1];
      // get update id from update object in the comment
      var updateId = template.data.update._id;

      // get the value from the mentionsinput
      insertDoc.content = template.mentionsEditInput.getValue();

      Meteor.call(
        'updates.comments.update',
        updateId,
        commentId,
        insertDoc,
        function(error, result) {
          if (error) {
            return Partup.client.notify.error(
              TAPi18n.__('error-method-' + error.reason)
            );
          }
          if (result && result.warning) {
            Partup.client.notify.warning(
              TAPi18n.__('warning-' + result.warning)
            );
          }
          // reset states
          template.updateMessageRows.set(1);
          template.mentionsEditInput.destroy();
          template.mentionsEditInput.reset();
          template.currentEditCommentId.set(false);
          template.tooManyUpdateCharacters.set(false);
          template.submittingForm.set(false);
          self.done();
        }
      );
    } else {
      var updateId = formNameParts[1]; // gets update id from the formId

      if (template.data.type === 'motivation') {
        insertDoc.type = 'motivation';
      }

      // get the value from the mentionsinput
      insertDoc.content = template.mentionsInput.getValue();

      if (template.data.POPUP) {
        Partup.client.popup.close({
          success: true,
          comment: insertDoc,
        });
        return false;
      }
      AutoForm.resetForm(self.formId); // reset form before call is successfull
      template.mentionsInput.reset();
      Partup.client.updates.addUpdateToUpdatesCausedByCurrentuser(updateId);

      Meteor.call('updates.comments.insert', updateId, insertDoc, function(
        error,
        result
      ) {
        template.submittingForm.set(false);
        if (error) {
          return Partup.client.notify.error(
            TAPi18n.__('error-method-' + error.reason)
          );
        }
        if (result.warning) {
          Partup.client.notify.warning(TAPi18n.__('warning-' + result.warning));
        }

        template.messageRows.set(1);
        template.tooManyCharacters.set(false);
        template.tooManyUpdateCharacters.set(false);

        template.submitButtonActive.set(false);
        self.done();
      });
    }

    return false;
  },
});
