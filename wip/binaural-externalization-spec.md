# Binaural Externalization Processing Demonstration - Technical Specification

## Overview
This specification defines the requirements for creating a sub-page at `/binaural-externalization` that replicates the functionality and design of the [existing binaural externalization demonstration site](https://www.chrislandschoot.com/binaural-externalization). The page will be integrated seamlessly into the existing Christopher Landschoot website architecture within this codebase, maintaining exact design consistency.

## Page Structure & Navigation

### Header Navigation - Centered Layout Without Logo
- **Modified header structure** from main site:
  - Keep `header` element with sticky positioning
  - Modify `.container` class to center content instead of space-between
  - **Remove logo completely** - no "CHRISTOPHER LANDSCHOOT" text
  - **Center all navigation elements** horizontally
  - **Replace desktop navigation** with binaural-specific nav:
    ```html
    <header>
      <div class="container binaural-header-container">
        <nav aria-label="Binaural Demo">
          <ul class="desktop-nav binaural-nav">
            <li><a href="#abstract" class="nav-pill">Abstract</a></li>
            <li><a href="#introduction" class="nav-pill">Introduction</a></li>
            <li><a href="#stereo" class="nav-pill">Stereo</a></li>
            <li><a href="#binaural" class="nav-pill">Binaural</a></li>
            <li><a href="#externalized" class="nav-pill">Externalized</a></li>
            <li><a href="#comparisons" class="nav-pill">Comparisons</a></li>
            <li><a href="#future-work" class="nav-pill">Future Work</a></li>
            <li class="theme-toggle-item">
              <!-- Keep existing theme toggle button HTML exactly -->
            </li>
          </ul>
        </nav>
      </div>
    </header>
    ```
  - **Mobile navigation**: Use same `<details>` hamburger menu structure but centered
  - **Header styling**: Exact same CSS variables and backdrop-filter
  - **Theme toggle**: Keep identical functionality, positioned at end of nav

### Header Layout & Navigation Styling
**Centered Header CSS**:
```css
.binaural-header-container {
  display: flex;
  justify-content: center; /* Center instead of space-between */
  align-items: center;
  height: 70px;
  padding-left: var(--space-xs);
  padding-right: var(--space-xs);
}

.binaural-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
```

**Navigation Pill Styling**:
```css
.binaural-nav .nav-pill {
  background-color: var(--clr-background-secondary);
  border: 1px solid var(--clr-border-primary);
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 2px;
  font-size: 0.85rem;
  font-weight: var(--font-weight-light);
  transition: all var(--transition-standard);
}

.binaural-nav .nav-pill:hover,
.binaural-nav .nav-pill.active {
  background-color: var(--clr-accent-primary);
  color: var(--clr-background-primary);
  border-color: var(--clr-accent-primary);
  text-decoration: none;
}

/* Mobile navigation centering */
.mobile-nav {
  position: relative;
  margin: 0 auto; /* Center the hamburger menu */
}
```

### Active Section Highlighting
- Use Intersection Observer (like main site's `setupIntersectionObserver()`)
- Add/remove `.active` class on navigation pills
- Smooth scrolling using same `scroll-behavior: smooth` from main site

### Hero Section - Matching Main Site Hero Pattern
- **Use exact hero structure** from main site with modifications:
  ```html
  <section class="hero binaural-hero">
    <div class="hero-bg">
      <!-- Custom gradient background instead of canvas -->
      <div class="binaural-gradient-bg"></div>
    </div>
    <div class="hero-content">
      <h1>Colorless Binaural Externalization Processing Demonstration</h1>
      <p class="hero-tagline">Authors: Christopher Landschoot, Jean-Marc Jot</p>
    </div>
  </section>
  ```
- **Typography**: Use exact same font hierarchy from main site
  - `h1`: Brandon Grotesque with `font-weight: var(--font-weight-regular)`
  - Hero tagline: `font-size: 1.5rem` (matching main site pattern)
- **Color scheme**: Use CSS custom properties from main site
- **Background gradient**: Custom CSS instead of canvas animation
  ```css
  .binaural-gradient-bg {
    background: linear-gradient(135deg, #8B5FBF 0%, #5F8BBF 100%);
    width: 100%;
    height: 100%;
  }
  ```

## Content Sections - Using Main Site Section Architecture

### Base Section Structure
All sections must use the main site's exact section architecture:
```html
<section id="section-name" class="section">
  <div class="container">
    <h2>Section Title</h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </div>
</section>
```

### Section Background Colors - Following Main Site Pattern
- Use main site's CSS variables and background system
- **Primary background sections**: `--clr-background-primary` (like #experience, #education, #interests)
- **Secondary background sections**: `--clr-background-secondary` (like #about, #projects, #skills)
- **Custom section backgrounds**: Define new CSS classes while maintaining theme compatibility

### 1. Abstract Section
**HTML Structure**:
```html
<section id="abstract" class="section">
  <div class="container">
    <h2 class="fade-in-element">Abstract</h2>
    <div class="abstract-grid fade-in-element">
      <div class="abstract-content">
        <!-- Main abstract text -->
      </div>
      <div class="abstract-presentations">
        <!-- Research presentations list -->
      </div>
    </div>
  </div>
</section>
```
**CSS**:
```css
.abstract-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-l);
  max-width: 1000px;
  margin: 0 auto;
}
.abstract-content p {
  text-align: justify;
  line-height: 1.8;
  margin-bottom: var(--space-m);
}
```
**Links**: Use main site's link styling with `var(--clr-accent-primary)` and hover effects

### 2. Introduction Section
**HTML Structure**:
```html
<section id="introduction" class="section binaural-intro-bg">
  <div class="container">
    <h2 class="fade-in-element">Please use headphones for the following demonstration.</h2>
    <div class="intro-content fade-in-element">
      <div class="intro-text">
        <!-- Instructional text -->
      </div>
      <div class="intro-visual">
        <div class="head-model-container">
          <!-- 3D head model with headphones -->
        </div>
      </div>
    </div>
  </div>
</section>
```
**CSS**:
```css
.binaural-intro-bg {
  background: linear-gradient(135deg, #8B5FBF 0%, #A67BC6 100%);
  color: var(--clr-background-primary);
}
.binaural-intro-bg h2,
.binaural-intro-bg p {
  color: var(--clr-background-primary);
}
```

### 3. Traditional Stereo Panning Section
**HTML Structure**:
```html
<section id="stereo" class="section">
  <div class="container">
    <h2 class="fade-in-element">Traditional Stereo Panning</h2>
    <div class="stereo-grid fade-in-element">
      <div class="stereo-visual">
        <h4>Perceptual Representation of Stereo Panning</h4>
        <div class="head-model-container">
          <!-- 3D head visualization -->
        </div>
      </div>
      <div class="stereo-explanation">
        <!-- Explanation with bullet points -->
      </div>
    </div>
    <div class="audio-demo-section fade-in-element">
      <h4>Demonstration:</h4>
      <div class="custom-audio-player">
        <!-- Custom audio player matching main site's video player aesthetics -->
      </div>
      <ul class="demo-instructions">
        <li>Close your eyes and press play. Keep your head still, facing straight ahead.</li>
        <li>Does the source sound like it travels around your head or back and forth through your head as shown in the animation to the left?</li>
      </ul>
    </div>
  </div>
</section>
```
**CSS**:
```css
.stereo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-l);
  margin-bottom: var(--space-l);
}
.demo-instructions {
  list-style-type: disc;
  margin-left: 1.5em;
  color: var(--clr-text-primary);
}
.demo-instructions li {
  margin-bottom: var(--space-xs);
}
```

### 4. Binaural Processing Section  
**Content**:
- **Section title**: "Binaural Processing"
- **Two-column layout**:
  - Left: Explanation text with technical details about HRTF
  - Right: HRTF spectrum visualization and 3D head model
- **HRTF Spectrum Plot**: Interactive visualization showing frequency response
- **Audio demonstration** with same player format as stereo section
- **3D visualization** showing binaural rotation with elevation

### 5. Externalization Processing Section 
**Content**:
- **Section title**: "Externalization Processing"
- **Two-column layout**:
  - Left: 3D head model with externalization visualization
  - Right: Technical explanation of externalization processing
- **Audio demonstration** with player
- **Links** to research papers and slides
- **3D model** showing externalized binaural rotation

### 6. Appendix - Comparisons Section
**Content**:
- **Section title**: "Appendix - Comparisons"
- **Grid layout** of comparison cards (5x5 grid):
  - Each card contains:
    - Position description (e.g., "Stationary Source Left -45°")
    - "Traditional Stereo (No Processing)" audio player
    - "Binaural Processing" audio player  
    - "Externalized" audio player
- **Special rotating source** demonstration in center
- **Consistent audio player styling** across all cards

### 7. Future Work Section
**Content**:
- **Section title**: "Future Work"
- **Centered content** with bullet points
- **Acknowledgments** section with links
- **Footer** with copyright information

## Technical Requirements - Matching Main Site Architecture

### Audio Players - Based on Main Site Video Player Pattern
**HTML Structure** (matching main site's video player aesthetics):
```html
<div class="custom-audio-player">
  <div class="audio-controls">
    <button class="play-pause-btn" aria-label="Play audio">
      <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24">
        <!-- Triangle play icon -->
      </svg>
      <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" style="display: none;">
        <!-- Pause icon -->
      </svg>
    </button>
    <div class="audio-progress-container">
      <div class="audio-progress-bar">
        <div class="audio-progress-fill"></div>
      </div>
    </div>
    <div class="audio-time-display">
      <span class="current-time">00:00</span> / <span class="total-time">00:24</span>
    </div>
  </div>
  <audio preload="metadata">
    <source src="audio-file.mp3" type="audio/mpeg">
  </audio>
</div>
```

**CSS** (matching main site button and control styling):
```css
.custom-audio-player {
  background-color: var(--clr-background-secondary);
  border: 1px solid var(--clr-border-primary);
  border-radius: var(--border-radius);
  padding: var(--space-s);
  margin: var(--space-m) 0;
}
.play-pause-btn {
  background-color: var(--clr-accent-primary);
  color: var(--clr-background-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-standard);
}
.play-pause-btn:hover {
  background-color: var(--clr-accent-secondary);
}
```

### 3D Visualizations - CSS-based with Fallbacks
- **Primary implementation**: CSS 3D transforms using existing patterns from main site
- **Animation timing**: Use main site's `--transition-standard` variable
- **Fallback strategy**: 2D representations for older browsers
- **Performance**: Hardware acceleration with `transform: translateZ(0)`

### Responsive Design - Exact Main Site Patterns
- **Breakpoints**: Use same media queries as main site (768px, 1024px, 1280px)
- **Grid layouts**: Follow main site's grid patterns (projects-grid, about-grid, etc.)
- **Mobile navigation**: Exact same hamburger menu implementation
- **Touch interactions**: Same touch handling as main site carousel

### Fade-in Animations - Exact Main Site Implementation
**JavaScript**: Use identical Intersection Observer setup from `main.js`:
```javascript
// Copy exact setupIntersectionObserver() function
// Copy exact checkForVisibleElements() function
// Apply .fade-in-element class to all animated elements
// Use same .visible class toggle system
```

**CSS**: Use exact same animation classes from main site:
```css
.fade-in-element {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.fade-in-element.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Asset Integration

### Existing Assets to Use
From `wip/assets/binaural-externalization/`:
- HRTF spectrum plot videos (01, 02)
- 3D rotation visualizations (03-08 .webm files)
- Spatial rotation demonstrations (09-11)
- Trajectory visualization assets

### Audio Files Needed
- Stereo panning demonstration audio
- Binaural processing demonstration audio  
- Externalized processing demonstration audio
- Comparison audio files for all positions
- Rotating source audio demonstrations

### Visual Assets
- 3D head model (can be CSS/WebGL rendered)
- HRTF spectrum visualization
- Background gradients and textures
- Navigation button styling

## Color Scheme - Using Main Site CSS Variables
**Reuse ALL existing CSS custom properties from main site**:
```css
/* Light Mode Colors (main site variables) */
--clr-background-primary: #FFFFFF;
--clr-background-secondary: #F0F2F5;
--clr-text-primary: #212529;
--clr-text-secondary: #6C757D;
--clr-text-headings: #1A1F23;
--clr-accent-primary: #4A90E2;
--clr-accent-secondary: #357ABD;
--clr-border-primary: #DEE2E6;
--clr-shadow-color: rgba(0, 0, 0, 0.075);

/* Dark Mode Colors (automatic theme switching) */
html[data-theme="dark"] {
  --clr-background-primary: #121212;
  --clr-background-secondary: #1E1E1E;
  --clr-text-primary: #E0E0E0;
  --clr-text-secondary: #A0A0A0;
  --clr-text-headings: #F5F5F5;
  --clr-accent-primary: #5E9BEF;
  --clr-accent-secondary: #7BAAF0;
  --clr-border-primary: #333333;
  --clr-shadow-color: rgba(0, 0, 0, 0.3);
}
```

**Binaural-specific gradient colors**:
```css
/* Custom gradients while maintaining theme compatibility */
.binaural-gradient-primary: linear-gradient(135deg, #8B5FBF 0%, #5F8BBF 100%);
.binaural-gradient-secondary: linear-gradient(135deg, #A67BC6 0%, #7BAEF0 100%);
```

## Typography - Exact Main Site Font System
**Use identical font loading** from main site:
```html
<!-- Copy exact @font-face declarations from index.html -->
<style>
  @font-face {
    font-family: 'Brandon Grotesque';
    src: url('assets/fonts/Brandon-Grotesque/Brandon-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  /* ... all other Brandon Grotesque variants */
</style>
```

**Font weight variables** (from main site):
```css
--font-weight-light: 300;
--font-weight-regular: 400; 
--font-weight-medium: 500;
--font-weight-bold: 700;
--font-weight-black: 900;
```

**Heading hierarchy** (exact match to main site):
- `h1`: `font-size: 2.5rem; font-weight: var(--font-weight-medium)`
- `h2`: `font-size: 2rem; font-weight: var(--font-weight-medium)`
- `h3`: `font-size: 1.5rem; font-weight: var(--font-weight-regular)`
- `h4`: `font-weight: var(--font-weight-regular)`
- Body text: `font-weight: var(--font-weight-light)` (main site default)

## Animations & Interactions
- **Smooth scroll** between sections (800ms ease-in-out)
- **Fade-in animations** for sections on scroll
- **3D model rotations** synchronized with audio playback
- **Progress bar animations** during audio playback
- **Hover effects** on navigation and interactive elements

## Accessibility
- **ARIA labels** for all interactive elements
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Focus indicators** for all interactive elements
- **Alt text** for all images and visualizations

## SEO & Meta
- **Page title**: "Binaural Externalization Processing Demonstration - Christopher Landschoot"
- **Meta description**: Research demonstration of colorless binaural externalization processing
- **Open Graph** tags for social sharing
- **Structured data** for research/academic content

## Footer - Exact Match to Main Site
**HTML Structure** (copy exact footer from `index.html`):
```html
<footer>
  <div class="container">
    <ul class="social" id="social-links">
      <!-- Copy exact social links from main site -->
      <li>
        <a href="https://www.linkedin.com/in/christopher-landschoot/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <!-- Copy exact SVG icons -->
        </a>
      </li>
      <!-- ... all other social links ... -->
    </ul>
    <small>©2024 Christopher Landschoot</small>
    <small>©2024 Virtual Works</small>
  </div>
</footer>
```

**Back to Top Button** (copy exact implementation):
```html
<button class="to-top" aria-label="Back to top">↑</button>
```

**Note**: Since the logo is removed, consider adding a subtle back link to the main site in the footer or as the first navigation pill.

## File Structure
```
wip/
├── binaural-externalization.html (new main page)
├── css/
│   ├── style.css (existing - reuse variables and base styles)
│   └── binaural-externalization.css (additional styles only)
├── js/
│   ├── main.js (existing - reuse functions)
│   └── binaural-externalization.js (page-specific functionality)
└── assets/
    └── binaural-externalization/ (existing assets)
```

## Integration with Main Site - Exact Consistency
### JavaScript Integration
**Reuse main site functions**:
```javascript
// Copy these exact functions from main.js:
// - setupIntersectionObserver()
// - checkForVisibleElements() 
// - setupSmoothScrolling()
// - setupBackToTop()
// - Theme toggle functionality (applyTheme, toggleTheme)
// - debounce() utility function
```

### CSS Integration
**Method 1** - Link both stylesheets:
```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/binaural-externalization.css">
```

**Method 2** - Import in binaural CSS:
```css
@import url('style.css');
/* Additional binaural-specific styles */
```

### Navigation Back to Main Site
**Add back link in navigation or footer** (since logo is removed):
```html
<!-- Option 1: Add to navigation pills -->
<li><a href="index.html" class="nav-pill nav-back">← Back to Main Site</a></li>

<!-- Option 2: Add to footer -->
<footer>
  <div class="container">
    <p><a href="index.html">← Back to Christopher Landschoot's Main Site</a></p>
    <!-- ... rest of footer ... -->
  </div>
</footer>
```

### Theme Compatibility
- **Use identical theme toggle button** (copy exact HTML/JS from main site)
- **Ensure all binaural-specific styles** work with both light/dark themes
- **Test color contrasts** in both themes for accessibility

## Browser Support
- **Modern browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Progressive enhancement** for older browsers
- **Graceful degradation** of 3D and audio features
- **Mobile browsers**: iOS Safari 13+, Chrome Mobile 80+

## Performance Targets - Same as Main Site
- **First Contentful Paint**: < 2.5s
- **Largest Contentful Paint**: < 4s  
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 5s
- **Audio loading**: Progressive/streaming where possible
- **Font loading**: Use same `font-display: swap` strategy as main site
- **Image optimization**: Follow main site's lazy loading patterns

## Meta Tags & SEO - Following Main Site Pattern
**HTML Head** (copy structure from main site):
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Interactive demonstration of colorless binaural externalization processing for spatial audio - Christopher Landschoot">
  <meta property="og:title" content="Binaural Externalization Processing Demonstration - Christopher Landschoot">
  <meta property="og:description" content="Interactive demonstration of colorless binaural externalization processing for spatial audio">
  <meta property="og:image" content="assets/binaural-externalization/trajectory.png">
  <meta property="twitter:card" content="summary_large_image">
  <title>Binaural Externalization Processing Demonstration - Christopher Landschoot</title>
  
  <!-- Copy exact favicon structure from main site -->
  <link rel="icon" href="assets/favicon/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon/favicon-16x16.png">
  <!-- ... all other favicon links ... -->
  
  <!-- Copy exact font loading from main site -->
  <style>
    /* All @font-face declarations */
  </style>
</head>
```

## Development Guidelines
### Code Organization
- **HTML**: Follow main site's semantic structure and class naming
- **CSS**: Use main site's utility classes and naming conventions
- **JavaScript**: Follow main site's module pattern and naming
- **Comments**: Match main site's commenting style

### Testing Requirements
- **Cross-browser**: Test on same browsers as main site
- **Responsive**: Test on same breakpoints as main site  
- **Accessibility**: Use main site's ARIA patterns and color contrast ratios
- **Theme switching**: Test all functionality in both light/dark modes
- **Audio compatibility**: Test across different audio formats and devices

### Maintenance Considerations
- **Version control**: Follow same Git patterns as main site
- **Asset management**: Use same optimization and organization as main site
- **Documentation**: Match main site's code documentation standards

This specification provides a comprehensive blueprint for recreating the binaural externalization demonstration as a perfectly integrated sub-page of the Christopher Landschoot website, ensuring pixel-perfect design consistency while preserving all interactive and educational functionality of the original site. 