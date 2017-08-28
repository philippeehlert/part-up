import './files';

// #region Properties

    // Properties are read-only

    Tinytest.add('categories is read-only', function(test) {
        
        Partup.helpers.files.categories['randomkey'] = 'newvalue'
        expect(Partup.helpers.files.categories['randomkey']).to.equal(undefined);

        Partup.helpers.files.categories['image'] = undefined;
        expect(Partup.helpers.files.categories['image']).to.equal('image');

    });

    Tinytest.add('extensions is read-only', function(test) {
        
        Partup.helpers.files.extensions['randomkey'] = 'newvalue'
        expect(Partup.helpers.files.extensions['randomkey']).to.equal(undefined);

        Partup.helpers.files.extensions['image'] = undefined;
        test.isNotUndefined(Partup.helpers.files.extensions['image']);

    });

    Tinytest.add('info is read-only', function(test) {
        
        Partup.helpers.files.info['randomkey'] = 'newvalue'
        expect(Partup.helpers.files.info['randomkey']).to.equal(undefined);

        Partup.helpers.files.info['doc'] = undefined;
        test.isNotUndefined(Partup.helpers.files.info['doc']);

    });

    // Categories

    Tinytest.add("files.categories['image'] returns 'image'", function(test) {
        test.equal(Partup.helpers.files.categories['image'], 'image');
    });

    Tinytest.add("file.extensions['image'] is not undefined", function(test) {
        test.isNotUndefined(Partup.helpers.files.extensions['image']);
    });

    // Info

    Tinytest.add("files.info['doc'] returns FileInfo object", function(test) {
        test.isNotUndefined(Partup.helpers.files.info['doc']);
    });

    Tinytest.add("files.info['application/msword'] returns FileInfo object", function(test) {
        test.isNotUndefined(Partup.helpers.files.info['application/msword']);
    });

    Tinytest.add('FileInfo has category/mime/extension/signatures/icon', function() {

        const fileinfo = Partup.helpers.files.info['doc'];

        expect(fileinfo.category).to.equal('document');
        expect(fileinfo.mime).to.equal('application/msword');
        expect(fileinfo.extension).to.equal('doc');
        expect(fileinfo.signatures).to.instanceOf(Array);
        expect(fileinfo.icon).to.equal('doc.svg');

    });
    Tinytest.add('FileInfo icon of pdf is specific to pdf', function() {
        expect(Partup.helpers.files.info['pdf'].icon).to.equal('pdf.svg');
    });

    Tinytest.add('FileInfo icon of docx falls back to category icon doc', function() {
        expect(Partup.helpers.files.info['docx'].icon).to.equal('doc.svg');
    });

// #endregion

// #region Methods

    // getExtension

    Tinytest.add('getExtension returns extension from filename', function() {
        expect(Partup.helpers.files.getExtension({ name: 'filename.doc' })).to.equal('doc');
    });

    Tinytest.add('getExtension allows multiple dots in filename', function() {
        expect(Partup.helpers.files.getExtension({ name: 'file.name.doc' })).to.equal('doc');
    });

    Tinytest.add('getExtension allows only extension (no name)', function() {
        expect(Partup.helpers.files.getExtension({ name: '.doc' })).to.equal('doc');
    });

    Tinytest.add('getExtension returns extension from file mime', function() {
        expect(Partup.helpers.files.getExtension({ type: 'application/msword' })).to.equal('doc');
    });

    Tinytest.add('getExtension takes mime when no dot in filename', function() {
        expect(Partup.helpers.files.getExtension({ name: 'filename', type: 'application/msword' })).to.equal('doc')
    });

    Tinytest.add('getExtension prioritizes name above mime', function() {
        expect(Partup.helpers.files.getExtension({ name: 'filename.doc', type: 'image/jpeg' })).to.equal('doc');
    });

    Tinytest.add('getExtension no input throws error', function(test) {
        test.throws(function() {
            Partup.helpers.files.getExtension()
        });
    });

    Tinytest.add('getExtension throws when no . in filename and no mime', function(test) {
        test.throws(function() {
            Partup.helpers.files.getExtension({ name: 'filename' });
        });
    });

    Tinytest.add('getExtension no valid name and type throws error', function(test) {
        test.throws(function() {
            Partup.helpers.files.getExtension({
                name: 'invalid',
                type: 'invalid'
            });
        });
    });

    // isImage

    Tinytest.add('isImage filename .jpg returns true', function() {
        expect(Partup.helpers.files.isImage({ name: 'image.jpg' })).to.equal(true);
    });

    Tinytest.add('isImage type image/jpeg returns true', function() {
        expect(Partup.helpers.files.isImage({ type: 'image/jpeg' })).to.equal(true);
    });
    
    Tinytest.add('isImage returns false when mime is not image', function() {
        expect(Partup.helpers.files.isImage({ type: 'application/msword' })).to.equal(false);
    });

    Tinytest.add('isImage returns true when valid mime and invalid name', function() {
        expect(Partup.helpers.files.isImage({ name: 'invalid', type: 'image/jpeg' })).to.equal(true);
    });

    Tinytest.add('isImage returns true when valid name and invalid mime', function() {
        expect(Partup.helpers.files.isImage({ name: 'image.jpg', type: 'invalid' })).to.equal(true);
    });

    Tinytest.add('isImage throws on file without valid name and mime', function(test) {
        test.throws(function() {
            Partup.helpers.files.isImage({ name: 'image', type: 'image' });
        });
    });

    // getSvgIcon

    Tinytest.add("getSvgIcon returns icon when FileInfo has icon", function() {
        expect(Partup.helpers.files.getSvgIcon({ name: 'filename.doc', type: 'application/msword' })).to.equal('doc.svg');
    });

    // toUploadFilter

    Tinytest.add("toUploadFilter returns filter for category images", function(test) {
        test.isNotUndefined(Partup.helpers.files.toUploadFilter(Partup.helpers.files.categories.image));
    });

    Tinytest.add("toUploadFilter allows custom filter", function() {
        const extensions = ['a', 'b', 'c'];
        expect(Partup.helpers.files.toUploadFilter('custom', extensions).title).to.equal('custom');
        expect(Partup.helpers.files.toUploadFilter('custom', extensions).extensions).to.equal(extensions);
    });

// #endregion
