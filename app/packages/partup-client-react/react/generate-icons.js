'use strict';

const testFolder = './src/static/icons';
const fs = require('fs-extra');
const SVGO = require('svgo');
const svgo = new SVGO();
const jsonObject = {};

fs.readdirSync(testFolder).forEach(file => {
    const filePath = `${testFolder}/${file}`;
    const contents = fs.readFileSync(filePath, 'utf8');

    svgo.optimize(contents, (optimizedContent) => {

        jsonObject[file.replace('.svg', '')] = optimizedContent.data
            .replace(/xmlns="(.*?)"/, '')
            .replace(/fill="(.*?)"/, '')
            .replace('<path', '<path fill="currentColor"')
            .replace(/width="(.*?)"/, '')
            .replace(/height="(.*?)"/, '');
    });
});

const jsonString = JSON.stringify(jsonObject, null, 4);

fs.writeFileSync('./src/static/icons.json', jsonString, {encoding: 'utf8'});
