'use strict';

var gulp = require('gulp');
var help = require('gulp-help');
var git = require('gulp-git');
var tagVersion = require('gulp-tag-version');
var path = require('path');

// provide help through "gulp help" -- the help text is the second gulp task argument (https://www.npmjs.com/package/gulp-help/)
help(gulp);

gulp.task('pull', function(done) {
    git.pull();
    done();
});

gulp.task('add', function() {
    return gulp.src([path.resolve(__dirname, '../../', 'CHANGELOG.md'), path.resolve(__dirname, '../../', 'package.json')])
        .pipe(git.add());
});

gulp.task('commit', function() {
    return gulp.src(path.resolve(__dirname, '../../'))
        .pipe(git.commit('chore(release): bump package version and update changelog', { emitData: true }))
        .on('data', function(data) {
            console.log(data);
        });
});

gulp.task('tag', function() {
    return gulp.src(path.resolve(__dirname, '../../', 'package.json'))
        .pipe(tagVersion({ prefix: '' }));
});

gulp.task('push', function(done) {
    git.push('origin', null, { args: '--tags -u' });
    done();
});