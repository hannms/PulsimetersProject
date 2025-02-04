const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const devip = require("dev-ip");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task("server", function() {
	browserSync({
		server: {
			baseDir: "dist"
		}
	});

	gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function() {
	return gulp
		.src("src/sass/**/*.+(scss|sass)")
		.pipe(
			sass({
				outputStyle: "compressed"
			}).on("error", sass.logError)
		)
		.pipe(
			rename({
				suffix: ".min",
				prefix: ""
			})
		)
		.pipe(autoprefixer())
		.pipe(
			cleanCSS({
				compatibility: "ie8"
			})
		)
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});

gulp.task("watch", function() {
	gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
	gulp.watch("src/*.html").on("change", gulp.parallel('html'));
});

gulp.task('html', function(){
	return gulp.src("src/*.html")
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function(){
	return gulp.src("src/js/**/*.js")
	.pipe(gulp.dest("dist/js"));
});

gulp.task('fonts', function(){
	return gulp.src("src/fonts/**/*")
	.pipe(gulp.dest("dist/fonts"));
});
gulp.task('images', function(){
	return gulp.src("src/images/**/*")
	.pipe(imagemin())
	.pipe(gulp.dest("dist/images"));
});
gulp.task('mailer', function(){
	return gulp.src("src/mailer/**/*")
	.pipe(gulp.dest("dist/mailer"));
});


gulp.task("default", gulp.parallel("watch", "server", "styles", "html", "scripts", "fonts", "images", "mailer"));
devip();
