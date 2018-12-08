const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const injectPartials = require('gulp-inject-partials');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');

const sourcePaths = {
  sourceFolder: 'src/',
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  jsSource: 'src/js/*.js',
  imgSource: 'src/img/**'
};
const appPath = {
  root: 'app',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
};

gulp.task('sass', function() {
  const bootstrapCSS = gulp.src(
    './node_modules/bootstrap/dist/css/bootstrap.css'
  );
  const sassFiles = gulp
    .src(sourcePaths.sassSource)
    .pipe(autoprefixer())
    //nested, compact expanded compressed
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError));

  return merge(sassFiles, bootstrapCSS)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('scripts', function() {
  gulp
    .src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(appPath.js));
});

gulp.task('serve', ['sass'], function() {
  browserSync.init(
    [appPath.css + '/*.css', appPath.root + '/*.html', appPath.js + '/*.js'],
    {
      server: {
        baseDir: appPath.root
      }
    }
  );
});

gulp.task('clean-scripts', function() {
  return gulp
    .src(appPath.js + '/*.js', { read: false, force: true })
    .pipe(clean());
});

gulp.task('clean-html', function() {
  return gulp
    .src(appPath.root + '/*.html', { read: false, force: true })
    .pipe(clean());
});

/*
gulp.task('copy',['clean-html'], function() {
  gulp.src([sourcePaths.htmlSource], 
      {base: sourcePaths.sourceFolder})
      .pipe(gulp.dest(appPath.root));
});
*/

gulp.task('moveFonts', function() {
  gulp
    .src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(appPath.fonts));
});

gulp.task('images', function() {
  return gulp
    .src(sourcePaths.imgSource)
    .pipe(newer(appPath.img))
    .pipe(imagemin())
    .pipe(gulp.dest(appPath.img));
});

gulp.task('html', function() {
  return gulp
    .src(sourcePaths.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(appPath.root));
});

gulp.task('compressJs', function() {
  gulp
    .src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(appPath.js));
});

gulp.task('compressCss', function() {
  const bootstrapCSS = gulp.src(
    './node_modules/bootstrap/dist/css/bootstrap.css'
  );
  const sassFiles = gulp
    .src(sourcePaths.sassSource)
    .pipe(autoprefixer())
    //nested, compact expanded compressed
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError));

  return merge(sassFiles, bootstrapCSS)
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'));
});

gulp.task('minifyHtml', function() {
  return gulp
    .src(sourcePaths.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(appPath.root));
});

gulp.task('production', ['minifyHtml', 'compressCss', 'compressJs']);

gulp.task(
  'watch',
  ['serve', 'scripts', 'sass', 'moveFonts', 'images', 'html', 'clean-html'],
  function() {
    gulp.watch([sourcePaths.sassSource], ['sass']);
    gulp.watch([sourcePaths.jsSource], ['scripts']);
    gulp.watch([sourcePaths.imgSource], ['images']);
    gulp.watch(
      [sourcePaths.htmlSource, sourcePaths.htmlPartialSource],
      ['html']
    );
  }
);

gulp.task('default', ['watch']);
