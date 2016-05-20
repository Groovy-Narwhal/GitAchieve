// Include Gulp
var gulp = require('gulp');

// Include Our Plugins
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const env = require('gulp-env');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const util = require('gulp-util');
const shell = require('gulp-shell');
const webpack = require('webpack-stream');
const webpackOptions = require('./webpack.config.production.js');
const mochaPhantomJs = require('gulp-mocha-phantomjs');



// Lint Task
gulp.task('lint', function() {
  return gulp.src(['./client/**/*.js', './server/**/*.js'], {base: '.'})
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('default'));
});

// Test Task
gulp.task('test', shell.task([
  'mocha test/client/.setup.js test/client',
  'jasmine-node test/server/ --junitreport'
]));

// Set the NODE_ENV from a config JSON file
gulp.task('env', function() {
  env({
    file: './server/config/.env.json'
  });
});

// Clean out previous dist folder
gulp.task('clean-dist', function () {  
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

// Clean out concatenated server file
gulp.task('clean-server1', function () {
  return gulp.src('server/server-all.js', {read: false})
    .pipe(clean());
});

// Clean out concatenated & uglified server file
gulp.task('clean-server2', function () {
  return gulp.src('server/server-all.min.js', {read: false})
    .pipe(clean());
});

gulp.task('clean', ['clean-dist', 'clean-server1', 'clean-server2']);

// Concatenate & Uglify client-side JS
  // 'clean' must finish before this will start
gulp.task('build-client', ['clean'], function() {
  return gulp.src('client/index.js')
    .pipe(webpack(webpackOptions))
    .pipe(rename('bundle.big.js'))
    .pipe(gulp.dest('dist'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .on('error', util.log);
});

// Concatenate & Uglify server-side JS
  // 'clean' must finish before this will start
gulp.task('build-server', ['clean'], function() {
  return gulp.src('server/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('server-all.js'))
    .pipe(gulp.dest('server'))
    .pipe(rename('server-all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('server'))
    .on('error', util.log);
});

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
  gulp.watch(['./*.js', 'test/**'], ['lint', 'test']);
  // gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('forever', ['env', 'webpack'], shell.task([
  'forever ./forever/development.json'
]));

gulp.task('webpack', shell.task([
  'webpack -p'
]));

gulp.task('start', ['env', 'webpack', 'forever']);

// Default Task
gulp.task('default', ['lint', 'test', 'watch']);

// Clean / Concatenate / Minify
gulp.task('build', ['env', 'clean', 'build-client']);

// Build client files and start deployed server
gulp.task('run', ['build', 'forever']);

// Compile Our Sass // Commented out for now since Sass is not integrated yet.
// gulp.task('sass', function() {
//   return gulp.src('scss/*.scss')
//    .pipe(sass())
//    .pipe(gulp.dest('dist/css'));
// });
