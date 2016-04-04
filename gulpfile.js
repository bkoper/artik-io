/*
 The MIT License (MIT)

 Copyright (c) 2016 Bartlomiej Koper <bkoper@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

var gulp = require("gulp");
var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");
var eslint = require("gulp-eslint");
var jscs = require("gulp-jscs");
var path = require("path");
var watch = require("gulp-watch");
var batch = require("gulp-batch");
var del = require("del");
var concat = require("gulp-concat");

const SRC_PATH = "./src/";
const DEST_PATH = "./build";


buildTaskFactory("lib", "lib");
buildTaskFactory("examples", "examples");
buildTaskFactory("devices", "devices");

gulp.task("default", ["lib", "examples", "devices"]);

gulp.task("watch", () => {
    watch(path.join(SRC_PATH, "**/*.js"), batch((events, done) => events !== "error" && gulp.start("default", done)));
});

gulp.task("eslint", () => gulp.src(SRC_PATH)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError()));

gulp.task("jscs", () => gulp.src(SRC_PATH)
        .pipe(jscs({fix: true}))
        .pipe(jscs.reporter())
        .pipe(jscs.reporter("fail")));

gulp.task("clean", () => del(path.join(DEST_PATH, "/", "*")));

function buildTaskFactory(name, src, concatFile) {
    gulp.task(name, ["jscs", "eslint"], () => {
        var stream = gulp.src(path.join(SRC_PATH, src, "*.js")).pipe(sourcemaps.init());

        return (concatFile ? stream.pipe(concat(concatFile)) : stream)
            .pipe(babel({
                babelrc: true
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(DEST_PATH));
    });
}