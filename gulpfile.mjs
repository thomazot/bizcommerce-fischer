import browserSync, { notify } from 'browser-sync';
import gulp from 'gulp';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import * as dartSass from 'sass';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
// import webp from 'imagemin-webp';
// import extReplace from 'gulp-ext-replace';

const sassCompiler = sass(dartSass);

// 🎯 Caminho das imagens de origem
const imagesSrc = 'src/assets/**/*.{jpg,jpeg,png,svg,gif}'; 
// 📤 Caminho das imagens de destino
const imagesDist = 'dist/assets';

const imageminPlugins = [
  gifsicle({ interlaced: true }),
  optipng({ optimizationLevel: 5 }),
  svgo({
    plugins: [
      { name: 'removeDesc', active: false },
      { name: 'removeTitle', active: false },
      { name: 'mergePaths', active: false },
    ],
  }),
  mozjpeg({
    quality: 75,
    progressive: true,
  }),
  // webp({ quality: 75 })
];

// 1. Função de Otimização de Imagens
export function images() {
  console.log('✨ Iniciando otimização de imagens...');

  return gulp.src(imagesSrc, {encoding: false})
    .pipe(imagemin(imageminPlugins, {
      verbose: true // Exibe informações detalhadas no terminal
    }))
    // .pipe(extReplace('.webp'))
    .pipe(gulp.dest(imagesDist));
}

/**
 * Inicializa o BrowserSync em modo Proxy com hash de cache
 */
export function serveProxy(done) {// Gera o hash antes de iniciar o BrowserSync
  const customLinkWithHash = `<link rel="stylesheet" type="text/css" href="/custom-css/styles.css" />`;
  const CONFIG_BS = {
    proxy: 'https://www.fischer.com.br',
    port: 3000,
    injectChanges: false,
    serveStatic: [
      {
        route: '/custom-css',
        dir: './dist/css',
      }
    ],
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return customLinkWithHash + snippet + match;
        }
      }
    }
  };

  browserSync.init(CONFIG_BS, done);
}


/**
 * 3. Função para recarregar o CSS
 */
function reloadCSS(done) {
  // Quando o CSS customizado muda, o BrowserSync injeta
  // a nova versão sem recarregar a página (CSS Injection)
  gulp.src('./src/styles.sass')
    // .pipe(sourcemaps.init())
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(postcss([autoprefixer()]))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
    

    gulp.src('./src/**/*.sass')
      .pipe(sassCompiler().on('error', sassCompiler.logError))
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(gulp.dest('./dist/css'))
      
  done();
}

// 2. Função de Watch
function watchTask() {
  gulp.watch('./src/**/*.sass', gulp.series(reloadCSS));
}

// Exporta a função de watch como a tarefa padrão
export default gulp.series(
  serveProxy,
  watchTask,
  images
);