Partup.client.verySpecificHelpers = {
  setReactiveVarToBoolValueIfFalseAfterDelay: function(
    bool,
    reactiveVar,
    delay
  ) {
    if (!bool) {
      Meteor.setTimeout(function() {
        reactiveVar.set(bool);
      }, delay);
    } else {
      reactiveVar.set(bool);
    }
  },
};
