import './files';

// #region Categories
/**
 * The categories property contains all categories and acts like an enumeration
 * 
 * Expected behaviors:
 * 
 * - Each category should return it's name as string when accessed.
 * 
 */
    Tinytest.add('Category accessible via property', function(test) {
        tets.equal('image', Partup.helpers.categories.image);
    });
    Tinytest.add('Category accessible like an array', function(test) {
        tets.equal('image', Partup.helpers.categories['image']);
    });

// #endregion


// #region Extensions
/**
 * The extensions property is a map between categories to extensions
 * 
 * Expected behaviors:
 * 
 * - Retrieve the extensions by category in an array
 * 
 */

    Tinytest.add('Extensions by category accesible via property', function(test) {
        tets.isNotUndefined(Partup.helpers.extensions['image']);
    });

// #endregion


// #region Info
/**
 * Expected behaviors:
 * - A FileInfo object ...
 */




// #endregion


// #region Signatures



// #endregion



Tinytest.add('Extension from FileInfo is valid', function(test) {
    const { name, mime } = Partup.helpers.files.info['doc'];
    const ext = Partup.helpers.files.getExtension({ name, type: mime });
    test.equal('doc', ext);
});
