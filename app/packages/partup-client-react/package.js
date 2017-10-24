'use strict';
const Future = Npm.require('fibers/future');
const exec = Npm.require('child_process').exec;
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

    console.log('REACT: Building');

    const future = new Future;

    exec('cd ./packages/partup-client-react/react && npm install --unsafe-perm && npm build', (error, stdout, stderr) => {

        if (error) {
            console.log('REACT: FAILED building', error.stack, stderr);
            process.exit(1);
        }

        console.log('REACT: Finished building', stdout);

        future.resolver()();
    })

    future.wait();

    const packagePath = path.join(path.resolve('.'), 'packages', 'partup-client-react');
    const options = {
        cwd: packagePath,
        ignore: ['index.scss'],
    };

    const files = glob.sync('./react/build/static/js/main.*.js', options);

    const cssfiles = glob.sync('./react/src/**/*.scss', options);
    console.log(cssfiles);

    const cssArray = cssfiles.map((str) => {
        return str.replace('./', '@import "').replace('.scss', '";');
    }).filter((str) => str !== '@import "react/src/index";');
    cssArray.unshift('@import "react/src/index";');
    const cssString = cssArray.join('\n');

    console.log(packagePath);

    fs.writeFileSync(path.resolve(packagePath + '/react-app-style.scss'), cssString, {encoding: 'utf8'});

    console.log('REACT: Adding files', files);

    api.addFiles([
        'blaze/ReactDashboard.html',
    ].concat(files), 'client');

    console.log('REACT: Done.');
});
