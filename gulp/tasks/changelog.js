var gulp = require('gulp');
var help = require('gulp-help');
var conventionalChangelog = require('gulp-conventional-changelog');
var path = require('path');

// provide help through "gulp help" -- the help text is the second gulp task argument (https://www.npmjs.com/package/gulp-help/)
help(gulp);

gulp.task('changelog', function() {

    return gulp.src(path.resolve(__dirname, '../../', 'CHANGELOG.md'), { buffer: false })
        .pipe(
            conventionalChangelog({ preset: 'angular', releaseCount: 0 }, {}, { merges: undefined, noMerges: undefined })
        )
        .pipe(gulp.dest(path.resolve(__dirname, '../../')));
});