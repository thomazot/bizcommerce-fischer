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

import nunjucksRender from 'gulp-nunjucks-render';
import htmlmin from 'gulp-htmlmin';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';
import filters from './src/helpers/filters.js';
import plumber from 'gulp-plumber';
import { deleteAsync } from 'del';
import concat from 'gulp-concat';
import terser from 'gulp-terser';

const sassCompiler = sass(dartSass);

// 🧹 Função para limpar a pasta dist
export function clean() {
  console.log('🧹 Limpando pasta dist...');
  return deleteAsync(['dist']);
}

// 🚨 Função para tratamento de erros
function handleError(taskName, err, stream) {
  console.error(`❌ ERRO em ${taskName}:`);
  console.error('📍 Mensagem:', err.message);
  if (err.fileName) console.error('📁 Arquivo:', err.fileName);
  if (err.lineNumber || err.line) console.error('📏 Linha:', err.lineNumber || err.line);
  if (err.columnNumber || err.column) console.error('📐 Coluna:', err.columnNumber || err.column);
  if (err.stack) console.error('🔍 Stack:', err.stack);
  console.error('⏰ Horário:', new Date().toLocaleTimeString());
  console.log('---');
  
  // Emite 'end' para continuar o processo
  if (stream) stream.emit('end');
}

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
    }).on('error', function(err) {
      handleError('IMAGES', err, this);
    }))
    // .pipe(extReplace('.webp'))
    .pipe(gulp.dest(imagesDist))
    .on('error', function(err) {
      handleError('IMAGES DEST', err, this);
    });
}

/* ---------------------------------------------
 * 📁 JavaScript - Copy Files
 * --------------------------------------------- */
export function javascript() {
  console.log('📦 Copiando e minificando arquivos JavaScript...');
  
  return gulp.src('src/blocks/*.js', { base: 'src' })
    .pipe(plumber({
      errorHandler: function(err) {
        console.error('❌ Erro JavaScript:', err.message);
        console.error('📍 Arquivo:', err.fileName || 'desconhecido');
        console.error('📍 Processamento continua...');
        this.emit('end');
      }
    }))
    .pipe(terser({
      compress: {
        drop_console: false
      },
      mangle: true
    }).on('error', function(err) {
      console.error('❌ Erro na minificação JavaScript:', err.message);
      console.error('📍 Linha:', err.line || 'desconhecida');
      console.error('📍 Coluna:', err.col || 'desconhecida');
      console.error('📍 Processamento continua...');
      this.emit('end');
    }))
    .pipe(gulp.dest('./dist'))
    .on('error', function(err) {
      console.error('❌ Erro ao salvar arquivos JavaScript:', err.message);
      this.emit('end');
    });
}

/* ---------------------------------------------
 * 📁 JavaScript Unificado - Concat Files
 * --------------------------------------------- */
export function javascriptUnified(done) {
  try {
    console.log('🔗 Criando arquivo JavaScript unificado e minificado...');
    
    gulp.src('./src/blocks/*.js')
      .pipe(plumber({
        errorHandler: function(err) {
          console.error('❌ Erro JavaScript Unificado:', err.message);
          console.error('📍 Arquivo:', err.fileName || 'desconhecido');
          console.error('📍 Processamento continua...');
          this.emit('end');
        }
      }))
      .pipe(concat('scripts.js'))
      .pipe(terser({
        compress: {
          drop_console: false
        },
        mangle: true
      }).on('error', function(err) {
        console.error('❌ Erro na minificação JavaScript unificado:', err.message);
        console.error('📍 Linha:', err.line || 'desconhecida');
        console.error('📍 Coluna:', err.col || 'desconhecida');
        console.error('📍 Processamento continua...');
        this.emit('end');
      }))
      .pipe(gulp.dest('./dist/javascript'))
      .on('error', function(err) {
        console.error('❌ Erro ao salvar JavaScript unificado:', err.message);
        this.emit('end');
      });
    
    console.log('✅ JavaScript unificado e minificado criado com sucesso');
    done();
  } catch (err) {
    console.error('❌ Erro geral na função JavaScript unificado:', err.message);
    console.error('📍 Stack:', err.stack);
    done();
  }
}

/* ---------------------------------------------
 * 🆕 HTML (Nunjucks) — ADICIONADO
 * --------------------------------------------- */
export function html() {
  return gulp.src('src/blocks/**/*.njk', { base: 'src' })

    // Carrega JSON automaticamente
    .pipe(data((file) => {
      try {
        const name = path.basename(file.path, '.njk');
        const filePath = file.relative;
        const pathParts = filePath.split('/');
        
        // Se o arquivo está dentro de uma subpasta, tenta carregar o JSON da pasta pai
        if (pathParts.length > 2) { // blocks/pasta/arquivo.njk
          const folderName = pathParts[1]; // Nome da pasta (ex: 'sobre-nos')
          const folderJsonPath = `./src/data/${folderName}.json`;
          if (fs.existsSync(folderJsonPath)) {
            const jsonContent = fs.readFileSync(folderJsonPath, 'utf8');
            return JSON.parse(jsonContent);
          }
        }
        
        // Carrega JSON baseado no nome do arquivo
        const jsonPath = `./src/data/${name}.json`;
        if (fs.existsSync(jsonPath)) {
          const jsonContent = fs.readFileSync(jsonPath, 'utf8');
          return JSON.parse(jsonContent);
        }
        
        return {};
      } catch (err) {
        console.error(`❌ Erro ao carregar dados JSON para ${file.path}:`, err.message);
        return {};
      }
    }))

    // Render do Nunjucks sem exigir pasta templates
    .pipe(
      nunjucksRender({
        path: ['src'], // Base para includes/extends
        manageEnv: (env) => {
          filters(env); // Adiciona filtros personalizados
          // REMOVE ESPAÇOS E QUEBRAS DESNECESSÁRIAS
          env.opts.trimBlocks = true;
          env.opts.lstripBlocks = true;
          env.opts.autoescape = false;
        }
      }).on('error', function(err) {
        console.error('❌ Erro no template Nunjucks:', err.message);
        console.error('📍 Arquivo:', err.fileName || 'desconhecido');
        console.error('📍 Linha:', err.lineno || 'desconhecida');
        this.emit('end');
      })
    )

    // Minificar HTML
    // .pipe(
    //   htmlmin({
    //     collapseWhitespace: true,
    //     removeComments: true,
    //     ignoreCustomFragments: [/\{\{[\s\S]*?\}\}/]
    //   })
    // )

    .pipe(gulp.dest('./dist'))
    .on('error', function(err) {
      console.error('❌ Erro ao salvar arquivos HTML:', err.message);
      this.emit('end');
    });
}

/**
 * Inicializa o BrowserSync em modo Proxy com hash de cache
 */
export function serveProxy(done) {
  try {
    const customLinkWithHash = `<link rel="stylesheet" type="text/css" href="/custom-css/styles.css" />`;
    const customScriptWithHash = `<script type="text/javascript" src="/custom-js/scripts.js"></script>`;
    const CONFIG_BS = {
      proxy: 'https://www.fischer.com.br',
      port: 3000,
      injectChanges: false,
      serveStatic: [
        {
          route: '/custom-css',
          dir: './dist/css',
        },
        {
          route: '/custom-js',
          dir: './dist/javascript',
        }
      ],
      snippetOptions: {
        rule: {
          match: /<\/head>/i,
          fn: function (snippet, match) {
            return customLinkWithHash + customScriptWithHash + snippet + match;
          }
        }
      }
    };

    browserSync.init(CONFIG_BS, (err) => {
      if (err) {
        console.error('❌ Erro ao inicializar BrowserSync:', err.message);
        done(err);
      } else {
        console.log('✅ BrowserSync iniciado com sucesso');
        done();
      }
    });
  } catch (err) {
    console.error('❌ Erro na configuração do BrowserSync:', err.message);
    done(err);
  }
}


/**
 * 3. Função para recarregar o CSS
 */
export function css(done) {
  try {
    // Compilação individual de arquivos SASS mantendo estrutura
    gulp.src('./src/blocks/*.sass', { base: 'src' })
      .pipe(plumber({
        errorHandler: function(err) {
          console.error('❌ Erro SASS:', err.message);
          console.error('📍 Arquivo:', err.file || 'desconhecido');
          console.error('📍 Linha:', err.line || 'desconhecida');
          console.error('📍 Coluna:', err.column || 'desconhecida');
          console.error('📍 Processamento continua...');
          this.emit('end');
        }
      }))
      .pipe(sassCompiler())
      .pipe(postcss([autoprefixer(), cssnano()]).on('error', function(err) {
        console.error('❌ Erro PostCSS:', err.message);
        // Continue processamento mesmo com erro
        this.emit('end');
      }))
      .pipe(gulp.dest('./dist'))
      .on('error', function(err) {
        console.error('❌ Erro ao salvar arquivos CSS:', err.message);
        // Continue processamento mesmo com erro
        this.emit('end');
      });
    
    console.log('✅ CSS processado com sucesso');
    done();
  } catch (err) {
    console.error('❌ Erro geral na função CSS:', err.message);
    console.error('📍 Stack:', err.stack);
    // Não parar o processo, apenas logar o erro e continuar
    done();
  }
}

/**
 * 4. Função para criar arquivo CSS unificado
 */
export function cssUnified(done) {
  try {
    console.log('🔗 Criando arquivo CSS unificado...');
    
    gulp.src('./src/blocks/*.sass')
      .pipe(plumber({
        errorHandler: function(err) {
          console.error('❌ Erro SASS Unificado:', err.message);
          console.error('📍 Arquivo:', err.file || 'desconhecido');
          console.error('📍 Linha:', err.line || 'desconhecida');
          console.error('📍 Coluna:', err.column || 'desconhecida');
          console.error('📍 Processamento continua...');
          this.emit('end');
        }
      }))
      .pipe(sassCompiler())
      .pipe(concat('styles.css'))
      .pipe(postcss([autoprefixer(), cssnano()]).on('error', function(err) {
        console.error('❌ Erro PostCSS Unificado:', err.message);
        this.emit('end');
      }))
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream({ match: '**/*.css' }))
      .on('error', function(err) {
        console.error('❌ Erro ao salvar CSS unificado:', err.message);
        this.emit('end');
      });
    
    console.log('✅ CSS unificado criado com sucesso');
    done();
  } catch (err) {
    console.error('❌ Erro geral na função CSS unificado:', err.message);
    console.error('📍 Stack:', err.stack);
    done();
  }
}

// 2. Função de Watch
function watchTask() {
  try {
    console.log('👀 Iniciando watchers...');
    
    const sassWatcher = gulp.watch('./src/**/*.sass', gulp.series(css, cssUnified));
    sassWatcher.on('error', (err) => {
      console.error('❌ Erro no watcher SASS:', err.message);
    });

    const htmlWatcher = gulp.watch('./src/**/*.njk', gulp.series(html, browserSync.reload));
    htmlWatcher.on('error', (err) => {
      console.error('❌ Erro no watcher HTML:', err.message);
    });

    const jsonWatcher = gulp.watch('./src/data/**/*.json', gulp.series(html, browserSync.reload));
    jsonWatcher.on('error', (err) => {
      console.error('❌ Erro no watcher JSON:', err.message);
    });

    const imageWatcher = gulp.watch('./src/assets/**/*', gulp.series(images));
    imageWatcher.on('error', (err) => {
      console.error('❌ Erro no watcher de imagens:', err.message);
    });

    const jsWatcher = gulp.watch('./src/**/*.js', gulp.series(javascript, javascriptUnified));
    jsWatcher.on('error', (err) => {
      console.error('❌ Erro no watcher JavaScript:', err.message);
    });

    console.log('✅ Watchers iniciados com sucesso');
  } catch (err) {
    console.error('❌ Erro ao configurar watchers:', err.message);
  }
}

// Exporta a função de watch como a tarefa padrão
export default gulp.series(
  clean,     // 🧹 Limpa pasta dist primeiro
  (done) => {
    console.log('🚀 Iniciando build...');
    done();
  },
  html,      // 🆕 HTML antes de tudo
  css,
  cssUnified, // 🔗 CSS unificado
  javascript, // 📁 JavaScript
  javascriptUnified, // 🔗 JavaScript unificado
  serveProxy,
  watchTask,
  images,
  (done) => {
    console.log('✅ Build finalizado com sucesso!');
    done();
  }
);
