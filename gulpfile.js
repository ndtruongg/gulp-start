const gulp = require("gulp");
// gulp-sass not support @use @forward, use gulp-dart-sass to instead
const sass = require("gulp-dart-sass");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");

const browserSync = require("browser-sync").create();
const runSequence = require("gulp4-run-sequence");
const del = require("del");

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
    .pipe(uglify())
    .pipe(concat("all.min.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("images", function () {
  return gulp
    .src("app/images/**/*.+(png|jpg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/images"));
});

gulp.task("fonts", function () {
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

// clean dist folder
gulp.task("clean:dist", function () {
  return del.sync(["dist"]);
});

// remove cache image
gulp.task("cache:clear", function (callback) {
  return cache.clearAll(callback);
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
  gulp.watch("app/images/*", gulp.series("images"));
  gulp.watch("app/fonts/*", gulp.series("fonts"));
});

gulp.task("run", function (callback) {
  runSequence(
    [
      "clean:dist",
      "sass",
      "js",
      "html",
      "images",
      "fonts",
      "watch",
      "browserSync"
    ],
    callback
  );
});
