'use strict';

var gulp = require('gulp');
var help = require('gulp-help');
var bump = require('gulp-bump');
var conventionalRecommendedBump = require('conventional-recommended-bump');
var path = require('path');

// provide help through "gulp help" -- the help text is the second gulp task argument (https://www.npmjs.com/package/gulp-help/)
help(gulp);

gulp.task('bump', function(done) {
    /**
     * Bumping version number and tagging the repository with it.
     * Please read http://semver.org/
     *
     * To bump the version numbers accordingly after you did a patch,
     * introduced a feature or made a backwards-incompatible release.
     */

    conventionalRecommendedBump({ preset: 'angular' }, function(err, result) {
        // Get all the files to bump version in
        gulp.src([path.resolve(__dirname, '../../', 'package.json')])
            .pipe(bump({ type: result.releaseType }))
            .pipe(gulp.dest(path.resolve(__dirname, '../../')));
        done();
    });
});