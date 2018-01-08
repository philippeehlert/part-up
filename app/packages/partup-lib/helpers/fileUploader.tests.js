import FileUploader from './fileUploader';

/**
 * Test data
 */
FileUploader.imageExtensions = ['.gif', '.jpg'];
FileUploader.docExtensions = ['.doc', '.docx'];
FileUploader.pdfExtensions = ['.pdf', '.PDF'];
FileUploader.presentationExtensions = ['.pps', '.ppsx'];
FileUploader.fallbackFileExtensions = ['.ai', '.bmp'];
FileUploader.spreadSheetExtensions = ['.xls', '.xlsx'];

// es6 spread operation
FileUploader.allowedExtensions = {
  images: FileUploader.imageExtensions,
  docs: [
    ...FileUploader.pdfExtensions,
    ...FileUploader.docExtensions,
    ...FileUploader.presentationExtensions,
    ...FileUploader.fallbackFileExtensions,
    ...FileUploader.spreadSheetExtensions,
  ],
};
/**
 * End Test data
 */

Tinytest.add('FileUploader docs prop should be defined', function(test) {
  test.isNotUndefined(FileUploader.allowedExtensions.docs);
});

Tinytest.add('FileUploader images prop should be defined', function(test) {
  test.isNotUndefined(FileUploader.allowedExtensions.images);
});

Tinytest.add('FileUploader images prop equal to imageExtensions', function(
  test
) {
  test.equal(
    FileUploader.allowedExtensions.images,
    FileUploader.imageExtensions
  );
});

Tinytest.add(
  'FileUploader docs prop equal to pdf, doc, presentation, fallback and spreadsheet',
  function(test) {
    test.equal(FileUploader.allowedExtensions.docs, [
      '.pdf',
      '.PDF',
      '.doc',
      '.docx',
      '.pps',
      '.ppsx',
      '.ai',
      '.bmp',
      '.xls',
      '.xlsx',
    ]);
  }
);

Tinytest.add('FileUploader should have correct getAllExtensions', function(
  test
) {
  test.equal(FileUploader.getAllExtensions(), [
    '.gif',
    '.jpg',
    '.pdf',
    '.PDF',
    '.doc',
    '.docx',
    '.pps',
    '.ppsx',
    '.ai',
    '.bmp',
    '.xls',
    '.xlsx',
  ]);
});

Tinytest.add('FileUploader getExtensionFromFileName happy.jpg', function(test) {
  test.equal(FileUploader.getExtensionFromFileName('happy.jpg'), '.jpg');
});

Tinytest.add(
  'FileUploader return random fallbackFileExtension when filename has no extension',
  function() {
    expect(FileUploader.fallbackFileExtensions).to.contain(
      FileUploader.getExtensionFromFileName('happy')
    );
  }
);

Tinytest.add('FileUploader check fileNameIsDoc or not', function() {
  expect(FileUploader.fileNameIsDoc('happy')).to.equal(true, 'happy');
  expect(FileUploader.fileNameIsDoc('happy.doc')).to.equal(true, 'happy.doc');
  expect(FileUploader.fileNameIsDoc('happy.jpg')).to.equal(false, 'happy.jpg');
});

Tinytest.add('FileUploader check fileNameIsImage or not', function() {
  expect(FileUploader.fileNameIsImage('happy')).to.equal(false, 'happy');
  expect(FileUploader.fileNameIsImage('happy.doc')).to.equal(
    false,
    'happy.doc'
  );
  expect(FileUploader.fileNameIsImage('happy.jpg')).to.equal(true, 'happy.jpg');
});

Tinytest.add('FileUploader get file.svg icon', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file.ai',
    })
  ).to.equal('file.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file.bmp',
    })
  ).to.equal('file.svg');

  expect(
    FileUploader.getSvgIcon({
      name: '',
    })
  ).to.equal('file.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file',
    })
  ).to.equal('file.svg');
});

Tinytest.add('FileUploader get doc.svg icon', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file.doc',
    })
  ).to.equal('doc.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file.docx',
    })
  ).to.equal('doc.svg');
});

Tinytest.add('FileUploader get ppt.svg icon', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file.pps',
    })
  ).to.equal('ppt.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file.ppsx',
    })
  ).to.equal('ppt.svg');
});

Tinytest.add('FileUploader get pdf.svg icon', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file.pdf',
    })
  ).to.equal('pdf.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file.PDF',
    })
  ).to.equal('pdf.svg');
});

Tinytest.add('FileUploader get xls.svg icon', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file.xls',
    })
  ).to.equal('xls.svg');

  expect(
    FileUploader.getSvgIcon({
      name: 'file.xlsx',
    })
  ).to.equal('xls.svg');
});

Tinytest.add('FileUploader get ppt.svg icon based on mimeType', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file',
      mimeType: 'presentation',
    })
  ).to.equal('ppt.svg');
});

Tinytest.add('FileUploader get doc.svg icon based on mimeType', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file',
      mimeType: 'document',
    })
  ).to.equal('doc.svg');
});

Tinytest.add('FileUploader get xls.svg icon based on mimeType', function() {
  expect(
    FileUploader.getSvgIcon({
      name: 'file',
      mimeType: 'spreadsheet',
    })
  ).to.equal('xls.svg');
});

Tinytest.add(
  'FileUploader get file.svg icon when no mimeType is found',
  function() {
    expect(
      FileUploader.getSvgIcon({
        name: 'file',
      })
    ).to.equal('file.svg');
  }
);
