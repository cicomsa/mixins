const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean')

const sourcePaths = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html'
}
const appPath ={
  root: 'app/',
  css : 'app/css',
  js : 'app/js'
}

gulp.task('sass', () => {
  return gulp.src(sourcePaths.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(appPath.css));
});

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

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html'], () => {
  gulp.watch([sourcePaths.sassSource], ['sass']);
  gulp.watch([sourcePaths.htmlSource], ['copy']);
});

gulp.task('default', ['watch']);
