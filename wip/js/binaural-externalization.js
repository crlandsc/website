// Binaural Externalization Page JavaScript
// This script handles the interactive functionality for the binaural externalization demonstration page

document.addEventListener('DOMContentLoaded', () => {
  console.log('Binaural Externalization page loaded');
  
  // Initialize all functionality
  // Note: Theme toggle is handled by main.js to avoid conflicts
  initializeSmoothScrolling();
  initializeAudioPlayers();
  initializeIntersectionObserver();
  initializeNavigationHighlighting();
  initializeComparisonGrid();
  initializeBackToTop();
  initializeMobileNavigation();
  
  // Handle initial hash navigation
  handleInitialHash();
});



/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 70; // Account for fixed header - matches main site
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Initialize custom audio players
 */
function initializeAudioPlayers() {
  const audioPlayers = document.querySelectorAll('.custom-audio-player');
  
  audioPlayers.forEach(player => {
    const audio = player.querySelector('audio');
    const playPauseBtn = player.querySelector('.play-pause-btn');
    const playIcon = player.querySelector('.play-icon');
    const pauseIcon = player.querySelector('.pause-icon');
    const progressBar = player.querySelector('.audio-progress-bar');
    const progressFill = player.querySelector('.audio-progress-fill');
    const currentTimeSpan = player.querySelector('.current-time');
    const totalTimeSpan = player.querySelector('.total-time');
    
    if (!audio) return;
    
    // Ensure all other audio players are paused when one starts playing
    const pauseOtherPlayers = () => {
      document.querySelectorAll('.custom-audio-player audio').forEach(otherAudio => {
        if (otherAudio !== audio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });
    };
    
    // Update play/pause button states
    const updatePlayPauseButtons = () => {
      document.querySelectorAll('.custom-audio-player').forEach(otherPlayer => {
        const otherAudio = otherPlayer.querySelector('audio');
        const otherPlayIcon = otherPlayer.querySelector('.play-icon');
        const otherPauseIcon = otherPlayer.querySelector('.pause-icon');
        
        if (otherAudio && otherAudio.paused) {
          if (otherPlayIcon) otherPlayIcon.style.display = 'block';
          if (otherPauseIcon) otherPauseIcon.style.display = 'none';
        } else if (otherAudio && !otherAudio.paused) {
          if (otherPlayIcon) otherPlayIcon.style.display = 'none';
          if (otherPauseIcon) otherPauseIcon.style.display = 'block';
        }
      });
    };
    
    // Play/Pause button click handler
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        pauseOtherPlayers();
        audio.play();
      } else {
        audio.pause();
      }
    });
    
    // Audio event listeners
    audio.addEventListener('play', () => {
      updatePlayPauseButtons();
    });
    
    audio.addEventListener('pause', () => {
      updatePlayPauseButtons();
    });
    
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (currentTimeSpan) currentTimeSpan.textContent = formatTime(audio.currentTime);
      }
    });
    
    audio.addEventListener('loadedmetadata', () => {
      if (totalTimeSpan) totalTimeSpan.textContent = formatTime(audio.duration);
    });
    
    // Progress bar click handler
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
      });
    }
    
    // Audio ended handler
    audio.addEventListener('ended', () => {
      updatePlayPauseButtons();
      if (progressFill) progressFill.style.width = '0%';
      if (currentTimeSpan) currentTimeSpan.textContent = '00:00';
    });
  });
}

/**
 * Format time in MM:SS format
 */
function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Initialize Intersection Observer for fade-in effects
 */
function initializeIntersectionObserver() {
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    fadeElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}

/**
 * Initialize navigation pill highlighting based on scroll position
 */
function initializeNavigationHighlighting() {
  const navPills = document.querySelectorAll('.nav-pill');
  const sections = document.querySelectorAll('section[id]');
  
  const updateActiveNavPill = () => {
    const scrollPosition = window.scrollY + 70; // Account for header - matches main site
    
    let activeSection = null;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = section.getAttribute('id');
      }
    });
    
    navPills.forEach(pill => {
      const href = pill.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId === activeSection) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      }
    });
  };
  
  // Throttled scroll handler
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNavPill();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', scrollHandler);
  
  // Initial check
  updateActiveNavPill();
}

/**
 * Initialize comparison grid with audio samples
 */
function initializeComparisonGrid() {
  const comparisonGrid = document.querySelector('.comparison-grid');
  if (!comparisonGrid) return;
  
  // Define the comparison data
  const comparisonData = [
    { angle: 0, label: 'Front (0°)' },
    { angle: 30, label: 'Front Right (30°)' },
    { angle: 45, label: 'Front Right (45°)' },
    { angle: 90, label: 'Right (90°)' },
    { angle: 135, label: 'Back Right (135°)' },
    { angle: 150, label: 'Back Right (150°)' },
    { angle: 180, label: 'Back (180°)' },
    { angle: 210, label: 'Back Left (210°)' },
    { angle: 225, label: 'Back Left (225°)' },
    { angle: 270, label: 'Left (270°)' },
    { angle: 315, label: 'Front Left (315°)' },
    { angle: 330, label: 'Front Left (330°)' }
  ];
  
  // Create comparison cards
  comparisonData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'comparison-card fade-in-element';
    
    card.innerHTML = `
      <h5>${item.label}</h5>
      <div class="comparison-audio-players">
        <div class="comparison-player">
          <h6>Binaural</h6>
          <div class="custom-audio-player compact">
            <div class="audio-controls">
              <button class="play-pause-btn" aria-label="Play binaural audio">
                <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </button>
              <div class="audio-progress-container">
                <div class="audio-progress-bar">
                  <div class="audio-progress-fill"></div>
                </div>
              </div>
            </div>
            <audio preload="metadata">
              <source src="assets/binaural-externalization/binaural-${item.angle}.mp3" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
        <div class="comparison-player">
          <h6>Externalized</h6>
          <div class="custom-audio-player compact">
            <div class="audio-controls">
              <button class="play-pause-btn" aria-label="Play externalized audio">
                <svg class="play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </button>
              <div class="audio-progress-container">
                <div class="audio-progress-bar">
                  <div class="audio-progress-fill"></div>
                </div>
              </div>
            </div>
            <audio preload="metadata">
              <source src="assets/binaural-externalization/externalized-${item.angle}.mp3" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
    `;
    
    comparisonGrid.appendChild(card);
  });
  
  // Re-initialize audio players for the new comparison grid
  initializeAudioPlayers();
  
  // Re-initialize intersection observer for new elements
  const newFadeElements = comparisonGrid.querySelectorAll('.fade-in-element');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    newFadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    newFadeElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
  const backToTopButton = document.querySelector('.to-top');
  if (!backToTopButton) return;
  
  const showButton = () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  };
  
  // Throttled scroll handler
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        showButton();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', scrollHandler);
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Initial check
  showButton();
}

/**
 * Initialize mobile navigation
 */
function initializeMobileNavigation() {
  const mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) return;
  
  const summary = mobileNav.querySelector('summary');
  const navLinks = mobileNav.querySelectorAll('a[href^="#"]');
  
  // Close mobile nav when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.removeAttribute('open');
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && mobileNav.hasAttribute('open')) {
      mobileNav.removeAttribute('open');
    }
  });
}

/**
 * Handle initial hash navigation
 */
function handleInitialHash() {
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Smooth scroll to target after a short delay to ensure page is fully loaded
      setTimeout(() => {
        const headerHeight = 70; // Account for fixed header - matches main site
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle page visibility changes to pause audio when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause all audio when page becomes hidden
    document.querySelectorAll('audio').forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }
});

// Handle window resize to update layout-dependent functionality
window.addEventListener('resize', debounce(() => {
  // Update navigation highlighting
  const event = new Event('scroll');
  window.dispatchEvent(event);
}, 150)); 