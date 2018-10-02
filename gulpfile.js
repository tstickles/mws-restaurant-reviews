const gulp = require('gulp');
const sass = require('gulp-sass');
var babel = require("gulp-babel")
var browserify = require('browserify');

gulp.task("default", function () {
  return gulp.src("src/app.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});


gulp.task('hello', function(){
    console.log('hello');
});