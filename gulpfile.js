/// <binding ProjectOpened='default' />
/* File: gulpfile.js */
// grab our gulp packages
var concat = require("gulp-concat"),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    notify = require("gulp-notify"),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ts = require('gulp-typescript'),
    webparts = require("./createWebparts.js"),
    tsProject = ts.createProject('tsconfig.json', {
        allowJs: false,
        allowUnreachableCode: true,
        noImplicitAny: false
    }),
    tsVendor = ts.createProject('tsconfig.json', {
        allowJs: true,
        allowUnreachableCode: true,
        noImplicitAny: false
    }),
    tsInitProject = ts.createProject('tsconfig.json', {
        allowJs: true,
        allowUnreachableCode: true,
        noImplicitAny: false
    })

function handleError(level, error) {
   gutil.log(error.message);
   if (gutil.env.type === 'production') {
       console.log("Build Errors Check Log");
       process.exit(1);
   }
}

function onError(error) { handleError.call(this, 'error', error);}
//Could be created into a node plugin
function genericConcat(array, name, type) {
    return gulp.src(array)
        .pipe((gutil.env.type === 'production' && type === 'JS') || (type === "INIT") ? sourcemaps.init() : gutil.noop())
        .pipe(concat(type !== "INIT" ? 'bundle.' + type.toLowerCase() : "init.js"))
        //only uglify if gulp is ran with '--type production'
        .pipe((gutil.env.type === 'production' && type === 'JS') || (type === "INIT") ? uglify() : gutil.noop())
        .pipe((gutil.env.type === 'production' && type === 'JS') || (type === "INIT") ? sourcemaps.write("/") : gutil.noop())
        .pipe(gulp.dest('./Output/' + name))
        .pipe(notify(gutil.env.type === 'production' ? 'Compliled Production ' + name + ' ' + type + '!' : 'Compliled Debug ' + name + ' ' + type + '!'))
        .on('error', onError)

}
function vendorConcat(array, name, type) {
    return gulp.src(array)
        .pipe(concat("vendor.css"))
        //only uglify if gulp is ran with '--type production'
        .pipe(gulp.dest('./Output/' + name))
        .pipe(notify(gutil.env.type === 'production' ? 'Compliled Production ' + name + ' ' + type + '!' : 'Compliled Debug ' + name + ' ' + type + '!'))
        .on('error', onError)

}
gulp.task("ts", function () {
    delete require.cache[require.resolve('./App/Scripts/config.js')];
    var files = require('./App/Scripts/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        var name = files.projects[i];
        var type = "JS";
        var tsResult = gulp.src(files[files.projects[i]]["Controllers"])
            .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
            .pipe(tsProject())
            .on('error', onError)
            

        return tsResult
            .pipe(concat('bundle.js')) // You can use other plugins that also support gulp-sourcemaps
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())            
            .pipe(sourcemaps.write("/")) // Now the sourcemaps are added to the .js file 
            .pipe(gulp.dest('./Output/' + name))
            .pipe(notify(gutil.env.type === 'production' ? 'Compliled Production ' + name + ' ' + type + '!' : 'Compliled Debug ' + name + ' ' + type + '!'))

    }
})
gulp.task("vendorjs", function () {
    delete require.cache[require.resolve('./App/Scripts/config.js')];
    var files = require('./App/Scripts/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        var name = files.projects[i];
        var type = "Vendor";
        var tsResult = gulp.src(files[files.projects[i]]["Vendor"])
            .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
            .pipe(tsVendor())
            .on('error', onError)
            

        return tsResult
            .pipe(concat('vendor.js')) // You can use other plugins that also support gulp-sourcemaps
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())            
            .pipe(sourcemaps.write("/")) // Now the sourcemaps are added to the .js file 
            .pipe(gulp.dest('./Output/' + name))
            .pipe(notify(gutil.env.type === 'production' ? 'Compliled Production ' + name + ' ' + type + '!' : 'Compliled Debug ' + name + ' ' + type + '!'))

    }
})
gulp.task('css', function () {
    delete require.cache[require.resolve('./App/Style/config.js')];
    var files = require('./App/Style/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        genericConcat(files[files.projects[i]], files.projects[i], "CSS");
    }
});
gulp.task('vendorcss', function () {
    delete require.cache[require.resolve('./App/Style/config.js')];
    var files = require('./App/Style/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        vendorConcat(files["Vendor"], files.projects[i], "Vendor CSS");
    }
});
gulp.task('html', function () {
    delete require.cache[require.resolve('./App/Templates/config.js')];
    var files = require('./App/Templates/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        genericConcat(files[files.projects[i]], files.projects[i], "HTML");
    }
});
gulp.task('preboot', function () {
    // var init = 'App/Scripts/Helpers/Contoso/init.js';
    // genericConcat(init, "Contoso", "INIT");
    delete require.cache[require.resolve('./App/Scripts/config.js')];
    var files = require('./App/Scripts/config.js');
    for (var i = 0; i < files.projects.length; i++) {
        var name = files.projects[i];
        var type = "Init";
        var tsResult = gulp.src(files[files.projects[i]]["Init"]) //ADD .Init to loop through the init files only
            .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
            .pipe(tsInitProject())
            .on('error', onError)

        return tsResult
            .pipe(concat('init.js')) // You can use other plugins that also support gulp-sourcemaps
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())            
            .pipe(sourcemaps.write("/")) // Now the sourcemaps are added to the .js file 
            .pipe(gulp.dest('./Output/' + name))
            .pipe(notify(gutil.env.type === 'production' ? 'Compliled Production ' + name + ' ' + type + '!' : 'Compliled Debug ' + name + ' ' + type + '!'));
    }
});

gulp.task('watch', function () {
    gulp.watch('App/Scripts/**/*.ts', ['ts']); 
    gulp.watch('App/Scripts/**/*.js', ['vendorjs']); 
    gulp.watch('App/Style/**/*', ['css']);
    gulp.watch('App/Templates/**/*', ['html']);
    gulp.watch('App/WebParts/config.js', ['webparts']);
    gulp.watch('App/Scripts/Helpers/OSC/init.js', ['preboot']);
});

gulp.task('default', ['ts', 'css', 'html', 'webparts', 'preboot', 'vendorjs','vendorcss', 'watch']);
gulp.task('build', ['ts', 'css', 'html', 'webparts', 'preboot', 'vendorjs', 'vendorcss']);