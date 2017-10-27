'use strict';

const iconsFolder = './src/static/icons';
const outputFile = './src/static/icons.json';
const fs = require('fs-extra');
const SVGO = require('svgo');
const svgo = new SVGO();
const jsonObject = {};

console.log(`Generating icons from ${iconsFolder}...`);

// read icons in icons folder
fs.readdirSync(iconsFolder).forEach(file => {
    const filePath = `${iconsFolder}/${file}`;

    // read content of icon svgs
    const contents = fs.readFileSync(filePath, 'utf8');

    svgo.optimize(contents, (optimizedContent) => {

        if (!file.endsWith('.svg')) return console.log(`Skipped <${filePath}> because it isn't a .svg file.`);

        jsonObject[file.replace('.svg', '')] = optimizedContent.data
            .replace(/xmlns="(.*?)"/, '')
            .replace(/fill="(.*?)"/, '')
            .replace('<path', '<path fill="currentColor"')
            .replace(/width="(.*?)"/, '')
            .replace(/height="(.*?)"/, '');
        
        console.log(`Added <${file.replace('.svg', '')}> icon.`);
    });
});

const jsonString = JSON.stringify(jsonObject, null, 4);

fs.writeFileSync(outputFile, jsonString, {encoding: 'utf8'});

console.log(`Finished creating icons <${outputFile}>.`);