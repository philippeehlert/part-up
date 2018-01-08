import { FileUploader } from 'meteor/partup-lib';
// Settings
let MAX_IMAGE_WIDTH = 1500;
let MAX_IMAGE_HEIGHT = 1500;

Partup.client.uploader = {
  /**
   * Upload single image
   *
   * @memberOf Partup.client
   * @param {Object} file
   * @param {Function} callback
   */
  uploadImage: function(file, callback) {
    let img = document.createElement('img');
    let canvas = document.createElement('canvas');
    let self = this;

    let IE = this.isIE();
    let SAFARI = this.isSafari();

    let userId = Meteor.userId();

    if (IE) {
      var reader = new mOxie.FileReader();
    } else {
      var reader = new FileReader();
    }
    reader.onload = function(e) {
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);

    img.onload = function() {
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > height) {
        if (width > MAX_IMAGE_WIDTH) {
          height *= MAX_IMAGE_WIDTH / width;
          width = MAX_IMAGE_WIDTH;
        }
      } else {
        if (height > MAX_IMAGE_HEIGHT) {
          width *= MAX_IMAGE_HEIGHT / height;
          height = MAX_IMAGE_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      let dataUrl;
      if (img.src.indexOf('image/png') > -1) {
        dataUrl = canvas.toDataURL('image/png');
      } else {
        dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      }

      let resizedFile = self.dataURLToBlob(dataUrl);

      if (IE || SAFARI) {
        resizedFile.name = file.name;
        var newFile = new mOxie.File(null, resizedFile);
      } else {
        var newFile = new File([resizedFile], file.name);
      }

      let token = Accounts._storedLoginToken();
      if (IE || SAFARI) {
        var xhr = new mOxie.XMLHttpRequest();
      } else {
        var xhr = new XMLHttpRequest();
      }
      let location = window.location.origin
        ? window.location.origin
        : window.location.protocol +
          '//' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      let url = location + '/images/upload?token=' + token;
      xhr.open('POST', url, true);

      if (IE || SAFARI) {
        var formData = new mOxie.FormData();
      } else {
        var formData = new FormData();
      }
      formData.append('file', newFile);

      var loadHandler = function(e) {
        let data = JSON.parse(xhr.responseText);
        if (data.error) {
          callback(data.error);
          return;
        }
        Meteor.subscribe('images.one', data.image);
        Meteor.autorun(function(computation) {
          let image = Images.findOne({ _id: data.image });
          if (image) {
            computation.stop();
            Tracker.nonreactive(function() {
              callback(null, image);
            });
          }
        });
        xhr.removeEventListener('load', loadHandler);
        xhr.removeEventListener('error', errorHandler);
      };

      var errorHandler = function(e) {
        xhr.removeEventListener('load', loadHandler);
        xhr.removeEventListener('error', errorHandler);
      };

      xhr.addEventListener('load', loadHandler);
      xhr.addEventListener('error', errorHandler);

      xhr.send(formData);
    };
  },

  /**
   * Upload single file
   *
   * @memberOf Partup.client
   * @param {Object} file
   * @param {Function} callback
   */
  uploadFile: function(file, callback) {
    let IE = this.isIE();
    let SAFARI = this.isSafari();
    let newFile = null;
    let xhr = null;
    let formData = null;

    if (IE || SAFARI) {
      newFile = new mOxie.File(null, file);
    } else {
      newFile = new File([file], file.name);
    }

    let token = Accounts._storedLoginToken();
    if (IE || SAFARI) {
      xhr = new mOxie.XMLHttpRequest();
    } else {
      xhr = new XMLHttpRequest();
    }

    let location = window.location.origin
      ? window.location.origin
      : window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    let url = location + '/files/upload?token=' + token;
    xhr.open('POST', url, true);

    if (IE || SAFARI) {
      formData = new mOxie.FormData();
    } else {
      formData = new FormData();
    }

    formData.append('file', newFile);

    var loadHandler = function(e) {
      let data = JSON.parse(xhr.responseText);
      if (data.error) {
        callback(data.error);
        return;
      }
      Meteor.subscribe('files.one', data.file);
      Meteor.autorun(function(computation) {
        let file = Files.findOne({ _id: data.file });
        if (file) {
          computation.stop();
          Tracker.nonreactive(function() {
            callback(null, file);
          });
        }
      });
      xhr.removeEventListener('load', loadHandler);
      xhr.removeEventListener('error', errorHandler);
    };

    var errorHandler = function(e) {
      xhr.removeEventListener('load', loadHandler);
      xhr.removeEventListener('error', errorHandler);
    };

    xhr.addEventListener('load', loadHandler);
    xhr.addEventListener('error', errorHandler);

    xhr.send(formData);
  },

  /**
   * Generic upload
   * determines if it's a file or image and acts accordingly
   * @memberOf Partup.client
   * @param {Object} file
   * @param {Function} callback
   */
  upload: function(file, callback) {
    FileUploader.on(file, {
      image: () =>
        Partup.client.uploader.uploadImage(file, (err, f) =>
          callback(err, f, 'image')
        ),
      file: () =>
        Partup.client.uploader.uploadFile(file, (err, f) =>
          callback(err, f, 'file')
        ),
      error: (err) => callback(err),
    });
  },

  /**
   * Return a blob from dataurl
   *
   * @memberOf Partup.client
   * @param {DataUrl} dataURL dataurl
   */
  dataURLToBlob: function(dataURL) {
    let BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  },

  /**
   * Loop through each file in a file input select event
   *
   * @memberOf Partup.client
   * @param {Object} fileSelectEvent
   * @param {Function} callback
   */
  eachFile: function(fileSelectEvent, callBack) {
    let e = fileSelectEvent.originalEvent || fileSelectEvent;
    let files = e.target.files;

    if (!files || files.length === 0) {
      files = e.dataTransfer ? e.dataTransfer.files : [];
    }

    for (let i = 0; i < files.length; i++) {
      callBack(files[i], i, FileUploader.getFileType(files[i]));
    }
  },

  /**
   * Upload single image by url
   *
   * @memberOf Partup.client
   * @param {String} url
   * @param {Function} callback
   */
  uploadImageByUrl: function(url, callback) {
    Meteor.call('images.insertByUrl', url, function(error, result) {
      if (error || !result) return callback(error);

      Meteor.subscribe('images.one', result._id, function() {
        Meteor.autorun(function(computation) {
          let image = Images.findOne({ _id: result._id });
          if (image) {
            computation.stop();
            Tracker.nonreactive(function() {
              callback(null, image);
            });
          }
        });
      });
    });
  },

  /**
   * Create file input, uses FileReader polyfill for unsupported brwosers
   *
   * @memberOf Partup.client
   * @param {Object} options
   * @param {Element} options.buttonElement
   * @param {Element} options.fileInput
   * @param {Boolean} options.multiple
   */
  create: function(options) {
    let buttonElement = options.buttonElement || null;
    let fileInput = options.fileInput || null;
    let multiple = options.multiple || false;
    let isIE = this.isIE();

    // Temporary solution for the 'MediaUploaderButton' to upload files from the mediauploaderbutton, this works in every browser!
    if (
      options.onFilesAdded &&
      options.onUploadFile &&
      options.onFileUploaded
    ) {
      fileInput = createPlupload(
        buttonElement,
        document.getElementById('uploadwrapper'),
        options.onFilesAdded,
        options.onUploadFile,
        options.onFileUploaded
      );
      fileInput.init();
      return;
    }

    // Old implementation left untouched so I won't break anything.
    if (isIE) {
      fileInput = new mOxie.FileInput({
        browse_button: buttonElement, // or document.getElementById('file-picker')
        accept: [{ title: 'Custom filetype', extensions: 'jpg,jpeg,png' }],

        multiple: multiple, // allow multiple file selection
        runtime_order: 'flash,silverlight,html4,html5',
      });
      fileInput.onchange = function(event) {
        options.onFileChange(event);
      };
      fileInput.init();
    } else {
      buttonElement.addEventListener('click', function(event) {
        event.preventDefault();
        $(fileInput).click();
      });
      fileInput.addEventListener('change', function(event) {
        options.onFileChange(event);
      });
    }
  },
  isIE: function() {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true;
    }

    if (/Edge/.test(navigator.userAgent)) {
      // this is Microsoft Edge
      return true;
    }

    return false;
  },
  isSafari: function() {
    let ua = window.navigator.userAgent;

    let is_chrome = ua.indexOf('Chrome') > -1;
    let is_safari = ua.indexOf('Safari') > -1;

    // Chrome has both "Chrome" and "Safari" in the string.
    // Safari only has "Safari".
    if (is_chrome && is_safari) {
      is_safari = false;
    }

    return is_safari;
  },
};

const createPlupload = function(
  browseButton,
  container,
  filesAddedHandler,
  uploadFileHandler,
  fileUploadedHandler
) {
  const uploader = new plupload.Uploader({
    // runtimes: 'html5,silverlight,flash,html4',
    browse_button: browseButton,
    container: container,
    url: '/', // plupload requires the url to be set when initialized, the url gets set dynamically for each file based on file-type in the BeforeUpload handler
    flash_swf_url: '../uploader/plupload/runtimes/Moxie.swf', // ../../public/files/flash/Moxie.swf',
    silverlight_xap_url: '../uploader/plupload/runtimes/Moxie.xap', // '../../../public/files/silverlight/Moxie.xap',

    filters: {
      max_file_size: Partup.helpers.files.max_file_size,
      prevent_duplicates: true,
      mime_types: [
        {
          title: 'Custom',
          extensions: Partup.helpers.fileUploader.allowedExtensions.ie.join(
            ','
          ),
        },
      ],
    },
    init: {
      FilesAdded: filesAddedHandler,
      BeforeUpload: uploadFileHandler,
      FileUploaded: fileUploadedHandler,
      Error: function(up, error) {
        Partup.client.notify.error(error.message);
      },
    },
  });
  return uploader;
};
