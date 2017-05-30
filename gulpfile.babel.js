'use strict';

/*
 gulpfile.babel.js
 ===========
 Rather than manage one giant configuration file responsible
 for creating multiple tasks, each task has been broken out into
 its own file in gulpfile.js/tasks. Any files in that directory get
 automatically required below.
 To add a new task, simply add a new task file that directory.
 gulpfile.js/tasks/default.js specifies the default set of tasks to run
 when you run `gulp`.
 */


var gulp = require('gulp');
var help = require('gulp-help');
var requireDir = require('require-dir');
var path = require('path');

// provide help through "gulp help" -- the help text is the second gulp task argument (https://www.npmjs.com/package/gulp-help/)
help(gulp);

// Require all tasks in gulpfile.js/tasks, including sub-folders
requireDir(path.resolve(__dirname, 'gulp', 'tasks'), {
    recurse: true
});

// Default task
gulp.task('default', 'Release package', ['release-it']);