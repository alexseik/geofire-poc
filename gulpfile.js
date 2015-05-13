var gulp = require('gulp');
var fs      = require('fs');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var template = require('gulp-template');
var args    = require('yargs').argv;
var replace = require('gulp-replace-task');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','replace','lint']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('lint', function() {
  return gulp.src('./www/js/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('init-config',function(){
  var env = args.env || 'development';
  return gulp.src('./config/config.json.tpl')
      .pipe(template())
      .pipe(rename('config-'+env+'.json'))
      .pipe(gulp.dest('./www/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('replace', function () {
  // Get the environment from the command line
  var env = args.env || 'development';

  // Read the settings from the right file
  var filename = 'config-'+env + '.json';
  var settings = JSON.parse(fs.readFileSync('./www/js/' + filename, 'utf8'));

// Replace each placeholder with the correct value for the variable.
  gulp.src('./config/config.js')
      .pipe(replace({
        patterns: [
          {
            match: 'apiUrl',
            replacement: settings.apiKey
          },
          {
            match: 'firebaseUrl',
            replacement: settings.firebaseUrl
          }
        ]
      }))
      .pipe(gulp.dest('./www/js'));
});