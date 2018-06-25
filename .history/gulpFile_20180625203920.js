const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('gulp-browserify')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const merge = require('merge-stream')

const sourcePaths = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/*.js'
}
const appPath ={
  root: 'app/',
  css : 'app/css',
  js : 'app/js/'
}

gulp.task('sass', () => {
  const bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')

  const sassFiles = gulp.src(sourcePaths.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

    return merge(bootstrapCSS, sassFiles)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(appPath.css));
});

gulp.task('scripts', ['clean-scripts'], () => {
  gulp.src(sourcePaths.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(appPath.js))

})

gulp.task('clean-scripts', () => {
  return gulp.src(appPath.js + '/*.js', {read:false, force: true})
    .pipe(clean())
})

gulp.task('clean-html', () => {
  return gulp.src(appPath.root + '/*.html', {read:false, force: true})
    .pipe(clean())
})

gulp.task('copy', ['clean-html'], () => {
  return gulp.src(sourcePaths.htmlSource)
    .pipe(gulp.dest(appPath.root))
});

gulp.task('serve', ['sass'], () => {
  browserSync.init([appPath.css + '/*.css', appPath.root + '/*.html', appPath.js + '/*.js'], {
    server: {
      baseDir : appPath.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'scripts', 'clean-scripts'], () => {
  gulp.watch([sourcePaths.sassSource], ['sass']);
  gulp.watch([sourcePaths.htmlSource], ['copy']);
  gulp.watch([sourcePaths.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);
