# Documentação JavaScript - Página Sobre Nós

## 📋 Visão Geral

Sistema JavaScript modular para a página "Sobre Nós" da Fischer, implementando funcionalidades de accordion (segments) e carrosséis sincronizados (our stores) com suporte a acessibilidade e tratamento de dependências assíncronas.

**Arquivo**: `src/blocks/sobre-nos.js`  
**Versão**: 1.0.0  
**Dependências**: jQuery (opcional - apenas para carrosséis), Slick Carousel

## 🏗️ Arquitetura

### Padrão de Módulo IIFE

O código utiliza **Immediately Invoked Function Expression (IIFE)** para criar escopo isolado e evitar poluição do namespace global:

```javascript
(function (window, document) {
  "use strict";
  // Código isolado aqui
})(window, document);
```

**Benefícios**:
- ✅ Encapsulamento de variáveis e funções
- ✅ Previne conflitos de namespace
- ✅ Compatibilidade com ambiente Magento 2

### Estrutura Modular

```
├── waitForDependency()     → Utilitário de espera assíncrona
├── AccordionConfig         → Configuração do accordion
├── Accordion Module        → Lógica de accordion (Vanilla JS)
├── CarouselConfig          → Configuração dos carrosséis
├── Carousel Module         → Lógica de carrosséis (jQuery + Slick)
└── init()                  → Inicialização principal
```

## 🔧 Módulos e Funcionalidades

### 1. waitForDependency()

Função utilitária que aguarda uma dependência estar disponível antes de executar código.

**Assinatura:**
```javascript
function waitForDependency(checkFn, callback, timeout = 10000)
```

**Parâmetros:**
- `checkFn` (Function): Função que retorna `true` quando a dependência está disponível
- `callback` (Function): Callback a executar quando dependência for encontrada
- `timeout` (Number): Timeout em milissegundos (padrão: 10000ms)

**Retorno:**
- `Promise`: Resolve quando dependência está disponível, rejeita em timeout

**Exemplo de Uso:**
```javascript
waitForDependency(
  () => typeof jQuery !== "undefined",
  () => {
    console.log("jQuery carregado!");
  },
  5000
);
```

**Comportamento:**
- ✅ Verifica a cada 100ms se a dependência está disponível
- ✅ Executa callback imediatamente quando encontrada
- ⏱️ Timeout configurável para evitar loops infinitos
- 🔄 Retorna Promise para encadeamento assíncrono

---

### 2. Accordion Module

Implementação de accordion acessível usando **Vanilla JavaScript** (sem dependências).

#### 2.1. AccordionConfig

Configuração centralizada com seletores e classes:

```javascript
const AccordionConfig = {
  selectors: {
    container: ".fischer-2026-segments",
    box: ".fischer-2026-segments__box",
    header: ".fischer-2026-segments__name",
    content: ".fischer-2026-segments__content",
  },
  classes: {
    boxActive: "fischer-2026-segments__box--active",
    headerOpen: "fischer-2026-segments__name--open",
    contentExpanded: "fischer-2026-segments__content--expanded",
  },
};
```

**Padrão BEM:**
- Todos os seletores usam prefixo `fischer-2026-`
- Modificadores para estados: `--active`, `--open`, `--expanded`

#### 2.2. Accordion.closeAll()

Fecha todos os boxes do accordion.

**Assinatura:**
```javascript
closeAll(boxes)
```

**Parâmetros:**
- `boxes` (NodeList): Lista de elementos `.fischer-2026-segments__box`

**Comportamento:**
- Remove classes de estado ativo
- Atualiza atributos ARIA para acessibilidade:
  - `aria-expanded="false"` no header
  - `aria-hidden="true"` no content

#### 2.3. Accordion.open()

Abre um box específico do accordion.

**Assinatura:**
```javascript
open(box)
```

**Parâmetros:**
- `box` (HTMLElement): Elemento `.fischer-2026-segments__box` a abrir

**Comportamento:**
- Adiciona classes de estado ativo
- Atualiza atributos ARIA:
  - `aria-expanded="true"` no header
  - `aria-hidden="false"` no content

#### 2.4. Accordion.handleToggle()

Handler de eventos para clique e teclado.

**Assinatura:**
```javascript
handleToggle(event, box, boxes)
```

**Parâmetros:**
- `event` (Event): Evento de clique ou teclado
- `box` (HTMLElement): Box que foi clicado
- `boxes` (NodeList): Todos os boxes do accordion

**Comportamento:**
- ⌨️ **Keyboard Navigation**: Aceita `Enter` e `Space`
- 🔒 **Previne re-abertura**: Não faz nada se box já está ativo
- 🔄 **Exclusividade**: Fecha todos antes de abrir o clicado
- ♿ **Acessibilidade**: Atualiza atributos ARIA

**Exemplo de Uso:**
```javascript
header.addEventListener("click", (e) => 
  Accordion.handleToggle(e, box, boxes)
);
```

#### 2.5. Accordion.init()

Inicializa o accordion com acessibilidade completa.

**Comportamento:**
1. ✅ Busca container `.fischer-2026-segments`
2. ✅ Busca todos os boxes dentro do container
3. ✅ Para cada box:
   - Configura atributos ARIA (`role`, `tabindex`, `aria-expanded`)
   - Abre o primeiro box por padrão
   - Adiciona event listeners (click + keyboard)

**Acessibilidade Implementada:**
- ✅ `role="button"` no header
- ✅ `tabindex="0"` para navegação por teclado
- ✅ `aria-expanded` para estado do accordion
- ✅ `aria-hidden` para visibilidade do content
- ✅ Suporte a `Enter` e `Space` para ativar

**HTML Esperado:**
```html
<div class="fischer-2026-segments">
  <div class="fischer-2026-segments__box">
    <div class="fischer-2026-segments__name">
      <!-- Header clicável -->
    </div>
    <div class="fischer-2026-segments__content">
      <!-- Conteúdo expansível -->
    </div>
  </div>
</div>
```

---

### 3. Carousel Module

Implementação de carrosséis sincronizados usando **jQuery** e **Slick Carousel**.

#### 3.1. CarouselConfig

Configuração dos dois carrosséis (navegação e conteúdo):

```javascript
const CarouselConfig = {
  selectors: {
    nav: ".fischer-2026-our-stores__nav",
    content: ".fischer-2026-our-stores__content",
  },
  settings: {
    nav: {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
    },
    content: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      adaptiveHeight: true,
    },
  },
};
```

**Configurações:**

**Nav (Navegação):**
- `centerMode: true` - Slide ativo no centro
- `variableWidth: true` - Largura variável dos slides
- `infinite: true` - Loop contínuo
- `speed: 300` - Transição de 300ms

**Content (Conteúdo):**
- `fade: true` - Transição com fade
- `adaptiveHeight: true` - Altura ajusta ao conteúdo
- `arrows: false` - Sem setas (controlado pela nav)

#### 3.2. Carousel.preventLinkNavigation()

Previne navegação de links dentro dos slides e usa clique para navegar.

**Assinatura:**
```javascript
preventLinkNavigation($element)
```

**Parâmetros:**
- `$element` (jQuery): Elemento do carrossel

**Comportamento:**
- Intercepta cliques em links (`<a>`)
- Previne navegação padrão (`e.preventDefault()`)
- Navega para o slide clicado usando `slickGoTo()`

**Exemplo de Comportamento:**
```html
<!-- Ao clicar no link, navega para o slide ao invés de seguir o href -->
<a href="#loja-1">Loja 1</a>
```

#### 3.3. Carousel.init()

Inicializa os carrosséis sincronizados.

**Assinatura:**
```javascript
init($)
```

**Parâmetros:**
- `$` (jQuery): Instância do jQuery

**Comportamento:**
1. ✅ Busca elementos de navegação e conteúdo
2. ✅ Valida existência dos elementos
3. ✅ Inicializa nav com referência ao content (`asNavFor`)
4. ✅ Inicializa content com referência à nav (`asNavFor`)
5. ✅ Previne navegação em links
6. ⚠️ Captura e loga erros de inicialização

**Sincronização:**
```javascript
// Nav controla Content e vice-versa
$nav.slick({ asNavFor: selectors.content });
$content.slick({ asNavFor: selectors.nav });
```

**HTML Esperado:**
```html
<div class="fischer-2026-our-stores__nav">
  <!-- Slides de navegação -->
</div>
<div class="fischer-2026-our-stores__content">
  <!-- Slides de conteúdo -->
</div>
```

---

### 4. Inicialização Principal

#### 4.1. init()

Função principal que orquestra a inicialização de todos os módulos.

```javascript
function init() {
  // 1. Inicializa Accordion (não precisa de dependências)
  Accordion.init();

  // 2. Aguarda jQuery + Slick para carrosséis
  waitForDependency(
    () => {
      const hasJQuery = 
        typeof window.jQuery !== "undefined" || 
        typeof window.$ !== "undefined";
      const jq = window.jQuery || window.$;
      return hasJQuery && jq && jq.fn && jq.fn.slick;
    },
    () => {
      const $ = window.jQuery || window.$;
      Carousel.init($);
    },
    10000
  );
}
```

**Fluxo de Inicialização:**
1. ✅ **Imediato**: Inicializa Accordion (Vanilla JS)
2. ⏱️ **Assíncrono**: Aguarda jQuery e Slick estarem disponíveis
3. ✅ **Condicional**: Inicializa carrosséis apenas se dependências existirem
4. ⏰ **Timeout**: Desiste após 10 segundos se dependências não carregarem

#### 4.2. Auto-inicialização

```javascript
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

**Comportamento:**
- Se DOM ainda está carregando → Aguarda `DOMContentLoaded`
- Se DOM já está pronto → Executa imediatamente
- ✅ Garante execução independente de quando script é carregado

---

## ♿ Acessibilidade

### ARIA Attributes

**Accordion:**
```javascript
header.setAttribute("role", "button");
header.setAttribute("tabindex", "0");
header.setAttribute("aria-expanded", "false");
content.setAttribute("aria-hidden", "true");
```

**Estados:**
- `aria-expanded="true"` → Box aberto
- `aria-expanded="false"` → Box fechado
- `aria-hidden="false"` → Conteúdo visível
- `aria-hidden="true"` → Conteúdo oculto

### Keyboard Navigation

**Teclas Suportadas:**
- `Enter` → Abre/fecha accordion
- `Space` → Abre/fecha accordion
- `Tab` → Navega entre headers

**Implementação:**
```javascript
if (event.type === "keydown" && !["Enter", " "].includes(event.key)) {
  return;
}
```

---

## 🔄 Fluxo de Execução

```mermaid
graph TD
    A[Script Carregado] --> B{DOM Pronto?}
    B -->|Sim| C[init()]
    B -->|Não| D[DOMContentLoaded Event]
    D --> C
    
    C --> E[Accordion.init()]
    E --> F[Accordion Ativo]
    
    C --> G[waitForDependency]
    G --> H{jQuery + Slick?}
    H -->|Sim| I[Carousel.init()]
    H -->|Não após 10s| J[Timeout - Carousel não inicializado]
    I --> K[Carrosséis Sincronizados]
```

---

## 🐛 Tratamento de Erros

### Validações Implementadas

**Accordion:**
```javascript
if (!container) return;           // Container não existe
if (!boxes.length) return;        // Sem boxes
if (!header || !content) return;  // Estrutura incompleta
```

**Carousel:**
```javascript
if (!$nav.length || !$content.length) return;  // Elementos não encontrados

try {
  // Inicialização
} catch (error) {
  console.error("Erro ao inicializar carrosséis:", error);
}
```

### Degradação Graciosa

- ✅ **Accordion**: Funciona independente de dependências externas
- ✅ **Carousel**: Falha silenciosamente se jQuery/Slick não estiverem disponíveis
- ✅ **Timeout**: Previne loops infinitos em `waitForDependency`

---

## 🎯 Casos de Uso

### Caso 1: Accordion de Segmentos

**Cenário**: Usuário clica em segmento "Industrial"

**Fluxo:**
1. Evento de clique capturado em `.fischer-2026-segments__name`
2. `handleToggle()` valida se já está ativo
3. `closeAll()` fecha todos os segments
4. `open()` abre o segment "Industrial"
5. Atributos ARIA atualizados para screen readers

### Caso 2: Navegação em Carrossel

**Cenário**: Usuário clica em link de loja na navegação

**Fluxo:**
1. Evento de clique interceptado por `preventLinkNavigation()`
2. `e.preventDefault()` previne navegação de link
3. `slickGoTo()` navega para o slide clicado
4. Carrossel de conteúdo sincroniza automaticamente via `asNavFor`
5. Transição com fade de 300ms

### Caso 3: Carregamento Assíncrono

**Cenário**: Script carrega antes do jQuery

**Fluxo:**
1. `init()` executa no DOMContentLoaded
2. `Accordion.init()` executa imediatamente (Vanilla JS)
3. `waitForDependency()` inicia verificação a cada 100ms
4. Quando jQuery e Slick carregam → `Carousel.init()` executa
5. Se timeout de 10s → Carrosséis não inicializados (accordion continua funcionando)

---

## 🔧 Manutenção e Extensão

### Adicionando Novo Tipo de Accordion

```javascript
const NewAccordionConfig = {
  selectors: {
    container: ".fischer-2026-novo-accordion",
    box: ".fischer-2026-novo-accordion__box",
    header: ".fischer-2026-novo-accordion__header",
    content: ".fischer-2026-novo-accordion__content",
  },
  classes: {
    boxActive: "fischer-2026-novo-accordion__box--active",
    headerOpen: "fischer-2026-novo-accordion__header--open",
    contentExpanded: "fischer-2026-novo-accordion__content--expanded",
  },
};

// Reutilize o módulo Accordion com nova config
const NewAccordion = Object.assign({}, Accordion);
// Atualize referências de AccordionConfig para NewAccordionConfig
```

### Adicionando Configuração de Carrossel

```javascript
CarouselConfig.settings.nav.autoplay = true;
CarouselConfig.settings.nav.autoplaySpeed = 3000;
```

### Debug Mode

Adicione logs para debugging:

```javascript
const DEBUG = true;

function init() {
  if (DEBUG) console.log("🚀 Iniciando sobre-nos.js");
  
  Accordion.init();
  if (DEBUG) console.log("✅ Accordion inicializado");
  
  // ... resto do código
}
```

---

## 📊 Performance

### Otimizações Implementadas

- ✅ **Event Delegation**: Poderia usar, mas optou por eventos diretos (poucos elementos)
- ✅ **Validação Antecipada**: Return early para evitar processamento desnecessário
- ✅ **Escopo Isolado**: IIFE previne poluição do namespace global
- ✅ **Lazy Loading**: Carrosséis só inicializam quando dependências estão prontas

### Métricas Estimadas

- **Tamanho Minificado**: ~3-4KB
- **Tempo de Inicialização**: <10ms (Accordion), <100ms (Carousel com dependências)
- **Event Listeners**: ~6-12 (dependendo do número de boxes)

---

## 🧪 Testes

### Checklist de Testes Manuais

**Accordion:**
- [ ] Primeiro box abre automaticamente ao carregar
- [ ] Clicar em box fechado abre e fecha os outros
- [ ] Clicar em box aberto não faz nada
- [ ] Navegar com Tab funciona
- [ ] Enter e Space ativam o accordion
- [ ] Atributos ARIA atualizam corretamente
- [ ] Funciona sem jQuery

**Carousel:**
- [ ] Navegação sincroniza com conteúdo
- [ ] Clicar em slide de navegação muda conteúdo
- [ ] Transição com fade funciona
- [ ] Loop infinito funciona
- [ ] Links não navegam (preventDefault)
- [ ] Funciona com jQuery carregado tarde

**Geral:**
- [ ] Funciona em Chrome, Firefox, Safari, Edge
- [ ] Funciona em mobile (touch events)
- [ ] Degradação graciosa sem dependências

---

## 📚 Referências

### Dependências

- **jQuery**: 3.x+ (opcional, apenas para carrosséis)
- **Slick Carousel**: 1.8.1+ (opcional, apenas para carrosséis)

### Padrões Seguidos

- **BEM Methodology**: Nomenclatura de classes
- **ARIA Guidelines**: Acessibilidade de accordion
- **ES5 Syntax**: Compatibilidade com browsers antigos
- **IIFE Pattern**: Encapsulamento de módulo

### Documentação Externa

- [Slick Carousel Docs](https://kenwheeler.github.io/slick/)
- [ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [MDN - IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

---

**Desenvolvido com ❤️ para Fischer | Bizcommerce**
