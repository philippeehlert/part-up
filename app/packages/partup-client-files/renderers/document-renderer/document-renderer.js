Template.documentRenderer.helpers({
  files() {
    return Files.find({ _id: { $in: this.documents } });
  },
  getSvgIcon(file) {
    return Partup.helpers.files.getSvgIcon(file);
  },
  bytesToSize(bytes) {
    return Partup.helpers.files.binaryToShortSize(bytes);
  },
});
