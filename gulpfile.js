const gulp = require("gulp");
// const sass = require("gulp-sass"); // not support @use @forward
const sass = require("gulp-dart-sass");
const minify = require("gulp-minify");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const runSequence = require("gulp4-run-sequence");

gulp.task("sass", function () {
  return (
    gulp
      .src("./app/styles/*.scss")
      .pipe(sass({ outputStyle: "compressed" })) //minify css
      // .pipe(sass())
      .pipe(
        rename(function (path) {
          path.basename += "";
          path.extname = ".min.css";
        })
      )
      .pipe(gulp.dest("app/styles"))
      .pipe(
        browserSync.reload({
          stream: true
        })
      )
  );
});

gulp.task("js", function () {
  return gulp
    .src("./app/js/*.js")
    .pipe(
      minify({
        ext: {
          min: ".min.js"
        },
        ignoreFiles: ["-min.js"]
      })
    )
    .pipe(gulp.dest("app/js"));
});

gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
});

gulp.task("watch", function () {
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/styles/**/*.scss", gulp.series("sass"));
  gulp.watch("app/js/**/*.js", browserSync.reload);
});

gulp.task("run", function (callback) {
  runSequence(["sass", "watch", "browserSync"], callback);
});
