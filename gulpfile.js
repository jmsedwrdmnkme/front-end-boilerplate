const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const paths = {
    styles: {
        src: './src/scss/**/*.scss',
        dest: './dist/css',
        concat: [
          './node_modules/css-reset-and-normalize/scss/reset-and-normalize.scss',
          './node_modules/bootstrap/scss/bootstrap-grid.scss',
          './node_modules/bootstrap/scss/bootstrap.scss',
          './src/scss/**/*.scss'
        ]
    },
    scripts: {
        src: './src/js/**/*.js',
        dest: './dist/js',
        concat: [
            './node_modules/jquery/dist/jquery.js',
            './node_modules/popper.js/dist/umd/popper.js',
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './src/js/**/*.js'
        ]
    },
    html: {
        src: './src/hbs/*.hbs',
        dest: './dist'
    }
};

sass.compiler = require('node-sass');

function clean() {
    return del([ 'dist' ]);
}

function styles() {
    return gulp.src(paths.styles.concat)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.concat)
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(handlebars())
        .pipe(rename('.html'))
        .pipe(gulp.dest(paths.html.dest));
}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, html);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, html), watch);

gulp.task('build', build);
gulp.task('default', build);
