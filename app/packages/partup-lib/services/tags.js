let diff = function diff(array1, array2) {
  return array1.filter(function(i) {
    return array2.indexOf(i) < 0;
  });
};

/**
 @namespace Tags helper service
 @name Partup.services.tags
 @memberof Partup.services
 */
Partup.services.tags = {
  /**
   * Calculate the changes between two tag arrays
   *
   * @memberof services.tags
   * @param {String[]} oldTags
   * @param {String[]} newTags
   */
  calculateChanges: function calculateChanges(oldTags, newTags) {
    let addedTags = diff(newTags, oldTags);
    let removedTags = diff(oldTags, newTags);
    let maxLength = Math.max(addedTags.length, removedTags.length);

    let changes = [];

    for (let i = 0; i < maxLength; i++) {
      let addedTag = addedTags.shift();
      let removedTag = removedTags.shift();
      let change = {};

      // A tag is changed
      if (addedTag && removedTag) {
        change.type = 'changed';
        change.old_tag = removedTag;
        change.new_tag = addedTag;

        // A tag is added
      } else if (!removedTag) {
        change.type = 'added';
        change.new_tag = addedTag;

        // A tag is removed
      } else if (!addedTag) {
        change.type = 'removed';
        change.old_tag = removedTag;
      }

      changes.push(change);
    }

    return changes;
  },

  /**
   * Transform a comma separated string into an array of tags
   *
   * @memberof services.tags
   * @param {String} tags_input
   */
  tagInputToArray: function(tags_input) {
    if (!tags_input) return [];

    let _tags = tags_input.split(',');

    if (_tags.length === 0) return [];

    return _tags
      .map(function(elem) {
        return elem.trim().toLocaleLowerCase();
      })
      .filter(function(elem) {
        return !!elem;
      });
  },

  /**
   * Transform a comma separated string into an array of tags
   *
   * @memberof services.tags
   * @param {String} tags
   */
  tagArrayToInput: function(tags) {
    if (!tags || !tags.length) return '';
    return tags.join(', ');
  },

  /**
   * Store new tags into collection
   *
   * @memberOf services.tags
   * @param {String[]} tags
   */
  insertNewTags: function(tags) {
    if (!tags) return;
    tags.forEach(function(tag) {
      if (!Tags.findOne({ _id: tag })) {
        Tags.insert({ _id: tag });
      }
    });
  },
};
