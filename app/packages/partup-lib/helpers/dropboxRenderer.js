let DropboxRenderer = function() {
  return {
    createPreviewLinkFromDirectLink: createPreviewLinkFromDirectLink,
  };

  function getFileIdFromDirectLink(fileUrl) {
    let matchViewPath = fileUrl.match(/view\/(\w+)/);
    let matchSPath = fileUrl.match(/s\/(\w+)/);

    if (matchViewPath) {
      return matchViewPath[1];
    } else if (matchSPath) {
      return matchSPath[1];
    }

    // return un-existing id for fallback
    return new Meteor.Collection.ObjectID()._str;
  }

  function createPreviewLinkFromDirectLink(directLinkUrl, fileName) {
    let fileId = getFileIdFromDirectLink(directLinkUrl);
    return 'https://www.dropbox.com/s/' + fileId + '/' + fileName + '?dl=0';
  }
};

Partup.helpers.DropboxRenderer = DropboxRenderer;
