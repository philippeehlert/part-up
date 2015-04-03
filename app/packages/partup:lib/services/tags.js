var diff = function diff (array1, array2) {
    return array1.filter(function(i) { return array2.indexOf(i) < 0; });
};

/**
 @namespace Tags helper service
 @name Partup.services.tags
 @memberOf partup.services
 */
Partup.services.tags = {

    /**
     * Calculate the changes between two tag arrays
     *
     * @memberOf services.tags
     * @param {String[]} oldTags
     * @param {String[]} newTags
     */
    calculateChanges: function calculateChanges(oldTags, newTags) {
        var addedTags = diff(newTags, oldTags);
        var removedTags = diff(oldTags, newTags);
        var maxLength = Math.max(addedTags.length, removedTags.length);

        var changes = [];

        for (var i = 0; i < maxLength; i++) {
            var addedTag = addedTags.shift();
            var removedTag = removedTags.shift();
            var change = {};

            // A tag is changed
            if (addedTag && removedTag) {
                change.type = 'changed';
                change.old_tag = removedTag;
                change.new_tag = addedTag;
            }

            // A tag is added
            else if (! removedTag) {
                change.type = 'added';
                change.new_tag = addedTag;
            }

            // A tag is removed
            else if (! addedTag) {
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
     * @memberOf services.tags
     * @param {String} tags_input
     */
    tagInputToArray: function(tags_input) {
        var _tags = tags_input.split(',');
        if (_tags.length > 0) {
            return _tags.map(function(elem) {
                return elem.trim();
            }).filter(function(elem) {
                return !!elem;
            });
        } else {
            return [];
        }
    }

};
