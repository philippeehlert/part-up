const testFolder = './src/static/icons';
const fs = require('fs-extra');

const jsonObject = {};

fs.readdirSync(testFolder).forEach(file => {
    const contents = fs.readFileSync(`${testFolder}/${file}`, 'utf8');

    jsonObject[file.replace('.svg', '')] = contents
        .replace(/xmlns="(.*?)"/, '')
        .replace(/fill="(.*?)"/, '')
        .replace('<path', '<path fill="currentColor"')
        .replace(/width="(.*?)"/, '')
        .replace(/height="(.*?)"/, '');
});

const jsonString = JSON.stringify(jsonObject, null, 4);

fs.writeFileSync('./src/static/icons.json', jsonString, {encoding: 'utf8'});
