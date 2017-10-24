'use strict';

const path = Npm.require('path');
const glob = Npm.require('glob');
const fs = Npm.require('fs');

Package.describe({
    name: 'partup-client-react',
    version: '0.0.1',
    summary: '',
    documentation: null,
});

Package.onUse((api) => {

    api.use([
        'templating',
        'ecmascript',
        'fourseven:scss',
        'iron:router',
    ], 'client');

    console.log(`----------------------------REACT-----------------------------`);

    const packagePath = path.join(path.resolve('.'), 'packages', 'partup-client-react');

    console.log(`> ${packagePath}`);

    const options = {
        cwd: packagePath,
        ignore: ['index.scss'],
    };

    const files = glob.sync('./react/build/static/js/main.*.js', options);

    let cssfiles = [];
    if (!process.env.REACT_DEV) {
        cssfiles = glob.sync('./react/src/**/*.scss', options);

        console.log(`> Adding ${cssfiles.length} css files.`);
    } else {
        console.log('> Skipping css files in --react-dev mode.');
    }

    const cssArray = cssfiles
        .map((str) => `@import "${str.replace('./', '').replace('.scss', '')}";`)
        .filter((str) => str !== '@import "react/src/index";');

    if (!process.env.REACT_DEV) {
        cssArray.unshift('@import "react/src/index";');
    }

    const cssString = cssArray.join('\n');

    fs.writeFileSync(path.resolve(packagePath + '/react-app-style.scss'), cssString, {encoding: 'utf8'});

    console.log('> Adding javascript\n', files.join('\n\t\t'));

    api.addFiles([
        'blaze/ReactDashboard.html',
    ].concat(files), 'client');

    console.log('> Done.');
    console.log(`--------------------------------------------------------------`);
});
