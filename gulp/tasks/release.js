'use strict';

var gulp = require('gulp');
var help = require('gulp-help');
var map = require('map-stream');
var runSequence = require('run-sequence');

// provide help through "gulp help" -- the help text is the second gulp task argument (https://www.npmjs.com/package/gulp-help/)
help(gulp);

gulp.task('assure-no-temp-i18n-files', () => {
    return gulp.src('app/i18n/z-**.i18n.json')
        .pipe(map((file, callback) => {
            console.error('Found z-files in app/i18n, should not release like that!');
            process.exit(1);
        }));
});

gulp.task('release-it', ['assure-no-temp-i18n-files'], (done) => {
    runSequence('bump', 'changelog', 'add', 'commit', 'tag', 'push', done);
});