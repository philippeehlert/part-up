let _ = Npm.require('lodash');
let fs = Npm.require('fs-extra');
let path = Npm.require('path');
let temp = Npm.require('temp').track();
let md5 = Npm.require('MD5');
let svg2ttf = Npm.require('svg2ttf');
let ttf2eot = Npm.require('ttf2eot');
let ttf2woff = Npm.require('ttf2woff');
let ttf2woff2 = Npm.require('ttf2woff2');
let svgicons2svgfont = Npm.require('svgicons2svgfont');
let optionsFile = path.join(process.cwd(), 'iconfont.json');
let cacheFilePath = path.join(process.cwd(), '.meteor/iconfont.cache');

let handler = function(compileStep) {
  let options = fs.existsSync(optionsFile) ? loadJSONFile(optionsFile) : {};
  compileStep.inputPath = 'iconfont.json';
  options = _.extend(
    {
      src: 'svgs',
      dest: 'public/fonts/icons',
      fontFaceBaseURL: '/fonts/icons',
      fontName: 'icons',
      fontHeight: 512,
      stylesheetsDestBasePath: 'client',
      descent: 64,
      normalize: true,
      classPrefix: 'icon-',
      stylesheetFilename: null,
      stylesheetTemplate:
        '.meteor/local/isopacks/andrefgneves_iconfont/os/packages/andrefgneves_iconfont/plugin/stylesheet.tpl',
      types: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
    },
    options
  );
  if (!options.types || !options.types.length) {
    return;
  }
  options.files = getFiles(options.src);
  if (didInvalidateCache(options)) {
    options.fontFaceURLS = {};
    options.types = _.map(options.types, function(type) {
      return type.toLowerCase();
    });
    console.log('\n[iconfont] generating');
    return generateFonts(compileStep, options);
  }
};

var didInvalidateCache = function(options) {
  let didInvalidate = false;
  let newCacheChecksum = generateCacheChecksum(options);
  if (!fs.existsSync(cacheFilePath)) {
    didInvalidate = true;
  } else {
    let oldCacheChecksum = fs.readFileSync(cacheFilePath, {
      encoding: 'utf8',
    });
    didInvalidate = newCacheChecksum !== oldCacheChecksum;
  }
  if (didInvalidate) {
    fs.writeFileSync(cacheFilePath, newCacheChecksum);
  }
  return didInvalidate;
};

var generateCacheChecksum = function(options) {
  let checksums = [];
  let settingsChecksum = md5(fs.readFileSync(optionsFile));
  _.each(options.files, function(file) {
    let checksum = md5(path.basename(file) + fs.readFileSync(file));
    return checksums.push(checksum);
  });
  return md5(settingsChecksum + JSON.stringify(checksums));
};

var generateFonts = function(compileStep, options) {
  return generateSVGFont(options.files, options, function(svgFontPath) {
    if (_.intersection(options.types, ['ttf', 'eot', 'woff', 'woff2']).length) {
      generateTTFFont(svgFontPath, options, function(ttfFontPath) {
        if (_.contains(options.types, 'eot')) {
          generateEOTFont(ttfFontPath, options);
        }
        if (_.contains(options.types, 'woff')) {
          generateWoffFont(ttfFontPath, options);
        }
        if (_.contains(options.types, 'woff2')) {
          return generateWoff2Font(ttfFontPath, options);
        }
      });
    }
    return generateStylesheets(compileStep, options);
  });
};

var generateSVGFont = function(files, options, done) {
  let codepoint = 0xe001;
  options.glyphs = _.compact(
    _.map(files, function(file) {
      let matches;
      matches = file.match(/^(?:u([0-9a-f]{4})\-)?(.*).svg$/i);
      if (matches) {
        return {
          name: path
            .basename(matches[2])
            .toLowerCase()
            .replace(/\s/g, '-'),
          stream: fs.createReadStream(file),
          codepoint: matches[1] ? parseInt(matches[1], 16) : codepoint++,
        };
      }
      return false;
    })
  );
  let fontStream = svgicons2svgfont(
    options.glyphs,
    _.extend(options, {
      log: function() {},
      error: function() {},
    })
  );
  let tempStream = temp.createWriteStream();
  return fontStream.pipe(tempStream).on('finish', function() {
    let svgDestPath;
    if (_.contains(options.types, 'svg')) {
      svgDestPath = path.join(
        process.cwd(),
        options.dest,
        options.fontName + '.svg'
      );
      fs.createFileSync(svgDestPath);
      fs.writeFileSync(svgDestPath, fs.readFileSync(tempStream.path));
      options.fontFaceURLS.svg = path.join(
        options.fontFaceBaseURL,
        options.fontName + '.svg'
      );
    }
    if (_.isFunction(done)) {
      return done(tempStream.path);
    }
  });
};

var generateTTFFont = function(svgFontPath, options, done) {
  let font = svg2ttf(
    fs.readFileSync(svgFontPath, {
      encoding: 'utf8',
    }),
    {}
  );
  font = new Buffer(font.buffer);
  let tempFile = temp.openSync(options.fontName + '-ttf');
  fs.writeFileSync(tempFile.path, font);
  if (_.contains(options.types, 'ttf')) {
    let ttfDestPath = path.join(
      process.cwd(),
      options.dest,
      options.fontName + '.ttf'
    );
    fs.createFileSync(ttfDestPath);
    fs.writeFileSync(ttfDestPath, font);
    options.fontFaceURLS.ttf = path.join(
      options.fontFaceBaseURL,
      options.fontName + '.ttf'
    );
  }
  if (_.isFunction(done)) {
    return done(tempFile.path);
  }
};

var generateEOTFont = function(ttfFontPath, options, done) {
  let ttf = new Uint8Array(fs.readFileSync(ttfFontPath));
  let font = new Buffer(ttf2eot(ttf).buffer);
  let tempFile = temp.openSync(options.fontName + '-eot');
  fs.writeFileSync(tempFile.path, font);
  let eotDestPath = path.join(
    process.cwd(),
    options.dest,
    options.fontName + '.eot'
  );
  fs.createFileSync(eotDestPath);
  fs.writeFileSync(eotDestPath, font);
  options.fontFaceURLS.eot = path.join(
    options.fontFaceBaseURL,
    options.fontName + '.eot'
  );
  if (_.isFunction(done)) {
    return done(tempFile.path);
  }
};

var generateWoffFont = function(ttfFontPath, options, done) {
  let ttf = new Uint8Array(fs.readFileSync(ttfFontPath));
  let font = new Buffer(ttf2woff(ttf).buffer);
  let tempFile = temp.openSync(options.fontName + '-woff');
  fs.writeFileSync(tempFile.path, font);
  let eotDestPath = path.join(
    process.cwd(),
    options.dest,
    options.fontName + '.woff'
  );
  fs.createFileSync(eotDestPath);
  fs.writeFileSync(eotDestPath, font);
  options.fontFaceURLS.woff = path.join(
    options.fontFaceBaseURL,
    options.fontName + '.woff'
  );
  if (_.isFunction(done)) {
    return done(tempFile.path);
  }
};

var generateWoff2Font = function(ttfFontPath, options, done) {
  let ttf = fs.readFileSync(ttfFontPath);
  let font = ttf2woff2(ttf);
  let tempFile = temp.openSync(options.fontName + '-woff2');
  fs.writeFileSync(tempFile.path, font);
  let eotDestPath = path.join(
    process.cwd(),
    options.dest,
    options.fontName + '.woff2'
  );
  fs.createFileSync(eotDestPath);
  fs.writeFileSync(eotDestPath, font);
  options.fontFaceURLS.woff2 = path.join(
    options.fontFaceBaseURL,
    options.fontName + '.woff2'
  );
  if (_.isFunction(done)) {
    return done(tempFile.path);
  }
};

var generateStylesheets = function(compileStep, options) {
  let fontSrcs = [];
  let glyphCodepointMap = {};
  let classNames = _.map(options.glyphs, function(glyph) {
    return '.' + options.classPrefix + glyph.name.replace(/\s+/g, '-');
  });
  _.each(options.glyphs, function(glyph) {
    return (glyphCodepointMap[glyph.name] = glyph.codepoint.toString(16));
  });
  let srcs = [];
  _.each(options.types, function(type) {
    switch (type) {
      case 'svg':
        return srcs.push(
          getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension:
              '.svg#' + options.fontName + '?v=' + new Date().getTime(),
            format: 'svg',
          })
        );
      case 'ttf':
        return srcs.push(
          getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension: '.ttf' + '?v=' + new Date().getTime(),
            format: 'truetype',
          })
        );
      case 'eot':
        return srcs.push(
          getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension: '.eot?#iefix' + '?v=' + new Date().getTime(),
            format: 'embedded-opentype',
          })
        );
      case 'woff':
        return srcs.push(
          getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension: '.woff' + '?v=' + new Date().getTime(),
            format: 'woff',
          })
        );
      case 'woff2':
        return srcs.push(
          getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension: '.woff2' + '?v=' + new Date().getTime(),
            format: 'woff2',
          })
        );
    }
  });
  if (_.contains(options.types, 'eot')) {
    srcs.push(
      getFontSrcURL({
        baseURL: options.fontFaceBaseURL,
        fontName: options.fontName,
        extension: '.eot' + '?v=' + new Date().getTime(),
      })
    );
  }
  fontSrcs.push(srcs.join(', '));
  if (!options.stylesheets) {
    var stylesheets = {};
    options.stylesheetFilename =
      options.stylesheetFilename || options.fontName + '.css';
    stylesheets[options.stylesheetFilename] = options.stylesheetTemplate;
  } else {
    stylesheets = options.stylesheets;
  }
  let results = [];
  for (fileName in stylesheets) {
    let filePath = stylesheets[fileName];
    let templatePath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(templatePath)) {
      console.log('\n[iconfont] template file not found at ' + templatePath);
      continue;
    }
    let template = fs.readFileSync(templatePath, 'utf8');
    let data = _.template(template, {
      glyphCodepointMap: glyphCodepointMap,
      classPrefix: options.classPrefix,
      classNames: classNames.join(', '),
      fontName: options.fontName,
      fontFaceBaseURL: options.fontFaceBaseURL,
      types: options.types,
      fontSrcs: fontSrcs,
    });
    let stylesheetDestPath = path.join(
      options.stylesheetsDestBasePath,
      fileName
    );
    fs.ensureFileSync(stylesheetDestPath);
    fs.writeFileSync(stylesheetDestPath, data);
    if (path.extname(stylesheetDestPath) === '.css') {
      results.push(
        compileStep.addStylesheet({
          path: stylesheetDestPath,
          data: data,
        })
      );
    } else {
      results.push(void 0);
    }
  }
  return results;
};

var getFontSrcURL = function(options) {
  let parts = [
    'url("',
    options.baseURL,
    '/',
    options.fontName,
    options.extension,
    '")',
  ];
  if (_.isString(options.format && options.format.length)) {
    parts = parts.concat([' format("', options.format, '")']);
  }
  return parts.join('');
};

var getFiles = function(srcPaths) {
  if (_.isString(srcPaths)) {
    srcPaths = [srcPaths];
  }
  let matches = _.map(srcPaths, function(srcPath) {
    srcPath = path.join(process.cwd(), srcPath);
    if (!fs.existsSync(srcPath)) {
      return false;
    }
    return fs.readdirSync(srcPath).map(function(file) {
      if (path.extname(file) === '.svg') {
        return path.join(srcPath, file);
      }
      return false;
    });
  });
  return _.uniq(_.compact(_.flatten(matches)));
};

var loadJSONFile = function(filePath) {
  let content = fs.readFileSync(filePath);
  try {
    return JSON.parse(content);
  } catch (_error) {
    console.log('Error: failed to parse ', filePath, ' as JSON');
    return {};
  }
};

Plugin.registerSourceHandler(
  'iconfont.json',
  {
    archMatching: 'web',
  },
  handler
);

Plugin.registerSourceHandler(
  'svg',
  {
    archMatching: 'web',
  },
  handler
);
