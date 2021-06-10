var gulp = require("gulp");
var sass = require("gulp-sass");
const minify = require("gulp-minify");
const rename = require("gulp-rename");

gulp.task("sass", function () {
  return gulp
    .src("./app/styles/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      rename(function (path) {
        path.basename += "";
        path.extname = ".min.css";
      })
    )
    .pipe(gulp.dest("app/styles"));
});

gulp.task("js", function () {
  return gulp
    .src("./app/js/*.js")
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
        ignoreFiles: ["-min.js"],
      })
    )
    .pipe(gulp.dest("app/js"));
});

gulp.task("watch", function () {
  gulp.watch("./app/styles/*.scss", gulp.series("sass"));
  gulp.watch("./app/js/*.js", gulp.series("js"));
});
