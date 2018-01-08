if (!Partup) {
  Partup = {
    helpers: {
      fileUploader: {},
    },
  };
}

Partup.helpers.fileUploader = {};

Partup.helpers.fileUploader.imageExtensions = [
  '.gif',
  '.jpg',
  '.jpeg',
  '.png',
  '.GIF',
  '.JPG',
  '.JPEG',
  '.PNG',
];
Partup.helpers.fileUploader.docExtensions = [
  '.doc',
  '.docx',
  '.rtf',
  '.pages',
  '.txt',
  '.DOC',
  '.DOCX',
  '.RTF',
  '.PAGES',
  '.TXT',
];
Partup.helpers.fileUploader.pdfExtensions = ['.pdf', '.PDF'];
Partup.helpers.fileUploader.presentationExtensions = [
  '.pps',
  '.ppsx',
  '.ppt',
  '.pptx',
  '.PPS',
  '.PPSX',
  '.PPT',
  '.PPTX',
];
Partup.helpers.fileUploader.fallbackFileExtensions = [
  '.ai',
  '.bmp',
  '.eps',
  '.psd',
  '.tiff',
  '.tif',
  '.svg',
  '.key',
  '.keynote',
  '.AI',
  '.BMP',
  '.EPS',
  '.PSD',
  '.TIFF',
  '.TIF',
  '.SVG',
  '.KEY',
  '.KEYNOTE',
];
Partup.helpers.fileUploader.spreadSheetExtensions = [
  '.xls',
  '.xlsx',
  '.numbers',
  '.csv',
  '.XLS',
  '.XLSX',
  '.NUMBERS',
  '.CSV',
];

Partup.helpers.fileUploader.allowedExtensions = {
  images: Partup.helpers.fileUploader.imageExtensions,
  docs: _.flatten([
    Partup.helpers.fileUploader.pdfExtensions,
    Partup.helpers.fileUploader.docExtensions,
    Partup.helpers.fileUploader.presentationExtensions,
    Partup.helpers.fileUploader.fallbackFileExtensions,
    Partup.helpers.fileUploader.spreadSheetExtensions,
  ]),
};

Partup.helpers.fileUploader.allowedExtensions.all = lodash.flatten([
  Partup.helpers.fileUploader.allowedExtensions.images,
  Partup.helpers.fileUploader.allowedExtensions.docs,
]);

// IE requires the filetypes without "."
Partup.helpers.fileUploader.allowedExtensions.ie = lodash.flatten([
  Partup.helpers.fileUploader.allowedExtensions.images.map((filetype) =>
    filetype.replace(/\./g, '')
  ),
  Partup.helpers.fileUploader.allowedExtensions.docs.map((filetype) =>
    filetype.replace(/\./g, '')
  ),
]);

Partup.helpers.fileUploader.getAllExtensions = function() {
  return _.chain(Partup.helpers.fileUploader.allowedExtensions)
    .keys()
    .map(function(type) {
      return Partup.helpers.fileUploader.allowedExtensions[type];
    })
    .flatten()
    .value();
};

function matchExtension(fileName) {
  return fileName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/);
}

/**
 * Get the extension from filename
 *
 * @param {string} fileName filename.ext (e.g. filename.docx)
 * @returns {string} extension like .docx
 */
Partup.helpers.fileUploader.getExtensionFromFileName = function(fileName) {
  let match = matchExtension(fileName);
  if (match) {
    return match[0];
  }
  // if file.name does not have .[ext] return a default doc
  return _.sample(Partup.helpers.fileUploader.fallbackFileExtensions);
};

/**
 * Check whether the filename is a Doc type defined by the allowedExtensions array
 *
 * @param {string} fileName
 * @returns {boolean}
 */
Partup.helpers.fileUploader.fileNameIsDoc = function(fileName) {
  return _.include(
    Partup.helpers.fileUploader.allowedExtensions.docs,
    Partup.helpers.fileUploader.getExtensionFromFileName(fileName)
  );
};

/**
 * Check whether the filename is a Image type defined by the allowedExtensions array
 *
 * @param {string} fileName
 * @returns {boolean}
 */
Partup.helpers.fileUploader.fileNameIsImage = function(fileName) {
  return _.include(
    Partup.helpers.fileUploader.allowedExtensions.images,
    Partup.helpers.fileUploader.getExtensionFromFileName(fileName)
  );
};

/**
 * @param {object} file - DocumentSchema in /packages/partup-lib/schemas/update.js
 * @returns {string} filename - The svg icon [file.svg | ppt.svg | doc.svg | pdf.svg | xls.svg]
 */
Partup.helpers.fileUploader.getSvgIcon = function(file) {
  let svgFileName = 'file.svg';

  // if there's extension in the file name
  if (matchExtension(file.name)) {
    let extension = Partup.helpers.fileUploader.getExtensionFromFileName(
      file.name
    );

    if (
      _.include(Partup.helpers.fileUploader.fallbackFileExtensions, extension)
    ) {
      svgFileName = 'file.svg';
    } else if (
      _.include(Partup.helpers.fileUploader.presentationExtensions, extension)
    ) {
      svgFileName = 'ppt.svg';
    } else if (
      _.include(Partup.helpers.fileUploader.docExtensions, extension)
    ) {
      svgFileName = 'doc.svg';
    } else if (
      _.include(Partup.helpers.fileUploader.pdfExtensions, extension)
    ) {
      svgFileName = 'pdf.svg';
    } else if (
      _.include(Partup.helpers.fileUploader.spreadSheetExtensions, extension)
    ) {
      svgFileName = 'xls.svg';
    }
    // otherwise fallback to file.svg
    return svgFileName;
  } else {
    // if there's no extension in the file name,
    // for example google sheet, google docs or google slide
    // check the mimeType
    if (file.mimeType) {
      if (file.mimeType.indexOf('presentation') > -1) {
        return 'ppt.svg';
      } else if (file.mimeType.indexOf('document') > -1) {
        return 'doc.svg';
      } else if (file.mimeType.indexOf('spreadsheet') > -1) {
        return 'xls.svg';
      }
      // otherwise fallback to file.svg
      return svgFileName;
    } else {
      // otherwise fallback to file.svg
      return svgFileName;
    }
  }
};

// from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
Partup.helpers.fileUploader.bytesToSize = function(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '&nbsp;';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

Partup.helpers.fileUploader.partupUploadPhoto = function(
  mediaUploader,
  mappedFile
) {
  mediaUploader.uploadingPhotos.set(true);
  return new Promise(function(resolve, reject) {
    Partup.client.uploader.uploadImageByUrl(mappedFile.link, function(
      error,
      image
    ) {
      if (error) {
        return reject(error);
      }
      mappedFile._id = image._id;
      resolve(mappedFile);
    });
  });
};

Partup.helpers.fileUploader.partupUploadDoc = function(
  mediaUploader,
  mappedFile
) {
  mediaUploader.uploadingDocuments.set(true);
  return new Promise(function(resolve, reject) {
    resolve(mappedFile);
  });
};

Partup.helpers.fileUploader.getFileType = function(file) {
  let type = 'none';
  Partup.helpers.fileUploader.on(file, {
    image: () => (type = 'image'),
    file: () => (type = 'file'),
  });
  return type;
};

Partup.helpers.fileUploader.on = function(
  file,
  {
    image: imageCallback = lodash.noop,
    file: fileCallback = lodash.noop,
    error: errorCallback = lodash.noop,
  }
) {
  if (!file) return errorCallback(new Error('File not found'));

  if (Partup.helpers.fileUploader.fileNameIsImage(file.name)) {
    return imageCallback();
  }

  return fileCallback();
};

FileUploader = Partup.helpers.fileUploader;

export default FileUploader;
