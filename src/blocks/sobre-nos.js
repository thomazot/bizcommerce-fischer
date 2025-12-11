/**
 * Accordion functionality for segments section
 * Implements collapsible content boxes with single active state
 */
document.addEventListener("DOMContentLoaded", () => {
  const SELECTORS = {
    container: ".fischer-2026-segments",
    box: ".fischer-2026-segments__box",
    header: ".fischer-2026-segments__name", 
    content: ".fischer-2026-segments__content"
  };

  const CLASSES = {
    boxActive: "fischer-2026-segments__box--active",
    headerOpen: "fischer-2026-segments__name--open",
    contentExpanded: "fischer-2026-segments__content--expanded"
  };

  /**
   * Closes all accordion boxes
   * @param {NodeList} boxes - All accordion boxes
   */
  const closeAllBoxes = (boxes) => {
    boxes.forEach((box) => {
      const header = box.querySelector(SELECTORS.header);
      const content = box.querySelector(SELECTORS.content);
      
      if (!header || !content) return;
      
      box.classList.remove(CLASSES.boxActive);
      header.classList.remove(CLASSES.headerOpen);
      content.classList.remove(CLASSES.contentExpanded);
    });
  };

  /**
   * Opens a specific accordion box
   * @param {Element} box - The box to open
   * @param {Element} header - The header element
   * @param {Element} content - The content element
   */
  const openBox = (box, header, content) => {
    box.classList.add(CLASSES.boxActive);
    header.classList.add(CLASSES.headerOpen);
    content.classList.add(CLASSES.contentExpanded);
  };

  /**
   * Handles accordion click events
   * @param {Event} event - Click event
   * @param {Element} box - The clicked box
   * @param {Element} header - The clicked header
   * @param {Element} content - The content to toggle
   * @param {NodeList} allBoxes - All accordion boxes
   */
  const handleAccordionClick = (event, box, header, content, allBoxes) => {
    event.preventDefault();
    
    const isCurrentlyOpen = box.classList.contains(CLASSES.boxActive);
    
    // Always close all boxes first
    closeAllBoxes(allBoxes);
    
    // If the clicked box wasn't open, open it
    if (!isCurrentlyOpen) {
      openBox(box, header, content);
    }
  };

  /**
   * Initialize accordion functionality
   */
  const initAccordion = () => {
    const container = document.querySelector(SELECTORS.container);
    if (!container) {
      console.warn("Segments accordion container not found");
      return;
    }

    const boxes = container.querySelectorAll(SELECTORS.box);
    
    if (boxes.length === 0) {
      console.warn("No accordion boxes found");
      return;
    }

    boxes.forEach((box) => {
      const header = box.querySelector(SELECTORS.header);
      const content = box.querySelector(SELECTORS.content);

      if (!header || !content) {
        console.warn("Invalid accordion structure - missing header or content");
        return;
      }

      // Add keyboard navigation
      header.setAttribute("tabindex", "0");
      header.setAttribute("role", "button");
      header.setAttribute("aria-expanded", "false");
      content.setAttribute("aria-hidden", "true");

      // Click handler
      header.addEventListener("click", (event) => {
        handleAccordionClick(event, box, header, content, boxes);
        
        // Update ARIA attributes
        const isOpen = box.classList.contains(CLASSES.boxActive);
        header.setAttribute("aria-expanded", isOpen.toString());
        content.setAttribute("aria-hidden", (!isOpen).toString());
      });

      // Keyboard handler
      header.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleAccordionClick(event, box, header, content, boxes);
          
          // Update ARIA attributes
          const isOpen = box.classList.contains(CLASSES.boxActive);
          header.setAttribute("aria-expanded", isOpen.toString());
          content.setAttribute("aria-hidden", (!isOpen).toString());
        }
      });
    });
  };

  // Initialize the accordion
  initAccordion();
});