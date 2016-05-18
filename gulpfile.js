// Include Gulp
var gulp = require('gulp');

// Include Our Plugins
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var env = require('gulp-env');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var util = require('gulp-util');
var shell = require('gulp-shell');
var webpack = require('webpack-stream');
var webpackOptions = require('./webpack.config.production.js');
var mochaPhantomJs = require('gulp-mocha-phantomjs');

var paths = {
  scripts: ['server/**/*.js']
};

// Lint Task
gulp.task('lint', function() {
  return gulp.src(['./client/**/*.js', './server/**/*.js'], {base: '.'})
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(eslint({
      config: './test/hrStyleGuide.json'
    }))
    .pipe(eslint.format())
    .on('error', util.log);
});

// Test Task
gulp.task('test', shell.task([
  'mocha test/client/.setup.js test/client',
  'jasmine-node test/server/ --junitreport'
]));

// Clean out previous dist folder
gulp.task('clean', function () {  
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// Concatenate & Uglify client-side JS
  // 'clean' must finish before this will start
gulp.task('build-client', ['clean'], function() {
  return gulp.src('client/index.js')
    .pipe(webpack(webpackOptions))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .on('error', util.log);
});

// Concatenate & Uglify server-side JS
  // 'clean' must finish before this will start
gulp.task('build-server', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('server-all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('server-all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .on('error', util.log);
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(['./*.js', 'test/**'], ['lint', 'test']);
  // gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('run', function() {
  env({
    file: './server/config/.env.json'
  });
  nodemon({
    script: './server/server.js'
  });
});

// Default Task
gulp.task('default', ['lint', 'test', 'watch']);

gulp.task('build', ['clean', 'build-client', 'build-server']);

// Compile Our Sass // Commented out for now since Sass is not integrated yet.
// gulp.task('sass', function() {
//   return gulp.src('scss/*.scss')
//    .pipe(sass())
//    .pipe(gulp.dest('dist/css'));
// });
