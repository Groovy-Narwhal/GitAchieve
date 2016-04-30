// Include Gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var webpack = require('webpack-stream');
var mochaPhantomJs = require('gulp-mocha-phantomjs');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Test Task
gulp.task('test', function() {
  return gulp.src('test/client/index.html')
    .pipe(mochaPhantomJs());
});

// Build Task
gulp.task('build', function() {
  return gulp.src('client/index.js')
    .pipe(webpack())
    .pipe(gulp.dest('dist/'));
});

// Compile Our Sass // Commented out for now since Sass is not integrated yet.
// gulp.task('sass', function() {
//     return gulp.src('scss/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('dist/css'));
// });

// Concatenate & Minify JS Task
gulp.task('scripts', function() {
    return gulp.src('server/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['./*.js', 'test/**'], ['lint', 'scripts', 'test']);
    // gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
