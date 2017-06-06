var gulp = require('gulp');
var ts = require('gulp-typescript');
const changed = require('gulp-changed');
var connect = require('connect');
var serveStatic = require('serve-static');

gulp.task('ts', function () {
    return gulp.src('Controllers/**/*.ts')
        .pipe(ts({
            allowJs: true,
            allowUnreachableCode: true,
            noImplicitAny: false
        }))
        .pipe(gulp.dest('built/local'));
});

gulp.task('default', ['CopyFromMainProject', 'watch', 'serve']);
gulp.task('serve', function () {
    connect().use(serveStatic(__dirname)).listen(8080, function () {
        console.log('Server running on 8080...');
    });
}
);
const SRC = '../Output/Contoso/*';
const DEST = 'sites/CSOM';
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

gulp.task('CopyFromMainProject', () =>
    sleep(2500).then(gulp.src(SRC)
        .pipe(changed(DEST))
    .pipe(gulp.dest(DEST)))
);
gulp.task('watch', function () {
    gulp.watch('../SiteProvisioningForm/Output/Contoso/*', ['CopyFromMainProject']);
});