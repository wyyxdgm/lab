let gulp = require('gulp')
let gutil = require('gulp-util')
let fs = require('fs');
let path = require('path');
let ejs = require('ejs');
let watchPath = require('gulp-watch-path')
let _ = require('underscore');
const reload = require('require-nocache')(module);

let cssminify = require("gulp-clean-css");
let rename = require('gulp-rename');
let less = require('gulp-less');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let clean = require('gulp-clean');
let changed = require("gulp-changed");
var browserSync = require('browser-sync').create();
let concatCss = require('gulp-concat-css');
let watch = require('@jindasong/gulp-watch');

let useChanged = false;
let CONFIG = require('./config');
let compile = require('./lib/compile.js')
let DIST = CONFIG.dist;
const ACTIVE_MENU = CONFIG.ACTIVE_MENU;
/**
 * source solution
 * append: css(less),js
 * replace: video,files,img
 * build: html
 */
const HOST = CONFIG.IMG_HOST;
gulp.task('build:html', function(cb) {
  fs.readdir('./src/pages', function(err, files) {
    files.forEach(file => file.indexOf('.html') > 0 && buildPages(file.replace('.html', '')));
    cb();
  })
})

gulp.task('build:html:prod', function(cb) {
  fs.readdir('./src/pages', function(err, files) {
    files.forEach(file => file.indexOf('.html') > 0 && buildPages(file.replace('.html', ''), HOST));
    cb();
  })
})

gulp.task('watchi18n', function(cb) {
  // watch(['i18n/*.js'], function(event) {
  //   var paths = watchPath(event, 'i18n', 'i18n');
  //   gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
  //   gutil.log('Dist ' + paths.distPath.replace('i18n/', '').replace(/\.\w+$/, '/index.html'));
  //   gulp.run('build:html');
  // });
  cb();
});


const cleanFiles = (fileList, cb) => {
  gutil.log('Clean ' + fileList);
  return gulp.src(fileList, {
      read: false
    })
    .pipe(clean({
      force: true
    })).on('end', cb);
}
const filter = require('./lib/filter');

function buildEach(src, concatName, config) {
  const { src: srcOrigin, needCssmin, base, dist, isProd } = config;
  return new Promise((resolve, reject) => {
    let line;
    console.log('buildEach', src);
    line = gulp.src(src, {
      base: "src/css"
    });
    line = line.pipe(less())
    line = line.pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1', 'last 5 versions'])]));
    line = line.pipe(concatCss(concatName || 'style.css'));
    if (needCssmin) line = line.pipe(cssminify());
    line = line.pipe(rename(function(path) {
      path.extname = '.css';
    }));
    let dest = undefined !== dist ? `${DIST}/${dist}` : `${DIST}/css/`;
    if (useChanged) line = line.pipe(changed(dest))
    // if (isProd) line = line.pipe(filter({ host: HOST }));
    line = line.pipe(gulp.dest(dest)).on('end', function() {
      console.log('buildEach done!');
      resolve();
    });
  })
}
let buildStyle = _.throttle((src, needCssmin, base, dist, isProd, cb = () => { console.log(`buildStyle done: ${src}`) }) => {
  try {
    Promise.all([
        buildEach([
          'src/css/common.css'
        ], 'common.css', { src, needCssmin, base, dist, isProd }),
        buildEach([
          'src/css/pc.css',
        ], 'pc.css', { src, needCssmin, base, dist, isProd }),
        buildEach([
          'src/css/h5.css',
        ], 'h5.css', { src, needCssmin, base, dist, isProd })
      ])
      .then(() => {
        let line;
        console.log('buildStyle', src);
        line = gulp.src([
          'dist/css/common.css',
          'dist/css/pc.css',
          'dist/css/h5.css',
        ], {
          base: "dist/css"
        });
        line = line.pipe(less())
        line = line.pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1', 'last 5 versions'])]));
        line = line.pipe(concatCss('style.css'));
        if (needCssmin) line = line.pipe(cssminify());
        line = line.pipe(rename(function(path) {
          path.extname = '.css';
        }));
        let dest = undefined !== dist ? `${DIST}/${dist}` : `${DIST}/css/`;
        if (useChanged) line = line.pipe(changed(dest))
        if (isProd) line = line.pipe(filter({ host: HOST }));
        line = line.pipe(gulp.dest(dest)).on('end', function() {
          console.log('buildStyle done!');
          cb();
        });
      })
    // return line;
  } catch (e) {
    console.log('buildStyle error', e);
  }
}, 100);

gulp.task('watchdev', function(cb) {

  if (!fs.existsSync('lab')) fs.mkdirSync('lab');
  if (!fs.existsSync('lab/src')) fs.mkdirSync('lab/src');
  if (!fs.existsSync('lab/dist')) fs.mkdirSync('lab/dist');
  watch(['lab/src/**'], _.throttle(function(event) {
    var paths = watchPath(event, 'lab/src/', 'lab/dist/')
    gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
    // html
    if (/\.html$/.test(paths.srcPath)) {
      if ('deleted' == event.type) return cleanFiles([paths.distPath, paths.distPath.replace(/\.html$/, '.*.js')]);
      gutil.log('Dist ' + paths.distPath)
      compile.buildTemplate(paths.srcPath, paths.distPath);
    }
    // css
    if (/\.css|\.txt$/.test(paths.srcPath)) {
      if ('deleted' == event.type) return cleanFiles([paths.distPath.replace(/\.\w+$/, '.css')]);
      gutil.log('Dist ' + paths.distPath)
      compile.buildCss(paths.srcPath, paths.distPath);
    }
  }, 500));
  cb();
});

gulp.task('watchcss', function(cb) {
  watch(['src/css/*.css'], function(event) {
    var paths = watchPath(event, 'src/css', 'dist/css')
    gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    buildStyle(paths.srcPath);
  })
  // Object.keys(CONFIG.i18n).forEach((lang) => {
  //   watch(['src/css/*.css', `src/i18n/${lang}/css/*.css`], function(event) {
  //     var paths = watchPath(event, `src/i18n/${lang}/css`, `dist/i18n/${lang}/css`)
  //     gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
  //     gutil.log('Dist ' + paths.distPath)
  //     buildStyle(['src/css/*.css'], CONFIG.minCss, `src/i18n/${lang}/css`, `i18n/${lang}/css`);
  //   })
  // });
  cb();
})

gulp.task('css', function(cb) {
  buildStyle('src/css/*.css', CONFIG.minCss, undefined, undefined, undefined, cb);
  // Object.keys(CONFIG.i18n).forEach((lang) => {
  //   buildStyle(['src/css/*.css', `src/i18n/${lang}/css/*.css`], CONFIG.minCss, `src/i18n/${lang}/css`, `i18n/${lang}/css`);
  //   cb();
  // });
});


gulp.task('css:prod', function(cb) {
  buildStyle('src/css/*.css', CONFIG.minCss, undefined, undefined, true, cb);
  // Object.keys(CONFIG.i18n).forEach((lang) => {
  //   buildStyle(['src/css/*.css', `src/i18n/${lang}/css/*.css`], CONFIG.minCss, `src/i18n/${lang}/css`, `i18n/${lang}/css`);
  //   cb();
  // });
});

gulp.task('serve', function(cb) {
  browserSync.init({
    watch: true,
    files: ['dist/**'],
    port: 8888,
    server: {
      baseDir: 'dist', // 设置服务器的根目录
      index: "zh/index.html"
    }
  });
  cb();
});


gulp.task('clean', (cb) => cleanFiles('dist/', cb));

gulp.task('watchcopy', function(cb) {
  watch([
    'src/fonts/**',
    'src/files/**',
    'src/img/**',
    'src/video/**',
    'src/js/**',
    'src/robots.txt'
  ], function(event) {
    console.log(event)
    var paths = watchPath(event, 'src/', 'dist/')
    gutil.log('copy', paths.srcPath.replace(/\\/g, '/'), paths.distPath.replace(/\\/g, '/'))
    gulp.src(paths.srcPath, { allowEmpty: true })
      .pipe(gulp.dest(paths.distDir))
  })
  watch([
    'oss/**'
  ], function(event) {
    console.log(event)
    var paths = watchPath(event, 'oss/', 'dist/')
    gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)

    gulp.src(paths.srcPath, { allowEmpty: true })
      .pipe(gulp.dest(paths.distDir))
  })
  cb();
})

gulp.task('copy', function(cb) {
  gulp.src([
      'src/fonts/**',
      'src/files/**',
      'src/img/**',
      'src/video/**',
      'src/js/**'
    ], {
      base: 'src/'
    })
    .pipe(gulp.dest('dist/')).on('end', cb);
  gulp.src([
      'src/i18n/**/fonts/**',
      'src/i18n/**/files/**',
      'src/i18n/**/img/**',
      'src/i18n/**/video/**',
      'src/i18n/**/js/**'
    ], {
      base: 'src/'
    })
    .pipe(gulp.dest('dist/'))
  gulp.src(['public/**'], {
      base: 'public/'
    })
    .pipe(gulp.dest('dist/'))
});

gulp.task('watchhtml', function(cb) {
  watch(['src/pages/*.html'], function(event) {
    var paths = watchPath(event, 'src/pages/', 'dist/')
    gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
    buildPages(paths.distPath.replace(/dist(\/|\\)/, '').replace('.html', ''))
  })
  watch(['src/pages/template/*.html'], gulp.series('build:html'), function(event) {
    var paths = watchPath(event, 'src/pages/template/', 'dist/')
    gutil.log(gutil.colors.green(event.type || 'changed') + ' ' + paths.srcPath)
    gutil.log('Dist ' + paths.distPath)
  })
  cb();
})

function buildPages(htmlName, host) {
  let langs = [];
  Object.keys(CONFIG.i18n).forEach(function(lang) {
    let i18n = require(`./i18n/${lang}`);
    langs.push({
      lang: lang,
      i18n: i18n
    });
  });
  // let indexHtmlStr = fs.readFileSync('./src/index.html').toString();
  langs.forEach((langObj) => {
    let __ = function(key) {
      return langObj.i18n[key] || key;
    }
    console.log('ACTIVE_MENU==', htmlName, ACTIVE_MENU[htmlName])
    ejs.renderFile(`./src/pages/${htmlName}.html`, {
      active: ACTIVE_MENU[htmlName] || CONFIG.MENU.INDEX,
      __: __,
      $LANG: langObj.lang,
      LANG_LIST: langs
    }).then(htmlStr => {
      htmlStr = compile.resolveAssets(htmlStr, langObj.lang, host);
      if (!fs.existsSync('./dist/')) fs.mkdirSync('./dist');
      if (!fs.existsSync(`./dist/${langObj.lang}`)) fs.mkdirSync(`./dist/${langObj.lang}`);
      let distHtmlPath = path.join('./dist', `${langObj.lang}/${htmlName}.html`);
      fs.writeFile(distHtmlPath, htmlStr, () => {
        gutil.log(gutil.colors.green('Build Html'), `${langObj.lang}/${htmlName}.html`)
      });
    })
  });
}
// // 更新所有html
// gulp.task('build:html', function() {
//   let langs = [];
//   Object.keys(CONFIG.i18n).forEach(function(lang) {
//     let i18n = reload(`./i18n/${lang}`);
//     langs.push({
//       lang: lang,
//       i18n: i18n
//     });
//   });
//   // let indexHtmlStr = fs.readFileSync('./src/index.html').toString();
//   langs.forEach((langObj) => {
//     let __ = function(key) {
//       return langObj.i18n[key] || key;
//     }
//     _.each(['index', 'about'], htmlName => {
//       ejs.renderFile(`./src/${htmlName}.html`, {
//         __: __,
//         $LANG: langObj.lang,
//         LANG_LIST: langs
//       }).then(htmlStr => {
//         htmlStr = compile.resolveAssets(htmlStr, langObj.lang);
//         if (!fs.existsSync('./dist/')) fs.mkdirSync('./dist');
//         if (!fs.existsSync(`./dist/${langObj.lang}`)) fs.mkdirSync(`./dist/${langObj.lang}`);
//         let distHtmlPath = path.join('./dist', `${langObj.lang}/${htmlName}.html`);
//         fs.writeFileSync(distHtmlPath, htmlStr);
//         gutil.log(gutil.colors.green('Build Html'), `${langObj.lang}/${htmlName}.html`)
//       })
//     });

//   });
// });


gulp.task('i18n2xls', function(cb) {
  let i18nJson = {};
  let keys = {};
  Object.keys(CONFIG.i18n).forEach((lang) => {
    i18nJson[lang] = reload(`./i18n/${lang}`);
    keys = _.extend(keys, i18nJson[lang]);
  });
  Object.keys(keys).forEach((key) => {
    keys[key] = _.map(Object.keys(CONFIG.i18n), lang => i18nJson[lang][key]).join('\t');
  });
  fs.writeFileSync('lab/dist/i18n.xls', Object.keys(CONFIG.i18n).join('\t') + '\n' + _.values(keys).join('\n'));
  gutil.log('convert i18n data to xls: lab/dist/i18n.txt');
  cb();
});


gulp.task('xls2i18n', function(cb) {
  let i18nJson = {},
    i18nJsonOld = {};
  let keys = {};
  let str = fs.readFileSync(path.join(__dirname, 'lab/src/i18n.xls')).toString();
  let yxmatrix = str.split('\n').map(line => line.split('\t'));
  console.log(yxmatrix)
  let i18ns = yxmatrix.splice(0, 1)[0];
  yxmatrix.forEach((cols) => { //cols[0] is zh as key
    i18ns.forEach((lang, i) => {
      if (!i18nJson[lang]) i18nJson[lang] = {};
      i18nJson[lang][cols[0]] = cols[i];
    })
  });
  Object.keys(i18nJson).forEach((lang) => {
    try {
      i18nJsonOld[lang] = reload(`./i18n/${lang}`);
    } catch (e) {}
    i18nJson[lang] = _.extend(i18nJsonOld[lang], i18nJson[lang]);
    fs.writeFileSync(path.join(__dirname, `./i18n/${lang}.js`), 'module.exports = ' + JSON.stringify(i18nJson[lang], null, '\t'));
    gutil.log('convert xls to i18n data!!');
  });
  cb();

});


gulp.task('deploy_devs', function(cb) {
  const { deploy } = require('sftp-sync-deploy');
  deploy(CONFIG.dev.sftp.config, CONFIG.dev.sftp.options).then(() => {
    console.log('deploy dev success!');
    cb();
  }).catch(err => {
    console.error('error! ', err);
    cb();
  });
})

gulp.task('deploy_dev', function(cb) {
  const gulpDeployFtp = require('gulp-deploy-ftp');
  gulp.src(CONFIG.dev.ftp.localPath)
    .pipe(gulpDeployFtp(CONFIG.dev.ftp))
    .pipe(gulp.dest('dest')).on('end', cb);
});


var imageResize = require('gulp-image-resize');
gulp.task('p1', function(cb) {
  gulp.src('src/img/brand/**', {
      base: 'src/'
    })
    .pipe(imageResize({
      percentage: 50
    }))
    .pipe(gulp.dest('dist')).on('end', cb);
});

gulp.task('p', function(cb) {
  gulp.src(['src/img/**', '!src/img/favicon/favicon.ico'], {
      base: 'src/'
    })
    .pipe(imageResize({
      percentage: 50
    }))
    .pipe(gulp.dest('dist')).on('end', cb);
});

var fontSpider = require('gulp-font-spider');

gulp.task('fontspider', function(cb) {
  return gulp.src('./dist/zh/*.html')
    .pipe(fontSpider()).on('end', cb);
});

// 替换本地资源的源host
gulp.task('resolveAll', function(cb) {
  gulp.src(['src/js/**', '!src/js/plugins.js', '!src/js/plugins.min.js' /*, 'src/css/**'*/ ], { base: 'src/' }).pipe(filter({ host: HOST })).pipe(gulp.dest('dist/')).on('end', cb);
})
gulp.task('cleanImage', (cb) => cleanFiles('dist/img/', cb))

// 不替换 host
gulp.task('build', gulp.series('build:html', 'css', 'copy', (cb) => cb()));
gulp.task('default', gulp.series('build', (cb) => cb()));
// 替换 host
gulp.task('prod', gulp.series('build:html:prod', 'css:prod', 'copy', 'resolveAll', 'cleanImage', (cb) => cb()));
// dev模式、不替换host
gulp.task('watch', gulp.series('default', 'watchhtml', 'watchi18n', 'watchcss', 'watchcopy', 'watchdev', 'serve'));
