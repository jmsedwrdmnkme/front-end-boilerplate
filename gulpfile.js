const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const handlebars = require('gulp-compile-handlebars');
const ext = require('gulp-ext-replace');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const paths = {
    styles: {
        src: 'src/scss/main.scss',
        dist: 'dist/css'
    },
    scripts: {
        src: 'src/js/**/*.js',
        dist: 'dist/js',
        concat: [
            'node_modules/jquery/dist/jquery.slim.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/js/dist/util.js',
            'node_modules/bootstrap/js/dist/alert.js',
            'node_modules/bootstrap/js/dist/button.js',
            'node_modules/bootstrap/js/dist/carousel.js',
            'node_modules/bootstrap/js/dist/collapse.js',
            'node_modules/bootstrap/js/dist/dropdown.js',
            'node_modules/bootstrap/js/dist/index.js',
            'node_modules/bootstrap/js/dist/modal.js',
            'node_modules/bootstrap/js/dist/scrollspy.js',
            'node_modules/bootstrap/js/dist/tab.js',
            'node_modules/bootstrap/js/dist/toast.js',
            'node_modules/bootstrap/js/dist/tooltip.js',
            'node_modules/bootstrap/js/dist/popover.js',
            'src/js/**/*.js'
        ]
    },
    html: {
        src: 'src/hbs/*.hbs',
        dist: 'dist'
    },
    img: {
        src: 'src/img/**/**/*',
        dist: 'dist/img'
    }
};

sass.compiler = require('node-sass');

function clean() {
    return del([ 'dist' ]);
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(cleanCSS())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.styles.dist));
}

function scripts() {
    return gulp.src(paths.scripts.concat)
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.scripts.dist));
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(handlebars())
        .pipe(ext('.html'))
        .pipe(gulp.dest(paths.html.dist));
}

function img() {
    return gulp.src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dist));
}

function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, html);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, html), watch);

gulp.task('build', build);
gulp.task('default', build);
