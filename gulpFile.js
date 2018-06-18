const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const reload = browserSync.reload
const autoprefixer = require('gulp-autoprefixer')

const sourcePath = {
  sassSource : "src/scss/*.scss"
}

const appPath = {
  root: 'app/',
  css : 'app/css',
  js : 'app.js'
}

gulp.task('sass', () => {
  return gulp.src(sourcePath.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(appPath.css));
})


gulp.task('serve', ['sass'], () => {
  browserSync.init([appPath.css + '/*.css', appPath.root + '/*.html', appPath.js + '/*.js'], {
    server: {
      baseDir : appPath.root
    }
  })
})

gulp.task('watch', ['serve', 'sass'], () => {
  gulp.watch([sourcePath.sassSource], ['sass']);
})


gulp.task('default', ['watch'])
