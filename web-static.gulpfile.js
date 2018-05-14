const gulp         = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const browsersync  = require('browser-sync').create();
const babel        = require('gulp-babel');
const concat       = require('gulp-concat');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');


gulp.task('build-css', () =>
    gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(concat('index.css'))
        .pipe(sourcemaps.write('../'))
        .pipe(gulp.dest('public/'))
);

gulp.task('build-js', () =>
    gulp.src('src/js/*.es6.js')
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: [ 'env' ] }))
        .pipe(concat('index.js'))
        .pipe(sourcemaps.write('../'))
        .pipe(gulp.dest('public/'))
);

gulp.task('build-all', gulp.parallel('build-css', 'build-js'));


gulp.task('serve-html', () =>
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('public/'))
);

gulp.task('serve-css', () =>
    gulp.src('public/index.css')
        .pipe(browsersync.stream())
);


gulp.task('server', () => {
    browsersync.init({
        server: {
            baseDir: 'public/'
        },
        port: 8080,
        ui: false
    });
    gulp.watch('src/scss/*.scss', gulp.series('build-css', 'serve-css'));
    gulp.watch('src/js/*.es6.js', gulp.series('build-js', browsersync.reload));
    gulp.watch('src/**/*.html',   gulp.series('serve-html', browsersync.reload));
});

gulp.task('default', gulp.series('build-all', 'server'));

