import gulp from 'gulp';
import del from 'del';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import cleanCSS from 'gulp-clean-css';
import purgecss from 'gulp-purgecss';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import svgsprite from 'gulp-svg-sprite';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import hb from 'gulp-hb';
import ext from 'gulp-ext-replace'
import browsersync from 'browser-sync';

export const clean = () => del([ 'dist/' ]);

export function scripts() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.js', 'src/js/main.js'], { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browsersync.stream());
}

export function styles() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(purgecss({content: ['dist/*.html']}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.stream());
}

export function sprite() {
  return gulp.src('src/sprite/**/**/*.svg')
    .pipe(svgsprite({
      shape: { spacing: { padding: 5 } },
      mode: { symbol: true },
      svg: { xmlDeclaration: false, doctypeDeclaration: false, namespaceIDs: false, namespaceClassnames: false }
    }))
    .pipe(concat('sprite.hbs'))
    .pipe(gulp.dest('src/html/partials/global/'))
    .pipe(browsersync.stream());
}

export function images() {
  return gulp.src('src/img/**/**/*')
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: true
          },
          {
            name: 'collapseGroups',
            active: true
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/img/'))
    .pipe(browsersync.stream());
}

export function html() {
  return gulp.src('src/html/*.hbs')
    .pipe(hb().partials('src/html/partials/**/*.hbs'))
    .pipe(ext('.html'))
    .pipe(gulp.dest('dist/'))
    .pipe(browsersync.stream());
}

export function browserSync(done) {
  browsersync.init({server: {baseDir: "dist"}, port: 3000});
  done();
}

export function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function watchFiles() {
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('src/sprite/**/*.svg', sprite);
  gulp.watch(['src/html/**/*.hbs', 'src/scss/**/*.scss'], htmlBuild);
  gulp.watch('src/img/**/*', images);
}

const htmlBuild = gulp.series(html, styles);
const build = gulp.series(clean, gulp.parallel(sprite, images, scripts), htmlBuild, browserSync, watchFiles);

export default build;
