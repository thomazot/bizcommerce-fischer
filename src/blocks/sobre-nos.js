/**
 * Fischer Custom Scripts - Sobre Nós
 * Accordion functionality and Slick carousels
 * @author Fischer Development Team
 * @version 1.0.0
 */

(function (window, document) {
  "use strict";

  /**
   * Aguarda uma dependência estar disponível
   * @param {Function} checkFn - Função que verifica se a dependência está disponível
   * @param {Function} callback - Callback a executar quando disponível
   * @param {Number} timeout - Timeout em ms (padrão: 10000)
   * @returns {Promise}
   */
  function waitForDependency(checkFn, callback, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const interval = 100;

      function check() {
        if (checkFn()) {
          callback();
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("Dependency timeout"));
        } else {
          setTimeout(check, interval);
        }
      }

      check();
    });
  }

  /**
   * Configuração do Accordion - Segments
   */
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

  /**
   * Módulo Accordion (Vanilla JS)
   */
  const Accordion = {
    /**
     * Fecha todos os boxes
     * @param {NodeList} boxes
     */
    closeAll(boxes) {
      const { selectors, classes } = AccordionConfig;

      boxes.forEach((box) => {
        box.classList.remove(classes.boxActive);

        const header = box.querySelector(selectors.header);
        const content = box.querySelector(selectors.content);

        if (header) {
          header.classList.remove(classes.headerOpen);
          header.setAttribute("aria-expanded", "false");
        }

        if (content) {
          content.classList.remove(classes.contentExpanded);
          content.setAttribute("aria-hidden", "true");
        }
      });
    },

    /**
     * Abre um box específico
     * @param {HTMLElement} box
     */
    open(box) {
      const { selectors, classes } = AccordionConfig;

      box.classList.add(classes.boxActive);

      const header = box.querySelector(selectors.header);
      const content = box.querySelector(selectors.content);

      if (header) {
        header.classList.add(classes.headerOpen);
        header.setAttribute("aria-expanded", "true");
      }

      if (content) {
        content.classList.add(classes.contentExpanded);
        content.setAttribute("aria-hidden", "false");
      }
    },

    /**
     * Handler de eventos
     * @param {Event} event
     * @param {HTMLElement} box
     * @param {NodeList} boxes
     */
    handleToggle(event, box, boxes) {
      const { classes } = AccordionConfig;

      // Valida teclas para keyboard navigation
      if (event.type === "keydown" && !["Enter", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();

      // Não faz nada se já está aberto
      if (box.classList.contains(classes.boxActive)) {
        return;
      }

      this.closeAll(boxes);
      this.open(box);
    },

    /**
     * Inicializa o accordion
     */
    init() {
      const { selectors } = AccordionConfig;
      const container = document.querySelector(selectors.container);

      if (!container) return;

      const boxes = container.querySelectorAll(selectors.box);
      if (!boxes.length) return;

      boxes.forEach((box, index) => {
        const header = box.querySelector(selectors.header);
        const content = box.querySelector(selectors.content);

        if (!header || !content) return;

        // Setup acessibilidade
        header.setAttribute("tabindex", "0");
        header.setAttribute("role", "button");
        header.setAttribute("aria-expanded", "false");
        content.setAttribute("aria-hidden", "true");

        // Abre o primeiro por padrão
        if (index === 0) {
          this.open(box);
        }

        // Event listeners
        header.addEventListener("click", (e) =>
          this.handleToggle(e, box, boxes),
        );
        header.addEventListener("keydown", (e) =>
          this.handleToggle(e, box, boxes),
        );
      });
    },
  };

  /**
   * Configuração dos Carrosséis
   */
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

  /**
   * Módulo Carousel
   */
  const Carousel = {
    /**
     * Previne navegação de links
     * @param {jQuery} $element
     */
    preventLinkNavigation($element) {
      $element.on("click", "a", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Navega para o slide clicado
        const $slide = $(this).closest(".slick-slide");
        const slideIndex = $slide.data("slick-index");

        if (slideIndex !== undefined) {
          $element.slick("slickGoTo", slideIndex);
        }
      });
    },

    /**
     * Inicializa os carrosséis
     * @param {jQuery} $
     */
    init($) {
      const { selectors, settings } = CarouselConfig;
      const $nav = $(selectors.nav);
      const $content = $(selectors.content);

      if (!$nav.length || !$content.length) return;

      try {
        // Inicializa navegação com referência ao conteúdo
        $nav.slick({
          ...settings.nav,
          asNavFor: selectors.content,
        });

        // Inicializa conteúdo com referência à navegação
        $content.slick({
          ...settings.content,
          asNavFor: selectors.nav,
        });

        // Previne navegação dos links
        this.preventLinkNavigation($nav);
        $content.on("click", "a", (e) => e.preventDefault());
      } catch (error) {
        console.error("Erro ao inicializar carrosséis:", error);
      }
    },
  };

  /**
   * Inicialização do módulo
   */
  function init() {
    // Inicializa Accordion (Vanilla JS - não precisa esperar jQuery)
    Accordion.init();

    // Aguarda Slick para os carrosséis
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
      10000,
    );
  }

  // Auto-inicialização
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
