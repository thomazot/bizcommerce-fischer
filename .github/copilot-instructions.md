# Fischer Frontend Development - AI Context

## Project Overview
This is a Magento 2 frontend development project for Fischer using a modern build system with Gulp, SASS, and Nunjucks templates. The project follows BEM methodology with a custom `fischer-2026` prefix and modular component architecture.

## Architecture & Key Patterns

### Component-Based Structure
- **Templates**: `src/blocks/[page]/[component].njk` - Nunjucks templates using BEM class helpers
- **Styles**: `src/blocks/[page]/[component].sass` - Modular SASS files with BEM mixins
- **Data**: `src/data/[page].json` - JSON data files loaded via `parseJSON` filter
- **Assets**: `src/assets/[page]/` - Page-specific images and media

### BEM Class System
Use the SASS helper for consistent BEM classes:
```sass
@use '../../helpers/classes' as *

@include cls(component-name)
  // Block styles
  
  @include element(header)
    // Element styles
    
  @include modifier(active)
    // Modifier styles
```

All classes use `fischer-2026` prefix automatically. For templates, use:
```njk
{% from "helpers/classes.njk" import cls %}
<div class="{{ cls('component-name', 'element', 'modifier') }}">
```

### Data Loading Patterns
- **Auto-loading**: Gulpfile automatically loads JSON based on folder structure
- **Manual loading**: Use `{% set data = 'filename.json' | parseJSON %}` in templates
- **Magento integration**: Use `{{ value | magento }}` filter for Magento template syntax

## Critical Development Workflows

### Build System Commands
```bash
npm start              # Full development build with watch + BrowserSync proxy
npx gulp css          # SASS compilation only  
npx gulp cssUnified   # SASS unificado em dist/css/styles.css
npx gulp html         # Nunjucks template compilation
npx gulp javascript   # JavaScript individual copy
npx gulp javascriptUnified # JavaScript unificado em dist/javascript/scripts.js
npx gulp images       # Image optimization
npx gulp clean        # Limpa pasta dist
```

### Error Handling
The build system uses `gulp-plumber` to prevent crashes. Errors are logged but compilation continues. Watch for:
- SASS import errors (common when moving files)
- JSON syntax errors in data files
- Nunjucks template syntax errors

### BrowserSync Proxy Setup
Development runs on port 3000 proxying `https://www.fischer.com.br` with custom asset injection:
- CSS: `/custom-css/styles.css` (from `dist/css/`)
- JavaScript: `/custom-js/scripts.js` (from `dist/javascript/`)

## Project-Specific Conventions

### SASS Structure
- `src/helpers/variables.sass` - Global variables, typography placeholders, CSS custom properties
- `src/helpers/media.sass` - Responsive breakpoint mixins (`@include mobile`, `@include tablet`, etc.)
- Component SASS files import both: `@use '../../helpers/variables' as *` and `@use '../../helpers/media' as *`

### File Organization
- Each page has its own folder in `src/blocks/` (e.g., `sobre-nos/`)
- Components within pages have separate `.njk`, `.sass`, and `.js` files
- Main page files import all components: SASS and JavaScript
- JSON data follows page structure (`src/data/sobre-nos.json`)
- JavaScript files in `src/blocks/*.js` are concatenated to `dist/javascript/scripts.js`

### Typography System
Use placeholder selectors from `helpers/variables.sass`:
```sass
@extend %title-1        // Main headings
@extend %title-3        // Section headings
@extend %normal-text-medium  // Body text
@extend %small-text-medium   // Small text
```

## Integration Points

### Magento Integration
- Templates compile to `dist/` folder for Magento integration
- Use `{{ value | magento }}` for dynamic Magento content
- Image paths use `media url=''` syntax for Magento media handling

### Development Environment
- Node.js 22.18.0 (see `.nvmrc`)
- ES modules throughout (gulpfile.mjs, filter files)
- PostCSS with autoprefixer and cssnano for production CSS

## Common Tasks & Patterns

When creating new components:
1. Create `.njk` template in appropriate `src/blocks/[page]/` folder
2. Create corresponding `.sass` file with BEM structure
3. Create `.js` file for component behavior (optional)
4. Import SASS file in main page SASS file
5. Use `parseJSON` filter or auto-loading for data
6. Follow `fischer-2026` BEM naming convention

JavaScript patterns:
- Use `document.addEventListener("DOMContentLoaded", callback)` for initialization
- Target elements using BEM classes: `.fischer-2026-component__element`
- Create reusable utilities in global.js
- Page-specific scripts go in `[page-name].js`

When debugging build issues:
- Check console for specific file/line error information
- Verify SASS import paths are correct
- Ensure JSON syntax is valid
- Build system continues on errors - check logs for specifics