let GoogleDriveRenderer = function() {
  return {
    createPreviewLinkFromDirectLink: createPreviewLinkFromDirectLink,
  };

  function createPreviewLinkFromDirectLink(directLinkUrl) {
    return directLinkUrl;
  }
};

Partup.helpers.GoogleDriveRenderer = GoogleDriveRenderer;
