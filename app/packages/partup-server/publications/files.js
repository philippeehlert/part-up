/**
 * Publish a file
 *
 * @param {String} fileId
 */
Meteor.publish('files.one', function(fileId) {
    check(fileId, String);

    this.unblock();

    return Files.find({_id: fileId}, {limit: 1});
});
