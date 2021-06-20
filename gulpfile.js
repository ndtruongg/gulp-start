const gulp = require("gulp");
// const sass = require("gulp-sass"); // not support @use @forward
const sass = require("gulp-dart-sass");
const minify = require("gulp-minify");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const runSequence = require("gulp4-run-sequence");

gulp.task("html", function () {
  return gulp
    .src("app/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

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
      .pipe(gulp.dest("dist/css"))
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
        }
        // ignoreFiles: ["-min.js"]
      })
    )
    .pipe(gulp.dest("dist/js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});

gulp.task("watch", function () {
  gulp.watch("app/*.html", gulp.series("html"));
  gulp.watch("app/styles/**/*.scss", gulp.series("sass"));
  gulp.watch("app/js/**/*.js", gulp.series("js"));
});

gulp.task("run", function (callback) {
  runSequence(["sass", "js", "html", "watch", "browserSync"], callback);
});
