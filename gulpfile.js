'use strict';

//
// Packages
//

const gulp = require('gulp');
const del = require('del');
const svgsprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sasslint = require('gulp-sass-lint');
const ext = require('gulp-ext-replace');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const hb = require('gulp-hb');
const favicon = require('gulp-base64-favicon');
const browsersync = require('browser-sync').create();
const purgecss = require('gulp-purgecss');
const critical = require('critical').stream;


//
// Processes
//

// Clean
function clean() {
  return del('./dist');
}

//
// JS
//

function jslint() {
  return gulp
    .src([
      './src/js/*/js',
      './gulpfile.js'
    ], { allowEmpty: true })
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(browsersync.stream());
}

function js() {
  return gulp
    .src([
      './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
      './src/js/main.js'
    ], { allowEmpty: true })
    .pipe(uglify({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: false
      }}
    ))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browsersync.stream());
}


//
// CSS
//

function csslint() {
  return gulp
    .src('./src/scss/*.scss', { allowEmpty: true })
    .pipe(sasslint({'configFile': './.sass-lint.yml'}))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(browsersync.stream());
}

function cssnoncritical() {
  return gulp
    .src('./src/scss/main.scss', { allowEmpty: true })
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(purgecss({
      content: ['./dist/*.html']
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browsersync.stream());
}

function csscritical() {
  return gulp
    .src('./dist/*.html')
    .pipe(
      critical({
        base: './dist/',
        inline: false,
        css: ['./dist/css/main.css'],
      })
    )
    .pipe(concat('css.css'))
    .pipe(ext('.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'))
    .pipe(browsersync.stream());
}


//
// Assets
//

function sprite() {
  return gulp
    .src('./src/sprite/**/**/*.svg', { allowEmpty: true })
    .pipe(
      svgsprite({
        shape: {
          spacing: {
            padding: 5
          }
        },
        mode: {
          symbol: true
        },
        svg: {
          xmlDeclaration: false,
          doctypeDeclaration: false,
          namespaceIDs: false,
          namespaceClassnames: false
        }
      })
    )
    .pipe(concat('sprite.hbs'))
    .pipe(gulp.dest('./src/html/partials/global/'))
    .pipe(browsersync.stream());
}

function images() {
  return gulp
    .src('./src/img/**/**/*', { allowEmpty: true })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browsersync.stream());
}


//
// HTML
//

// HTML
function html() {
  return gulp
    .src('./src/html/*.hbs')
    .pipe(hb()
      .partials('./src/html/partials/**/*.hbs')
    )
    .pipe(ext('.html'))
    .pipe(favicon())
    .pipe(gulp.dest('./dist/'))
    .pipe(browsersync.stream());
}


//
// Testing environment
//

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist"
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}


//
// Watch and build scripts
//

const watch =
  gulp.series(
    clean,
    gulp.parallel(
      sprite,
      images,
      jslint,
      csslint
    ),
    gulp.parallel(
      cssnoncritical,
      js
    ),
    gulp.parallel(
      csscritical
    ),
    html,
    browserSync,
    watchFiles
  );

const csswatch =
  gulp.series(
    csslint,
    cssnoncritical,
    html,
    csscritical,
    html
  );

const jswatch =
  gulp.series(
    jslint,
    js,
    html
  );

function watchFiles() {
  gulp.watch('./src/scss/**/*.scss', csswatch);
  gulp.watch('./src/js/**/*.js', jswatch);
  gulp.watch('./src/sprite/**/*.svg', sprite);
  gulp.watch('./src/html/**/*.hbs', html);
  gulp.watch('./src/img/**/*', images);
}


//
// Export tasks
//

exports.default = watch;
