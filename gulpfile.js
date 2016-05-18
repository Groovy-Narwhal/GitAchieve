// Include Gulp
const gulp = require('gulp');

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

const paths = {
  scripts: ['server/**/*.js']
};

const envConfig = require('./server/config/.env.json');

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

// if the NODE_ENV is 'development', use the un-minified server file
// otherwise use the minified version
gulp.task('run', ['build'], function() {
  env({
    file: './server/config/.env.json'
  });
  if (envConfig.NODE_ENV === 'development') {
    nodemon({
      script: './server/server.js'
    });
  } else {
    nodemon({
      script: './dist/server-all.min.js'
    });
  }
});


// Default Task
gulp.task('default', ['lint', 'test', 'watch']);

gulp.task('build', ['clean', 'build-client', 'build-server']);

gulp.task('start', ['build', 'run']);

// Compile Our Sass // Commented out for now since Sass is not integrated yet.
// gulp.task('sass', function() {
//   return gulp.src('scss/*.scss')
//    .pipe(sass())
//    .pipe(gulp.dest('dist/css'));
// });
