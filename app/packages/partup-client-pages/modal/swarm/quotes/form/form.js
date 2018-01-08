Template.modal_swarm_settings_quotes_form.onCreated(function() {
  let template = this;
  template.authorSelection = new ReactiveVar();
  template.state = new ReactiveDict();
  template.state.set('submitting', false);
  template.charactersLeft = new ReactiveVar(180);
  template.formId = lodash.uniqueId() + 'quoteForm';
  let editForm = template.data.quote ? true : false;

  AutoForm.addHooks(template.formId, {
    onSubmit: function(fields) {
      let self = this;
      self.event.preventDefault();
      template.state.set('submitting', true);

      // set author id from selection in autocomplete
      fields.author_id = template.authorSelection.curValue._id;

      if (editForm) {
        Meteor.call(
          'swarms.update_quote',
          template.data.swarmId,
          template.data.quote._id,
          fields,
          function(err) {
            template.state.set('submitting', false);
            if (err && err.message) {
              Partup.client.notify.error(TAPi18n.__(err.reason));
              return;
            }

            Partup.client.notify.success(
              TAPi18n.__('modal-swarm-quotes-form-updated')
            );
            template.authorSelection.set(false);
            AutoForm.resetForm(self.formId);

            self.done();
            template.data.onAfterUpdate();
          }
        );
      } else {
        Meteor.call('swarms.add_quote', template.data.swarmId, fields, function(
          err
        ) {
          template.state.set('submitting', false);
          if (err && err.message) {
            Partup.client.notify.error(TAPi18n.__(err.reason));
            return;
          }
          Partup.client.notify.success(
            TAPi18n.__('modal-swarm-quotes-form-created')
          );
          template.authorSelection.set(false);
          AutoForm.resetForm(self.formId);

          self.done();
          template.data.onAfterSubmit();
        });
      }

      return false;
    },
  });
});
Template.modal_swarm_settings_quotes_form.onRendered(function() {
  let template = this;
  if (!template.data.quote) return;
  template.subscribe('users.one', template.data.quote.author._id, {
    onReady: function() {
      let selectedAuthor = Meteor.users.findOne(template.data.quote.author._id);
      template.authorSelection.set(selectedAuthor);
    },
  });
});

Template.modal_swarm_settings_quotes_form.events({
  'click [data-remove]': function(event, template) {
    Meteor.call('swarms.remove_quote', this.swarmId, this.quote._id, function(
      err
    ) {
      if (err && err.message) {
        Partup.client.notify.error(TAPi18n.__(err.reason));
        return;
      }
      Partup.client.notify.success(
        TAPi18n.__('modal-swarm-quotes-form-removed')
      );
      template.data.onAfterRemove();
    });
  },
  'click [data-close]': function(event, template) {
    event.preventDefault();
    template.data.resetState();
  },
  'keyup [data-max]': function(event, template) {
    let $inputElement = $(event.currentTarget);
    let max = parseInt($inputElement.attr('maxlength'));
    let charactersLeftVar = $inputElement.data('characters-left-var');
    template[charactersLeftVar].set(max - $inputElement.val().length);
  },
});

Template.modal_swarm_settings_quotes_form.helpers({
  data: function() {
    let template = Template.instance();
    let data = this;
    return {};
  },
  state: function() {
    let template = Template.instance();
    return {
      submitting: function() {
        return template.state.get('submitting');
      },
      charactersLeft: function() {
        return template.charactersLeft.get();
      },
    };
  },
  form: function() {
    let template = Template.instance();
    let data = this;
    return {
      id: function() {
        return template.formId;
      },
      schema: Partup.schemas.forms.swarmQuote,
      doc: function() {
        return {
          author_id: template.data.quote
            ? template.data.quote.author._id
            : undefined,
          content: template.data.quote
            ? template.data.quote.content
            : undefined,
        };
      },
      authorSelectionReactiveVar: function() {
        return template.authorSelection;
      },
      authorLabel: function() {
        return function(author) {
          return author.profile.name;
        };
      },
      authorQuery: function() {
        return function(query, sync, async) {
          Meteor.call('users.upper_autocomplete', query, '', true, function(
            error,
            authors
          ) {
            lodash.each(authors, function(p) {
              p.value = p.profile.name; // what to show in the autocomplete list
            });
            async(authors);
          });
        };
      },
      authorFormvalue: function() {
        return function(author) {
          return author._id;
        };
      },
    };
  },
  static: function() {
    return {
      authorFieldPlaceholder: TAPi18n.__(
        'modal-swarm-quotes-form-author-placeholder'
      ),
      quoteFieldPlaceholder: TAPi18n.__(
        'modal-swarm-quotes-form-quote-placeholder'
      ),
    };
  },
});
