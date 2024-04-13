let project_folder = require("path").basename(__dirname);
let source_folder ="src";
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js:project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
		iconsfont: project_folder + "/icons-font/"
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: [source_folder + "/scss/main.scss"],
		js:source_folder + "/js/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fontsTtf: source_folder + "/fonts/*.ttf",
		fontsWoff: source_folder + "/fonts/*.woff",
		fontsWoff2: source_folder + "/fonts/*.woff2",
		iconsfont: source_folder + "/icons-font/**/*.*"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js:source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
	},
	clean: "./" + project_folder + "/"
}
const { src, dest } = require('gulp')
const gulp = require('gulp')
const browsersync = require("browser-sync").create()
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const fileinclude = require("gulp-file-include")
const del = require("del")
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const clean_css = require("gulp-clean-css")
const prefixer = require('gulp-autoprefixer')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const webphtml = require('gulp-webp-html')
const svgsprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
fs = require('fs');
function browserSync() {
	browsersync.init({
		server:{
			baseDir: "./" + project_folder + "/"
		},
		port: 8000,
		notify:false
	})
}
function html() {
	return src(path.src.html)
	.pipe(fileinclude())
	.pipe(webphtml())
	.pipe(dest(path.build.html))
	.pipe(browsersync.stream())
}
function css() {
	return src(path.src.css)
	.pipe(scss({
		includePaths: ['node_modules']
	}))
	.pipe(prefixer({
		overrideBrowserslist:['last 10 versions'],
		cascade:false,
		grid:true
	})
	)
	.pipe(concat('main.css'))
	.pipe(dest(path.build.css))
	.pipe(concat('main.min.css'))
	.pipe(clean_css())
	.pipe(dest(path.build.css))
	.pipe(browsersync.stream())
}
function js() {
	return src(path.src.js)
	.pipe(browsersync.stream())
	.pipe(webpackStream(webpackConfig), webpack)
	.pipe(dest(path.build.js))
}
function images() {
	return src(path.src.img)
	.pipe(
		webp({
			quality:80
		})
		)
	.pipe(dest(path.build.img))
	.pipe(src(path.src.img))
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({quality: 85, progressive: true}),
		imageminPngquant(),
		imagemin.svgo({
			plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
			]
		})
		]))
	.pipe(dest(path.build.img))
	.pipe(browsersync.stream())
}
function fonts() {
	return src(path.src.fontsTtf)
	.pipe(ttf2woff())
	.pipe(dest(path.build.fonts))
	.pipe(src(path.src.fontsTtf))
	.pipe(ttf2woff2())
	.pipe(dest(path.build.fonts))
	.pipe(src(path.src.fontsWoff))
	.pipe(dest(path.build.fonts))
	.pipe(src(path.src.fontsWoff2))
	.pipe(dest(path.build.fonts))
}
function svgSprite() {
	return src([source_folder + '/icons/*.svg'])
	.pipe(svgsprite({
		mode:{
			stack:{
				sprite:"../icons/icons.svg"
			}
		}
	}))
	.pipe(dest(path.build.img))
}
function iconsFont() {
	return src(path.src.iconsfont)
	.pipe(gulp.dest(path.build.iconsfont))
}

function cb() {

}

function watchFiles() {
	gulp.watch([path.watch.html],html);
	gulp.watch([path.watch.css],css);
	gulp.watch([path.watch.js],js);
	gulp.watch([path.watch.img],images);
}

function start() {
	browserSync()
	watchFiles()
}

function clean() {
	return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(html, js, css, images, fonts, svgSprite));
let watch = gulp.parallel(build, browserSync, watchFiles);

exports.start = start;
exports.browserSync = browserSync;
exports.iconsFont = iconsFont;
exports.svgSprite = svgSprite;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;