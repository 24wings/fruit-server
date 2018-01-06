var gulp = require("gulp");


var ts = require('gulp-typescript');
var nodemon = require("gulp-nodemon");
/** gulp-bootstrap  */


var tsProject = ts.createProject('./tsconfig.json');

gulp.task("default", ["compile", 'nodemon', "watch"]);


gulp.task("watch", function() {
    return gulp.watch(["./src/**/*.ts"], ["compile"]);
});


gulp.task("compile", function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));

});

gulp.task("nodemon", function() {
    nodemon({
        script: "dist/www.js",
        // exec: ' ', // set DEBUG=*,-not_this &node --debug
        env: {
            'NODE_ENV': 'production'
        }

    });
});





