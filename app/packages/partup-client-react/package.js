'use strict';
const Future = Npm.require('fibers/future');
const exec = Npm.require('child_process').exec;
const path = Npm.require('path');
const glob = Npm.require('glob');

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

    exec('cd ./packages/partup-client-react/react && yarn build', (error, stdout, stderr) => {
        console.log('REACT: Finished building', error, stdout, stderr);
        future.resolver()();
    })

    future.wait();

    const options = {
        cwd: path.join(path.resolve('.'), 'packages', 'partup-client-react'),
    };

    const files = glob.sync('./react/build/static/js/main.*.js', options);

    console.log('REACT: Adding files', files);

    api.addFiles([
        'blaze/ReactDashboard.html',
    ].concat(files), 'client');

    console.log('REACT: Done.');
});
