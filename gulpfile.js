var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  lint = require('gulp-eslint'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename');


var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: 'gulp',
    message: 'Error: <%= error.message %>' 
  })
};

gulp.task('js', ['lint'], function () {
  gulp.src('./js/*.js') // what files do we want gulp to consume?
    .pipe(uglify()) //uglify minifies the files, pipe chains files together
    .pipe(rename({
      extname: '.min.js'
    })) //we're renaming the ugly file'
    .pip(gulp.dest('./build/js')) //where are we putting the result?
});

gulp.task('sass', function () {
  gulp.src('./sass/style.scss')
    .pipe(plumber(plumberErrorHandler))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(cssnano())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./",
    }
  });

  gulp.watch(["build/css/*.css", "build/js/*.js"]).on('change', browserSync.reload);
});

//ES LINT
gulp.task('watch', function () {
  gulp.watch('js/*.js', ['js', 'eslint']);
  gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('default', ['browser-sync', 'watch']);


gulp.task('lint', function () {
  return gulp.src('./js/*js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})
