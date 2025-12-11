# Fischer Frontend Development

> Sistema de desenvolvimento frontend moderno para Magento 2 com build system otimizado e arquitetura modular baseada em componentes.

![Node.js](https://img.shields.io/badge/Node.js-22.18.0-green.svg)
![Gulp](https://img.shields.io/badge/Gulp-5.0.1-red.svg)
![SASS](https://img.shields.io/badge/SASS-1.94.3-pink.svg)
![BEM](https://img.shields.io/badge/Metodologia-BEM-blue.svg)

## 🎯 Visão Geral

Este projeto implementa um sistema de desenvolvimento frontend para o e-commerce Fischer, utilizando uma stack moderna com Gulp, SASS e Nunjucks. O projeto segue metodologia BEM com prefixo customizado `fischer-2026` e arquitetura baseada em componentes modulares.

### ⚡ Características Principais

- **Build System Robusto**: Gulp 5.0 com tratamento avançado de erros
- **Arquitetura Modular**: Componentes isolados com SASS e templates próprios
- **Sistema BEM Automatizado**: Helpers SASS e Nunjucks para classes consistentes
- **Integração Magento 2**: Filtros específicos e estrutura de assets otimizada
- **Hot Reload**: BrowserSync com proxy para desenvolvimento ágil
- **Otimização de Assets**: Compressão de imagens e minificação automática

## 🚀 Quick Start

### Pré-requisitos

- **Node.js**: 22.18.0 (configurado no `.nvmrc`)
- **NPM**: ou Yarn para gerenciamento de dependências

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Navegue até o diretório
cd fischer

# Use a versão correta do Node.js
nvm use

# Instale as dependências
npm install
```

### Comandos de Desenvolvimento

```bash
# Desenvolvimento completo com watch e proxy
npm start

# Compilação apenas do CSS individual
npx gulp css

# Compilação CSS unificado (dist/css/styles.css)
npx gulp cssUnified

# Compilação apenas do HTML
npx gulp html

# JavaScript individual
npx gulp javascript

# JavaScript unificado (dist/javascript/scripts.js)
npx gulp javascriptUnified

# Otimização de imagens
npm run images

# Limpeza da pasta dist
npx gulp clean
```

## 📁 Estrutura do Projeto

```
src/
├── blocks/                 # Componentes organizados por página
│   ├── global.js          # JavaScript global para todas as páginas
│   └── sobre-nos/         # Exemplo: página "Sobre Nós"
│       ├── breadcrumb.njk  # Template do componente
│       ├── breadcrumb.sass # Estilos do componente
│       ├── history.njk     # Outros componentes
│       ├── segments.sass   # da mesma página
│       ├── sobre-nos.sass  # Arquivo principal da página
│       └── sobre-nos.js    # JavaScript da página
├── data/                  # Dados em JSON
│   └── sobre-nos.json     # Dados da página
├── helpers/               # Utilitários e filtros
│   ├── classes.sass       # Helpers BEM para SASS
│   ├── classes.njk        # Helpers BEM para templates
│   ├── filters.js         # Filtros customizados Nunjucks
│   ├── variables.sass     # Variáveis globais e tipografia
│   └── media.sass         # Breakpoints responsivos
├── assets/                # Assets organizados por página
│   └── sobre-nos/         # Imagens específicas
└── components/            # Componentes reutilizáveis
```

## 🎨 Sistema BEM com Prefixo Automático

### SASS Helper

```sass
@use '../../helpers/classes' as *

@include cls(component-name)
  // Gera: .fischer-2026-component-name
  
  @include element(header)
    // Gera: .fischer-2026-component-name__header
    
  @include modifier(active)
    // Gera: .fischer-2026-component-name--active
```

### Template Helper

```njk
{% from "helpers/classes.njk" import cls %}
<div class="{{ cls('component-name', 'element', 'modifier') }}">
  <!-- Gera: fischer-2026-component-name__element--modifier -->
</div>
```

### JavaScript Pattern

```javascript
// Usar classes BEM para seletores
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fischer-2026-component__element");
  
  elements.forEach(el => {
    el.addEventListener("click", handleClick);
  });
});
```

## 📊 Sistema de Dados

### Carregamento Automático

O Gulpfile carrega automaticamente dados JSON baseado na estrutura:
- `src/blocks/sobre-nos/breadcrumb.njk` → `src/data/sobre-nos.json`

### Carregamento Manual

```njk
{% set data = 'filename.json' | parseJSON %}
{{ data.propriedade }}
```

### Integração Magento

```njk
<!-- Para assets dinâmicos -->
<img src="{{ item.image | magento }}" alt="Descrição">

<!-- Gera -->
<img src="{{media url='caminho/imagem.jpg'}}" alt="Descrição">
```

## 🎯 Sistema de Tipografia

Utilize placeholders pré-definidos em `src/helpers/variables.sass`:

```sass
.meu-titulo
  @extend %title-1        // 32px/48px (mobile/tablet)

.texto-corpo  
  @extend %normal-text-medium  // 16px weight 500

.texto-pequeno
  @extend %small-text-medium   // 14px weight 500
```

## 📱 Breakpoints Responsivos

```sass
@use '../helpers/media' as *

.meu-componente
  padding: 16px
  
  @include tablet
    padding: 24px
    
  @include desktop  
    padding: 32px
```

**Breakpoints disponíveis:**
- `mobile`: max-width 767px
- `tablet`: min-width 768px  
- `desktop`: min-width 1024px
- `large-desktop`: min-width 1366px

## 🔧 Desenvolvimento Local

### BrowserSync Proxy

O sistema roda em `localhost:3000` fazendo proxy para `https://www.fischer.com.br` com injeção automática de assets customizados:

- **CSS**: `/custom-css/styles.css` (arquivo unificado)
- **JavaScript**: `/custom-js/scripts.js` (arquivo unificado)

### Estrutura de Build

**Arquivos Individuais** (desenvolvimento):
- `dist/blocks/sobre-nos.css` - CSS específico da página
- `dist/blocks/sobre-nos.js` - JavaScript específico da página

**Arquivos Unificados** (produção):
- `dist/css/styles.css` - Todos os CSS concatenados e minificados
- `dist/javascript/scripts.js` - Todos os JavaScript concatenados

### Tratamento de Erros

O build system utiliza `gulp-plumber` para **nunca quebrar** o processo de desenvolvimento:

- ✅ **Erros SASS**: Logados com arquivo/linha, build continua
- ✅ **Erros JSON**: Syntax errors reportados, processamento continua  
- ✅ **Erros Nunjucks**: Template errors logados, compilação continua

## 🏗️ Criando Novos Componentes

1. **Crie o template**: `src/blocks/[pagina]/[componente].njk`
2. **Crie os estilos**: `src/blocks/[pagina]/[componente].sass`
3. **Crie o JavaScript**: `src/blocks/[pagina]/[componente].js` (opcional)
4. **Importe o SASS**: Adicione `@use '[pagina]/[componente]'` no arquivo principal
5. **Configure dados**: Adicione ao `src/data/[pagina].json` ou use `parseJSON`
6. **Siga o padrão BEM**: Use helpers `cls()` para classes consistentes

### Exemplo Prático

**SASS** (`src/blocks/home/hero.sass`):
```sass
@use '../../helpers/classes' as *
@use '../../helpers/variables' as *

@include cls(hero)
  background: var(--brand-red-1)
  
  @include element(title)
    @extend %title-1
    color: var(--base-white)
```

**Template** (`src/blocks/home/hero.njk`):
```njk
{% from "helpers/classes.njk" import cls %}
<section class="{{ cls('hero') }}">
  <h1 class="{{ cls('hero', 'title') }}">{{ data.hero.titulo }}</h1>
</section>
```

**JavaScript** (`src/blocks/home/hero.js`):
```javascript
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".fischer-2026-hero");
  
  if (hero) {
    hero.addEventListener("click", () => {
      console.log("Hero clicked!");
    });
  }
});
```

## 🚢 Deploy e Integração

### Compilação para Produção

```bash
# Build completo
npm start

# Os arquivos compilados estarão em:
dist/
├── css/
│   └── styles.css         # CSS unificado e minificado
├── javascript/
│   └── scripts.js         # JavaScript unificado
├── assets/                # Imagens otimizadas
└── blocks/                # Templates HTML e arquivos individuais
    ├── sobre-nos.css      # CSS individual
    └── sobre-nos.js       # JavaScript individual
```

### Integração Magento 2

**Para Produção (Recomendado)**:
1. **CSS**: Use `dist/css/styles.css` (arquivo unificado)
2. **JavaScript**: Use `dist/javascript/scripts.js` (arquivo unificado)
3. **Templates**: Adapte templates de `dist/blocks/` para `.phtml`
4. **Assets**: Importe imagens de `dist/assets/` para `media/`

**Para Desenvolvimento**:
1. **CSS**: Use arquivos individuais de `dist/blocks/*.css`
2. **JavaScript**: Use arquivos individuais de `dist/blocks/*.js`

## 🛠️ Configuração Avançada

### Customização do Prefixo BEM

Edite `$prefix` em `src/helpers/classes.sass`:

```sass
$prefix: 'meu-prefixo' !default
```

### Adicionando Novos Filtros

Edite `src/helpers/filters.js`:

```javascript
env.addFilter("meuFiltro", function(str) {
  return str.toUpperCase();
});
```

## 🤝 Contribuição

1. Siga a convenção BEM estabelecida
2. Mantenha componentes modulares e isolados
3. Use os helpers SASS para classes consistentes
4. Teste em diferentes breakpoints
5. Verifique integração com Magento

## 📄 Licença

Este projeto está sob licença ISC.

---

**Desenvolvido com ❤️ para Fischer | Bizcommerce**