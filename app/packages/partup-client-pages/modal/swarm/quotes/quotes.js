Template.modal_swarm_settings_quotes.onCreated(function() {
  let template = this;

  template.quotes = new ReactiveVar([]);
  template.editing = new ReactiveVar(false);
  template.quotesMax = 3;
});

Template.modal_swarm_settings_quotes.onRendered(function() {
  let template = this;
  let maxQuotes = 3;
  template.autorun(function() {
    let swarm = Swarms.findOne({ slug: template.data.slug });
    if (swarm) {
      let quotes = swarm.quotes || [];
      lodash.times(maxQuotes - quotes.length, function() {
        quotes.push(false);
      });
      template.quotes.set(quotes);
    }
  });
});

Template.modal_swarm_settings_quotes.helpers({
  data: function() {
    let template = Template.instance();
    let swarm = Swarms.findOne({ slug: template.data.slug });
    if (!swarm) return false;
    return {
      swarm: function() {
        return swarm;
      },
      quotes: function() {
        return template.quotes.get();
      },
      quotesLeft: function() {
        return template.quotesMax - swarm.quotes.length;
      },
    };
  },
  form: function() {
    let template = Template.instance();
    return {
      quotesMax: function() {
        return template.quotesMax;
      },
    };
  },
  state: function() {
    let template = Template.instance();
    return {
      editing: function() {
        return template.editing.get();
      },
      onEdit: function() {
        return function() {
          template.editing.set(true);
          Meteor.defer(function() {
            template.editing.set(false);
          });
        };
      },
    };
  },
});
