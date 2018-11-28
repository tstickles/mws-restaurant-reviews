import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';

const gulp = require('gulp');
const browserify = require('browserify');

// import responsive from 'gulp-responsive';
// import del from 'del';
// import newer from 'gulp-newer';
// import runSequence from 'run-sequence';
// import babelify from 'babelify';
// import assign from 'lodash/assign';
// import browserify from 'browserify';
// import watchify from 'watchify';
// import source from 'vinyl-source-stream';
// import buffer from 'vinyl-buffer';
// import log from 'fancy-log';
// import mergeStream from 'merge-stream';
// import sourcemaps from 'gulp-sourcemaps';
// import c from 'ansi-colors';

// const browserSync = require('browser-sync').create();

// const paths;

// const copy;



// gulp.task('clean', function(){

// });

// gulp.task('responsive:images', function(){

// });

// gulp.task('copy', function(){

// });

// gulp.task('build', function(){

// });

// gulp.task('sync', ['build'], function(){

// });

// gulp.watch();
// gulp.watch();

// function bundle(b, outputPath){

// }

// const jsBundles = {};

// gulp.task('js:bundle', function(done){

// });

require("@babel/register");

gulp.task("default", function () {
    return gulp.src("src/app.js")
      .pipe(babel())
      .pipe(gulp.dest("dist"));
  });

  gulp.task('hello', function(){
      console.log('hello!');
  })