let path = Npm.require('path');
let fs = Npm.require('fs');

Package.describe({
  summary: 'Contains all your npm dependencies',
  version: '1.2.0',
  name: 'npm-container',
});

let packagesJsonFile = path.resolve('./packages.json');
try {
  let fileContent = fs.readFileSync(packagesJsonFile);
  let packages = JSON.parse(fileContent.toString());
  Npm.depends(packages);
} catch (ex) {
  console.error('ERROR: packages.json parsing error [ ' + ex.message + ' ]');
}

// Adding the app's packages.json as a used file for this package will get
// Meteor to watch it and reload this package when it changes
Package.onUse(function(api) {
  api.addFiles('index.js', 'server');
  if (api.addAssets) {
    api.addAssets('../../packages.json', 'server');
  } else {
    api.addFiles('../../packages.json', 'server', {
      isAsset: true,
    });
  }
});
