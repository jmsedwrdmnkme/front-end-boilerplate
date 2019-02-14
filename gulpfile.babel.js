'use strict';

const ico = require('gulp-to-ico');
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const stylish = require('jshint-stylish');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const jshint = require('gulp-jshint');
const ext = require('gulp-ext-replace');
const imagemin = require('gulp-imagemin');
const sasslint = require('gulp-sass-lint');
const svgsprite = require('gulp-svg-sprite');
const mustache = require("gulp-mustache");
const browsersync = require('browser-sync').create();

const paths = {
  styles: {
    src: './src/scss/main.scss', // Lazyloaded non-critical CSS
    critical: './src/scss/critical.scss', // Critical inline CSS in head
    watch: './src/scss/**/**/*.scss',
    dist: './dist/css/'
  },
  fonts: {
    src: './src/fonts/*.scss'
  },
  icons: {
    src: './src/icon/favicon.png',
    dist: './dist/'
  },
  scripts: {
    src: './src/js/main.js', // Main JS files, non-critical, lazyloaded after initial paint
    critical: './src/js/critical.js', // Critical inline JS within footer
    lazyjs: './node_modules/loadjs/dist/loadjs.min.js', // Lazyload JS library
    lazycss: './node_modules/fg-loadcss/dist/cssrelpreload.min.js', // Lazyload CSS library
    dist: './dist/js/',
    concat: [ // Jquery + Popper + Util required, Bootstrap modules as needed, lazyloaded
      './node_modules/jquery/dist/jquery.slim.js',
      './node_modules/popper.js/dist/umd/popper.js',
      './node_modules/jquery-lazy/jquery.lazy.js',
      './node_modules/jquery-lazy/jquery.lazy.plugins.js',
      './node_modules/bootstrap/js/dist/util.js',
      './node_modules/bootstrap/js/dist/alert.js',
      './node_modules/bootstrap/js/dist/button.js',
      './node_modules/bootstrap/js/dist/carousel.js',
      './node_modules/bootstrap/js/dist/collapse.js',
      './node_modules/bootstrap/js/dist/dropdown.js',
      './node_modules/bootstrap/js/dist/index.js',
      './node_modules/bootstrap/js/dist/modal.js',
      './node_modules/bootstrap/js/dist/scrollspy.js',
      './node_modules/bootstrap/js/dist/tab.js',
      './node_modules/bootstrap/js/dist/toast.js',
      './node_modules/bootstrap/js/dist/tooltip.js',
      './node_modules/bootstrap/js/dist/popover.js',
      './src/js/main.js'
    ]
  },
  html: {
    src: './src/mustache/*.mustache',
    watch: './src/mustache/**/*.mustache',
    dist: './dist/'
  },
  img: {
    src: './src/img/**/**/*',
    dist: './dist/img/'
  },
  sprite: {
    src: './src/sprite/**/**/*.svg',
    dist: './src/mustache/partials/global/'
  }
};

sass.compiler = require('node-sass');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "dist"
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean dist dir
function clean() {
  return del(paths.html.dist);
}

// Icon
function icons() {
  return gulp
    .src(paths.icons.src, { allowEmpty: true })
    .pipe(ico('favicon.ico', { resize: true, sizes: [16, 24, 32, 64] }))
    .pipe(gulp.dest(paths.icons.dist))
    .pipe(browsersync.stream());
}

// Styles
function scss() {
  return gulp
    .src(paths.styles.src, { allowEmpty: true })
    .pipe(sasslint({'config': '.sass-lint.yml'}))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browsersync.stream());
}

function scsslazyload() {
  return gulp
    .src(paths.styles.critical, { allowEmpty: true })
    .pipe(sasslint({'config': '.sass-lint.yml'}))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(cleanCSS())
    .pipe(concat('criticalcss.scss'))
    .pipe(ext('.mustache'))
    .pipe(gulp.dest(paths.sprite.dist))
    .pipe(browsersync.stream());
}

// Fonts
function fonts() {
  return gulp
    .src(paths.fonts.src, { allowEmpty: true })
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browsersync.stream());
}

// JS
function jslint() {
  return gulp
    .src([paths.scripts.src, './gulpfile.js'], { allowEmpty: true })
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(browsersync.stream());
}

function jslazyload() {
  return gulp
    .src([paths.scripts.lazyjs, paths.scripts.lazycss], { allowEmpty: true })
    .pipe(ext('.mustache'))
    .pipe(gulp.dest(paths.sprite.dist))
    .pipe(browsersync.stream());
}

function jscritical() {
  return gulp
    .src(paths.scripts.critical, { allowEmpty: true })
    .pipe(
      babel({
        presets: ['@babel/env'],
        overrides: [{
          test: './node_modules/**',
          sourceType: 'script'
        }]
      })
    )
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
    .pipe(concat('criticaljs.js'))
    .pipe(ext('.mustache'))
    .pipe(gulp.dest(paths.sprite.dist))
    .pipe(browsersync.stream());
}

function js() {
  return gulp
    .src(paths.scripts.concat, { allowEmpty: true })
    .pipe(
      babel({
        presets: ['@babel/env'],
        overrides: [{
          test: './node_modules/**',
          sourceType: 'script'
        }]
      })
    )
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
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(browsersync.stream());
}

// Handlebars
function html() {
  return gulp
    .src(paths.html.src, { allowEmpty: true })
    .pipe(
      mustache()
    )
    .pipe(ext('.html'))
    .pipe(gulp.dest(paths.html.dist))
    .pipe(browsersync.stream());
}

// Images
function img() {
  return gulp
    .src(paths.img.src, { allowEmpty: true })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
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
    .pipe(gulp.dest(paths.img.dist))
    .pipe(browsersync.stream());
}

// Icon sprite
function sprite() {
  return gulp
    .src(paths.sprite.src, { allowEmpty: true })
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
    .pipe(concat('iconsprite.mustache'))
    .pipe(gulp.dest(paths.sprite.dist))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch(paths.styles.watch, scss, scsslazyload, html);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.icons.src, icons);
  gulp.watch(paths.scripts.src, jslint, jscritical, js, jslazyload);
  gulp.watch(paths.sprite.src, sprite);
  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.img.src, img);
}

// define complex tasks
const watch =
  gulp.series(
    clean,
    gulp.parallel(
      fonts,
      icons,
      img,
      sprite,
      scss,
      scsslazyload,
      jscritical,
      jslint,
      js,
      jslazyload
    ),
    gulp.parallel(
      html
    ),
    browserSync,
    watchFiles
  );

// export tasks
exports.default = watch;
