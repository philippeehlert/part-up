class _MediaUploader {
  constructor(templateCtrl, imagesDoc, documentsDoc, _options) {
    let options = _.defaults(_options, {
      maxPhotos: 4,
      maxDocuments: 2,
    });

    templateCtrl.uploadingPhotos = new ReactiveVar(false);
    templateCtrl.uploadedPhotos = new ReactiveVar(imagesDoc);
    templateCtrl.totalPhotos = new ReactiveVar(0);
    templateCtrl.maxPhotos = options.maxPhotos;
    templateCtrl.submitting = new ReactiveVar(false);
    templateCtrl.uploadingDocuments = new ReactiveVar(false);
    templateCtrl.uploadedDocuments = new ReactiveVar(documentsDoc);
    templateCtrl.totalDocuments = new ReactiveVar(0);
    templateCtrl.maxDocuments = options.maxDocuments;
    templateCtrl.maxMediaItems =
      templateCtrl.maxPhotos + templateCtrl.maxDocuments;

    _.extend(this, templateCtrl);
  }
}

MediaUploader = _MediaUploader;
