// Ensure section backgrounds are visible before DOM is fully loaded
(function() {
  // Make backgrounds visible immediately for hash navigation
  if (window.location.hash) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Try to add a class to body as early as possible
    if (document.body) {
      document.body.classList.add('hash-navigation');
    } else {
      // If body isn't ready, use this trick
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('hash-navigation');
      });
    }
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, using hardcoded content for now...');
  
  // Check if we're loading with a hash in the URL
  if (window.location.hash) {
    document.body.classList.add('hash-navigation');
    
    // Force background visibility immediately
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('bg-visible');
    });
  }
  
  // Initialize GitHub stats directly without requiring content.json
  initGitHubStats();

  // Set up Intersection Observer for section fade-in
  setupIntersectionObserver();

  // Set up mobile navigation
  setupMobileNav();

  // Set up back-to-top button
  setupBackToTop();



  // Set up contact form
  setupContactForm();

  // Set up parallax effect for hero image
  setupParallax();

  // Set up smooth scrolling for navigation links
  setupSmoothScrolling();

  // Handle URL hash on page load
  handleInitialHash();
  
  // Set up clickable videos
  setupClickableVideos();
  
  // Set up the sea-of-code wave animation
  initHeroCodeSea();
  
  // Set up interests carousel
  setupInterestsCarousel();
  
  // Add window resize handler to check for newly visible elements
  window.addEventListener('resize', debounce(checkForVisibleElements, 150));

  // Theme Toggle Functionality
  const themeToggleButton = document.getElementById('theme-toggle');
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');
  const htmlElement = document.documentElement; // Gets the <html> element

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      if (themeToggleButton) themeToggleButton.setAttribute('aria-label', 'Switch to light mode');
      if (lightIcon) lightIcon.style.display = 'none';
      if (darkIcon) darkIcon.style.display = 'block';
    } else {
      htmlElement.removeAttribute('data-theme'); // Remove attribute instead of setting to light
      if (themeToggleButton) themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
      if (lightIcon) lightIcon.style.display = 'block';
      if (darkIcon) darkIcon.style.display = 'none';
    }
  };

  // Check for user's stored preference first
  const storedTheme = localStorage.getItem('theme');
  
  // Get system preference using media query
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Determine which theme to apply
  if (storedTheme) {
    // User has a stored preference, use that
    applyTheme(storedTheme);
  } else {
    // No stored preference, use system preference
    applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
  }

  // Add theme toggle button click handler
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      // Get current theme
      const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      // Set new theme to the opposite
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      // Store the user's preference
      localStorage.setItem('theme', newTheme);
      // Apply the new theme
      applyTheme(newTheme);
    });
  }

  // Listen for system preference changes
  systemPrefersDark.addEventListener('change', (e) => {
    // Only apply system preference if no manual preference is stored
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Ensure fade-in elements are correctly handled on load/theme change
  // This might need adjustment depending on how your existing fade-in logic works
  const fadeInElements = document.querySelectorAll('.fade-in-element');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  fadeInElements.forEach(el => observer.observe(el));
});

/**
 * Debounce function to prevent excessive function calls
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Check for elements that are visible in the viewport but haven't been animated
 */
function checkForVisibleElements() {
  const elements = document.querySelectorAll('.fade-in-element:not(.visible)');
  
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.top > -rect.height) {
      element.classList.add('visible');
    }
  });

  // Also check for any new .project-card elements that might have been added
  const projectCards = document.querySelectorAll('.project-card:not(.fade-in-element)');
  if (projectCards.length > 0) {
    projectCards.forEach(card => {
      card.classList.add('fade-in-element');
      
      // If the card is already in the viewport, make it visible immediately
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.top > -rect.height) {
        card.classList.add('visible');
      } else if ('IntersectionObserver' in window) {
        // Otherwise observe it for when it comes into view
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('visible');
              }, 100);
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px'
        });
        
        observer.observe(card);
      }
    });
  }
}

/**
 * Handles initial page load with hash in URL
 */
function handleInitialHash() {
  // If page loads with a hash in URL, scroll to that section with proper offset
  if (window.location.hash) {
    const targetId = window.location.hash;
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // First ensure all sections have fade-in-element class applied to subcomponents
      document.querySelectorAll('.section').forEach(section => {
        // Make sure all h3 elements are included for animation
        const h3Elements = section.querySelectorAll('h3');
        h3Elements.forEach(elem => {
          elem.classList.add('fade-in-element');
        });
      });
      
      // Make all sections' backgrounds visible
      document.querySelectorAll('.section').forEach(section => {
        section.classList.add('bg-visible');
      });

      // Immediately scroll to target section (without waiting)
      const rect = targetElement.getBoundingClientRect();
      const offset = rect.top + window.pageYOffset;
      
      window.scrollTo({
        top: offset - 70, // Exact match to header height
        behavior: 'auto' // Use 'auto' instead of 'smooth' for initial load
      });
      
      // After scrolling to the target, determine which elements are visible
      setTimeout(() => {
        // Make sections visible (this is important for section layout)
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
          const rect = section.getBoundingClientRect();
          // If section is in viewport or above it, make it visible
          if (rect.bottom > 0) { // Section is below the top of viewport
            section.classList.add('visible');
          }
        });
        
        // Find all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in-element');
        
        // Make only the visible elements "visible" immediately, let others animate normally
        fadeElements.forEach(element => {
          const elemRect = element.getBoundingClientRect();
          // If element is in viewport, make it visible immediately
          if (elemRect.top < window.innerHeight && elemRect.bottom > 0) {
            element.classList.add('visible');
          }
          // Elements below the viewport will animate normally when scrolled to
        });
        
        // Re-observe elements that aren't visible yet
        if ('IntersectionObserver' in window && 
            !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          
          const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add('visible');
                }, 100);
                elementObserver.unobserve(entry.target);
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
          });
          
          // Re-observe only elements that are not already visible
          document.querySelectorAll('.fade-in-element:not(.visible)').forEach(element => {
            elementObserver.observe(element);
          });
        }
      }, 50); // Small delay to ensure scroll is complete
    }
  }
}

/**
 * Populates the website content from the JSON data
 */
function populateContent(data) {
  console.log('populateContent called with data:', data);
  
  // About section
  if (data.about) {
    console.log('Populating about section...');
    const aboutText = document.getElementById('about-text');
    if (aboutText) {
      aboutText.innerHTML = data.about.map(paragraph => `<p>${paragraph}</p>`).join('');
      console.log('About section populated');
    } else {
      console.error('Element #about-text not found');
    }
  }

  // Experience section
  if (data.experience) {
    console.log('Populating experience section...');
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = data.experience.map(job => `
        <div class="experience-item">
          <div class="experience-content">
            <h4>${job.title} • ${job.company}</h4>
            <div class="experience-date">
              <span>${job.period}</span>
            </div>
            <p>${job.description}</p>
          </div>
        </div>
      `).join('');
      console.log('Experience section populated');
    } else {
      console.error('Element .timeline-container not found');
    }
  }

  // Projects section
  if (data.projects) {
    console.log('Populating projects section...');
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = data.projects.map(project => `
        <article class="project-card" data-repo="${project.repo}">
          <h4><a href="${project.url}" target="_blank" rel="noopener noreferrer">${project.title}</a></h4>
          <p>${project.description}</p>
          <ul class="meta">
            <li class="stars">★ --</li>
            <li class="forks">⑂ --</li>
          </ul>
        </article>
      `).join('');
      console.log('Projects section populated');
    } else {
      console.error('Element #projects-grid not found');
    }
  }

  // Education section
  if (data.education) {
    console.log('Populating education section...');
    const educationGrid = document.getElementById('education-grid');
    if (educationGrid) {
      educationGrid.innerHTML = data.education.map(edu => `
        <div class="education-row fade-in-element">
          <div class="education-right">
            <div>${edu.degree}</div>
            <div>${edu.school}</div>
          </div>
          <div class="education-left">
            <div>${edu.period}</div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
          </div>
        </div>
      `).join('');
      console.log('Education section populated');
    } else {
      console.error('Element #education-grid not found');
    }
  }

  // Research content
  if (data.research) {
    console.log('Populating research section...');
    const researchContent = document.getElementById('research-content');
    if (researchContent) {
      researchContent.innerHTML = `
        <p>${data.research.description} <a href="${data.research.scholarUrl}" target="_blank" rel="noopener noreferrer">Google Scholar</a> | <a href="${data.research.researchGateUrl}" target="_blank" rel="noopener noreferrer">ResearchGate</a></p>
        ${data.research.publications.map(pub => `<p><a href="${pub.url}" target="_blank" rel="noopener noreferrer">${pub.title}</a></p>`).join('')}
      `;
      console.log('Research section populated');
    } else {
      console.error('Element #research-content not found');
    }
  }

  // Skills
  if (data.skills) {
    console.log('Populating skills section...');
    const programmingSkills = document.getElementById('programming-skills');
    const audioSkills = document.getElementById('audio-skills');
    const technicalSkills = document.getElementById('technical-skills');

    if (programmingSkills && data.skills.programming) {
      programmingSkills.innerHTML = data.skills.programming.map(skill => 
        `<span class="skill-tag">${skill}</span>`
      ).join('');
      console.log('Programming skills populated');
    } else if (!programmingSkills) {
      console.error('Element #programming-skills not found');
    }

    if (audioSkills && data.skills.audio) {
      audioSkills.innerHTML = data.skills.audio.map(skill => 
        `<span class="skill-tag">${skill}</span>`
      ).join('');
      console.log('Audio skills populated');
    } else if (!audioSkills) {
      console.error('Element #audio-skills not found');
    }

    if (technicalSkills && data.skills.technical) {
      technicalSkills.innerHTML = data.skills.technical.map(skill => 
        `<span class="skill-tag">${skill}</span>`
      ).join('');
      console.log('Technical skills populated');
    } else if (!technicalSkills) {
      console.error('Element #technical-skills not found');
    }
  }

  // Social links
  if (data.social) {
    console.log('Populating social links...');
    const socialLinks = document.getElementById('social-links');
    if (socialLinks) {
      socialLinks.innerHTML = data.social.map(item => `
        <li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a></li>
      `).join('');
      console.log('Social links populated');
    } else {
      console.error('Element #social-links not found');
    }
  }
  
  console.log('Content population complete');
}

/**
 * Sets up the Intersection Observer for section fade-in
 */
function setupIntersectionObserver() {
  const sections = document.querySelectorAll('.section');
  
  // Set background colors immediately by adding a class
  sections.forEach(section => {
    section.classList.add('bg-visible');
  });
  
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window && 
      !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    
    // First, add the fade-in-element class to elements we want to animate
    sections.forEach(section => {
      // Get main elements to animate within each section
      const animatableElements = [
        ...section.querySelectorAll('h2'),
        ...section.querySelectorAll('h3'), // Include all h3 elements for animation
        ...section.querySelectorAll('.about-grid'),
        ...section.querySelectorAll('.experience-item'),
        ...section.querySelectorAll('.project-card'),
        ...section.querySelectorAll('.interactive-demo-container'),
        ...section.querySelectorAll('.education-row'),
        ...section.querySelectorAll('.skills-column'),
        ...section.querySelectorAll('.carousel-container'),
        ...section.querySelectorAll('#contact-form'),
        ...section.querySelectorAll('.research')
      ];
      
      // Add fade-in-element class to each element
      animatableElements.forEach(elem => {
        elem.classList.add('fade-in-element');
      });
    });
    
    // Create observer for sections (needed for layout purposes)
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Observe all sections
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    
    // Create observer for individual elements
    const elementObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a small delay to prevent layout shifts during scrolling
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 100);
          elementObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px' // Trigger a bit earlier
    });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-element').forEach(element => {
      elementObserver.observe(element);
    });
  } else {
    // Fallback for browsers without Intersection Observer or reduced motion preference
    document.querySelectorAll('.fade-in-element').forEach(element => {
      element.classList.add('visible');
    });
    sections.forEach(section => {
      section.classList.add('visible');
    });
  }
  
  // Initialize all sections above the fold as visible immediately
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      section.classList.add('visible');
      // Also make the elements above the fold visible
      section.querySelectorAll('.fade-in-element').forEach(element => {
        element.classList.add('visible');
      });
    }
  });
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get the element's position relative to the viewport
        const rect = targetElement.getBoundingClientRect();
        const offset = rect.top + window.pageYOffset;
        
        // Scroll with a slight adjustment for better visual positioning
        window.scrollTo({
          top: offset - 70, // Exact match to header height for clean alignment
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        window.history.pushState(null, null, targetId);
        
        // Remove focus after click to prevent persistent highlighting
        this.blur();
      }
    });
  });
}

/**
 * Sets up the mobile navigation toggle
 */
function setupMobileNav() {
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileNav) {
    // Close mobile menu when a link is clicked
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.removeAttribute('open');
        // Remove focus to prevent highlight persisting
        link.blur();
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (mobileNav.hasAttribute('open') && 
          !mobileNav.contains(event.target)) {
        mobileNav.removeAttribute('open');
      }
    });
  }
  
  // Add blur handling to all header links including external links
  const allHeaderLinks = document.querySelectorAll('header a');
  allHeaderLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Short delay to ensure the navigation action completes first
      setTimeout(() => {
        this.blur();
      }, 100);
    });
  });
}

/**
 * Sets up the back-to-top button
 */
function setupBackToTop() {
  const toTopButton = document.querySelector('.to-top');
  
  if (toTopButton) {
    // Show button when scrolled down
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        toTopButton.classList.add('visible');
      } else {
        toTopButton.classList.remove('visible');
      }
    });

    // Smooth scroll to top when clicked
    toTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * Sets up the interests carousel
 */


/**
 * Sets up the GitHub stats fetch for projects
 */
function initGitHubStats() {
  const projectCards = document.querySelectorAll('.project-card');
  const delay = 500; // ms between requests to avoid rate limiting
  let requestCount = 0;
  const maxRequests = 10; // GitHub API has a rate limit
  
  projectCards.forEach((card, index) => {
    const repo = card.dataset.repo;
    if (!repo) {
      // For non-GitHub projects, check if we need to update the meta section
      const meta = card.querySelector('.meta');
      if (meta && meta.children.length === 1 && meta.querySelector('.platform')) {
        // This is a project with a platform tag (like SoundCloud), leave it as is
        return;
      }
      return; // Skip cards without repo attribute
    }

    // Delay requests to avoid rate limiting
    setTimeout(() => {
      if (requestCount < maxRequests) {
        fetchGitHubStats(repo, card);
        requestCount++;
      }
    }, index * delay);
  });
}

/**
 * Fetches GitHub stats for a specific repository
 */
function fetchGitHubStats(repo, card) {
  fetch(`https://api.github.com/repos/${repo}`)
    .then(response => {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const stars = data.stargazers_count;
      const forks = data.forks_count;
      const cardContent = card.querySelector('.meta');
      cardContent.innerHTML = `
        <li class="stars">★ ${stars}</li>
        <li class="forks">⑂ ${forks}</li>
      `;
    })
    .catch(error => {
      console.error('Error fetching GitHub stats:', error);
    });
}

/**
 * Sets up the contact form mailto functionality
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = encodeURIComponent(form.elements.name.value);
      const email = encodeURIComponent(form.elements.email.value);
      const subject = encodeURIComponent(form.elements.subject.value || `Message from ${form.elements.name.value}`);
      const message = encodeURIComponent(form.elements.message.value);
      
      // Create the mailto URL with all form data
      const mailtoUrl = `mailto:crlandschoot@gmail.com?subject=${subject}&body=Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
      
      // Open the user's email client
      window.location.href = mailtoUrl;
    });
  }
}

/**
 * Sets up the parallax effect for the hero image
 */
function setupParallax() {
  const heroSection = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  
  if (heroSection && heroBg) {
    // Calculate parallax effect
    /* // Commenting out parallax for hero-bg as it now contains SVG animation
    window.addEventListener('scroll', () => {
      // Get scroll position
      const scrollPosition = window.scrollY;
      
      // Only apply effect when hero section is in or near the viewport
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        // Move the background at a slower rate (0.5x) than the scroll speed
        const yPos = scrollPosition * 0.4;
        heroBg.style.transform = `translateY(${yPos}px)`;
      }
    });
    */
  }
}

/**
 * Sets up clickable videos behavior
 */
function setupClickableVideos() {
  const clickableVideos = document.querySelectorAll('.clickable-video');
  
  clickableVideos.forEach(video => {
    // Ensure video is muted so it can autoplay
    video.muted = true;
    
    // Add loading indicator
    const videoContainer = video.parentElement;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'video-loading';
    loadingIndicator.innerHTML = '<span>Loading video...</span>';
    videoContainer.insertBefore(loadingIndicator, video);
    
    // Handle video loading success
    video.addEventListener('canplay', function() {
      // Remove loading indicator when video can play
      if (loadingIndicator && loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator);
      }
      console.log('Video loaded and ready to play');
    });
    
    // Handle video loading error
    video.addEventListener('error', function(e) {
      console.error('Error loading video:', e);
      if (loadingIndicator) {
        loadingIndicator.innerHTML = '<span>Error loading video. Click to try again.</span>';
      }
    });
    
    // Try to play videos after page load (needed for some browsers)
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Auto-play prevented by browser, waiting for user interaction:', error);
          
          // Add click event to play video manually if autoplay fails
          video.parentElement.addEventListener('click', () => {
            video.play().catch(e => console.error('Error playing video on click:', e));
          }, { once: true });
        });
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
    
    // Add interaction visual feedback
    const videoLink = video.closest('.video-link');
    if (videoLink) {
      // For touch devices, add a class when touched to show the hover state
      videoLink.addEventListener('touchstart', () => {
        videoLink.classList.add('touch-active');
      });
      
      videoLink.addEventListener('touchend', () => {
        setTimeout(() => {
          videoLink.classList.remove('touch-active');
        }, 300);
      });
    }
  });
}

/**
 * Initializes and runs the sea-of-code wave animation with light/dark theme support.
 */
function initHeroCodeSea() {
  const canvas = document.getElementById('hero-code-canvas');
  if (!canvas) {
    console.error('Hero canvas element not found!');
    return;
  }
  const ctx = canvas.getContext('2d');

  /*====================================================================
    1. WAVE-ANIMATION CONTROLS – tweak these if you like
  ====================================================================*/
  const FONT_SIZE   = 15; //15;
  const WAVE_AMPL   = 6;
  const WAVE_LENGTH = .045;
  const WAVE_SPEED  = 0.0025;
  const WAVE_PHASE_Y= 1;

  // dynamic segment sizing thresholds
  const DEFAULT_SEGMENT_SIZE = 1;
  const LARGE_SEGMENT_SIZE = 2;
  const WIDTH_THRESHOLD = 2500; // px threshold for switching to larger segments on ultrawide
  let segmentSize = DEFAULT_SEGMENT_SIZE;
  // toggle framerate limiter on/off
  const USE_THROTTLE = false;
  const TARGET_FPS = 30;
  let lastFrameTime = 0;

  /*====================================================================
    2. RAW SOURCE CODE – define codeLines for the sea-of-code animation
  ====================================================================*/

  // const codeLines = [
  //   'import torch; import torch.nn as nn; from lightning.torch import LightningModule; from torchaudio.transforms import Spectrogram, MelSpectrogram; import numpy as np; from torch.utils.data import DataLoader, Dataset; import torch.nn.functional as F; from typing import Optional, Dict, Any; import math; import wav',
  //   '  class AudioModel(LightningModule): def __init__(self, n_fft=2048, lr=1e-3, dropout=0.1, hidden_dim=512, num_layers=6, attention_heads=8, mel_bins=128, sample_rate=44100, hop_length=512, win_length=2048, n_mels=80, fmin=0, fmax=8000, power=2.0, normalized=False, center=True, pad_mode="reflect"): super().__init__',
  //   '    super().__init__(); self.encoder = nn.Conv2d(1, 64, 3, padding=1); self.bn1 = nn.BatchNorm2d(64); self.decoder = nn.ConvTranspose2d(128, 4, 3, padding=1); self.attention = nn.MultiheadAttention(512, 8); self.dropout = nn.Dropout(0.1); self.layer_norm = nn.LayerNorm(512); self.positional_encoding = PositionalEncoding(512',
  //   ' self.decoder = nn.ConvTranspose2d(128, 4, 3, padding=1); self.loss = F.mse_loss; self.spectrogram = Spectrogram(n_fft=2048, hop_length=512, win_length=2048, power=2.0, normalized=True, center=True, pad_mode="reflect"); self.mel_scale = MelScale(n_mels=80, sample_rate=44100, f_min=0, f_max=8000, n_stft=1025); sel',
  //   '  def forward(self, x): spec = self.spectrogram(x); mel_spec = self.mel_scale(spec); encoded = self.encoder(mel_spec.unsqueeze(1)); attended, _ = self.attention(encoded.flatten(2).transpose(1, 2), encoded.flatten(2).transpose(1, 2), encoded.flatten(2).transpose(1, 2)); return self.decoder(encoded',
  //   '  def training_step(self, batch, idx): mixed_audio, target_sources = batch; predictions = self.forward(mixed_audio); loss = self.compute_loss(predictions, target_sources); si_sdr = self.compute_si_sdr(predictions, target_sources); self.log("train_loss", loss); self.log("train_si_sdr", si_sdr); retu',
  //   'optimizer = torch.optim.AdamW(params, lr=2e-4, weight_decay=1e-4, betas=(0.9, 0.999), eps=1e-8, amsgrad=False); scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6); warmup_scheduler = torch.optim.lr_scheduler.LinearLR(optimizer, start_factor=0.1, total_iters=10); schedul',
  //   ' from torchaudio.transforms import Spectrogram, MelSpectrogram, MFCC, Resample, Vol, Fade, FrequencyMasking, TimeMasking; import numpy as np; import librosa; from scipy import signal; import soundfile as sf; from audiomentations import Compose, AddGaussianNoise, TimeStretch, PitchShift, Shift; import numb',
  //   'dataloader = DataLoader(dataset, batch_size=32, shuffle=True, num_workers=8, pin_memory=True, drop_last=True, persistent_workers=True, prefetch_factor=2); val_dataloader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=4, pin_memory=True, drop_last=False, persistent_workers=False); dataloa',
  //   '  def configure_optimizers(self): optimizer = torch.optim.AdamW(self.parameters(), lr=self.learning_rate, weight_decay=1e-4); scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="min", factor=0.5, patience=5, verbose=True, threshold=1e-4, min_lr=1e-6); return {"optimizer": optimizer, "lr_schedul',
  //   ' class SeparationDataset(Dataset): def __init__(self, data_dir, sample_rate=44100, segment_length=4.0, transform=None, target_sources=["vocals", "drums", "bass", "other"]): self.data_dir = data_dir; self.sample_rate = sample_rate; self.segment_length = segment_length; self.transform = transform; def __getitem__(self, idx): retu',
  //   'augmentations = Compose([AddGaussianNoise(min_amplitude=0.001, max_amplitude=0.015, p=0.5), TimeStretch(min_rate=0.8, max_rate=1.2, leave_length_unchanged=False, p=0.3), PitchShift(min_semitones=-4, max_semitones=4, p=0.4), Shift(min_fraction=-0.5, max_fraction=0.5, p=0.6), FrequencyMask(p=0.2)]); augmentati',
  //   '   model.train(); total_loss = 0; epoch_si_sdr = 0; num_batches = len(dataloader); for batch_idx, batch in enumerate(tqdm(dataloader, desc="Training")): mixed_audio, target_sources = batch; predictions = model(mixed_audio); loss = criterion(predictions, target_sources); optimizer.zero_grad(); loss.backward(); pred',
  //   'checkpoint = torch.load("best_model.ckpt", map_location="cpu"); model.load_state_dict(checkpoint["state_dict"]); optimizer.load_state_dict(checkpoint["optimizer"]); scheduler.load_state_dict(checkpoint["scheduler"]); epoch = checkpoint["epoch"]; best_val_loss = checkpoint["best_val_loss"]; print(f"Loaded epoch {epoch}"); checkpoi',
  //   '  def compute_si_sdr(self, predicted, target, eps=1e-8): target_energy = torch.sum(target ** 2, dim=-1, keepdim=True); predicted_target = torch.sum(predicted * target, dim=-1, keepdim=True) / (target_energy + eps) * target; noise = predicted - predicted_target; signal_power = torch.sum(predicted_target ** 2, dim=-1); noi',
  //   'lightning_cli = LightningCLI(AudioModel, AudioDataModule, seed_everything=42, trainer_defaults={"max_epochs": 100, "accelerator": "gpu", "devices": 1, "precision": 16, "log_every_n_steps": 50, "val_check_interval": 0.25, "gradient_clip_val": 1.0, "accumulate_grad_batches": 4}); lightning_cli.trainer.fit(lightning_cli.model); lightn',
  //   '   trainer = Trainer(max_epochs=100, accelerator="gpu", devices=1, precision=16, logger=TensorBoardLogger("logs", name="audio_separation"), callbacks=[ModelCheckpoint(monitor="val_loss", save_top_k=3, mode="min"), EarlyStopping(monitor="val_loss", patience=15, mode="min")], log_every_n_steps=25, deterministic=True); trai',
  //   'from modal import Stub, Image, Secret, Mount, gpu; stub = Stub("audio-training"); image = Image.debian_slim().pip_install(["torch", "torchaudio", "lightning", "wandb", "tensorboard", "numpy", "librosa", "soundfile", "audiomentations", "asteroid", "pesq", "pystoi"]); @stub.function(image=image, gpu=gpu.A100(), timeout=3600',
  //   '  def train_remote(): model = AudioModel(n_fft=2048, lr=1e-3, dropout=0.15, hidden_dim=768, num_layers=8, attention_heads=12); data_module = AudioDataModule(data_dir="/data", batch_size=16, num_workers=8, sample_rate=44100); trainer = Trainer(max_epochs=50, accelerator="gpu", devices=1); trainer.fit(model, data_module); retu',
  //   'result = train_remote.remote(); print(f"Training completed successfully with result: {result}"); model_artifacts = download_model_artifacts(); upload_to_s3(model_artifacts, bucket="audio-models", key="separation/best_model.ckpt"); send_notification("Training job completed", channel="ml-alerts"); model_performance = eval_model(); res',
  //   '    import torchaudio; import torch.nn.functional as F; from torch.utils.data import DataLoader, Dataset, random_split; import torch.multiprocessing as mp; from torch.nn.parallel import DistributedDataParallel as DDP; import torch.distributed as dist; from torch.utils.data.distributed import DistributedSampler; import tensorboard; imp',
  //   'class UNetBlock(nn.Module): def __init__(self, in_channels, out_channels, kernel_size=3, stride=1, padding=1, bias=False, use_batchnorm=True, activation="relu", dropout_rate=0.0): super().__init__(); self.use_batchnorm = use_batchnorm; self.dropout_rate = dropout_rate; self.in_channels = in_channels; self.out_channels = out_channels; cla',
  //   ' self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, bias=bias); self.bn1 = nn.BatchNorm2d(out_channels) if use_batchnorm else nn.Identity(); self.activation1 = self._get_activation(activation); self.dropout1 = nn.Dropout2d(dropout_rate) if dropout_rate > 0 else nn.Identity(); self.conv2 = nn.Conv2',
  //   ' self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size, stride, padding, bias=bias); self.bn2 = nn.BatchNorm2d(out_channels) if use_batchnorm else nn.Identity(); self.activation2 = self._get_activation(activation); self.dropout2 = nn.Dropout2d(dropout_rate) if dropout_rate > 0 else nn.Identity(); self.residual_conn',
  //   '  def validation_step(self, batch, batch_idx): mixed_audio, target_sources = batch; with torch.no_grad(): predictions = self.forward(mixed_audio); val_loss = self.compute_loss(predictions, target_sources); val_si_sdr = self.compute_si_sdr(predictions, target_sources); self.log("val_loss", val_loss); self.log("val_si_sdr", val_si_sd',
  //   'scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="min", factor=0.5, patience=10, verbose=True, threshold=1e-4, threshold_mode="rel", cooldown=0, min_lr=1e-7, eps=1e-8); cosine_scheduler = torch.optim.lr_scheduler.CosineAnnealingWarmRestarts(optimizer, T_0=20, T_mult=2, eta_min=1e-6); warm_up_steps = 1000; schedu',
  //   '   from audiomentations import Compose, AddGaussianNoise, TimeStretch, PitchShift, Shift, Normalize, ClippingDistortion, FrequencyMask, TimeMask, BandPassFilter, HighPassFilter, LowPassFilter, RoomSimulator, Mp3Compression; from torch_audiomentations import Compose as TorchCompose, Gain, PolarityInversion; transform_probabili',
  //   'def collate_fn(batch): mixed_audio = torch.stack([item[0] for item in batch]); target_sources = torch.stack([item[1] for item in batch]); audio_lengths = torch.tensor([item[2] for item in batch]); metadata = [item[3] for item in batch]; batch_dict = {"mixed": mixed_audio, "targets": target_sources, "lengths": audio_lengths, "meta": meta',
  //   '  model.eval(); validation_loss = validate_model(model, val_dataloader, criterion); test_metrics = evaluate_model(model, test_dataloader); checkpoint_data = {"model_state_dict": model.state_dict(), "optimizer_state_dict": optimizer.state_dict(), "epoch": epoch, "loss": validation_loss}; torch.save(checkpoint_data, "best_audio_model.pth"); mode',
  //   'spectrogram = torchaudio.transforms.Spectrogram(n_fft=2048, hop_length=512, win_length=2048, window=torch.hann_window, normalized=True, center=True, pad_mode="reflect", power=2.0); mel_spectrogram = torchaudio.transforms.MelSpectrogram(sample_rate=44100, n_fft=2048, hop_length=512, n_mels=128, fmin=0, fmax=8000, power=2.0); spectrogr',
  //   '    mel_transform = torchaudio.transforms.MelSpectrogram(sample_rate=44100, n_fft=2048, hop_length=512, win_length=2048, f_min=0, f_max=8000, n_mels=128, window_fn=torch.hann_window, power=2.0, normalized=True, center=True, pad_mode="reflect", norm="slaney", mel_scale="htk", onesided=True); mel_inverse = torchaudio.transforms.InverseMelSca',
  //   'def preprocess_audio(waveform, sample_rate=44100, target_sr=22050, n_fft=1024, hop_length=256, win_length=1024, normalize=True, remove_dc=True): if sample_rate != target_sr: resampler = torchaudio.transforms.Resample(sample_rate, target_sr); waveform = resampler(waveform); if remove_dc: waveform = waveform - torch.mean(waveform); return tor',
  //   '  class BilinearUpsample(nn.Module): def __init__(self, scale_factor=2, mode="bilinear", align_corners=False): super().__init__(); self.scale_factor = scale_factor; self.mode = mode; self.align_corners = align_corners; def forward(self, x): upsampled = F.interpolate(x, scale_factor=self.scale_factor, mode=self.mode, align_corners=self.al',
  //   'loss_fn = torch.nn.MSELoss(reduction="mean"); l1_loss = torch.nn.L1Loss(reduction="mean"); si_sdr_loss = asteroid.losses.SingleSrcNegSDR(); pit_loss = asteroid.losses.PITLossWrapper(si_sdr_loss, pit_from="pw_mtx"); spectral_loss = SpectralConvergenceLoss(); perceptual_loss = PerceptualLoss(); combined_loss = MultiTaskLoss(); loss_',
  //   '    from neptune.new import Run; import wandb; from tensorboardX import SummaryWriter; run = Run(project="audio-ml/source-separation", api_token="your_token", tags=["unet", "separation", "pytorch"]); wandb.init(project="audio-separation", entity="ml-team", config={"lr": 1e-3, "batch_size": 32}); tb_writer = SummaryWriter("runs/audio_experim',
  //   'run.log({"train_loss": loss.item(), "val_si_sdr": val_si_sdr.item(), "learning_rate": scheduler.get_last_lr()[0], "epoch": epoch, "batch_idx": batch_idx, "grad_norm": grad_norm, "memory_usage": torch.cuda.memory_allocated(), "model_params": sum(p.numel() for p in model.parameters()), "dataset_size": len(dataset)}); wandb.log(metrics); ru',
  //   '  def separate_sources(mixture_audio, model, device="cuda", chunk_size=44100*4, overlap=0.25, apply_postprocessing=True, normalize_output=True): model.eval(); model.to(device); separated_sources = []; with torch.no_grad(): if mixture_audio.dim() == 1: mixture_audio = mixture_audio.unsqueeze(0); chunk_overlap = int(chunk_size * overlap); r',
  //   'from torch.nn.utils.rnn import pad_sequence, pack_padded_sequence, pack_sequence; from torch.nn.utils.clip_grad import clip_grad_norm_, clip_grad_value_; batch_sequences = [torch.randn(seq_len, feature_dim) for seq_len in [10, 15, 20, 8]]; lengths = torch.tensor([seq.size(0) for seq in batch_sequences]); padded_batch = pad_sequence(batch_seq',
  //   '    audio_data, sample_rate = torchaudio.load("mixture.wav", normalize=True); if audio_data.shape[0] > 1: audio_data = torch.mean(audio_data, dim=0, keepdim=True); if sample_rate != 44100: resampler = torchaudio.transforms.Resample(sample_rate, 44100); audio_data = resampler(audio_data); audio_tensor = audio_data.unsqueeze(0); audio_',
  //   'separated_sources = model(audio_tensor); vocals = separated_sources[:, 0, :]; drums = separated_sources[:, 1, :]; bass = separated_sources[:, 2, :]; other = separated_sources[:, 3, :]; for i, (source, name) in enumerate(zip([vocals, drums, bass, other], ["vocals", "drums", "bass", "other"])): torchaudio.save(f"{name}.wav", source.cpu(), 44',
  //   'class TransformerAudioModel(nn.Module): def __init__(self, d_model=512, nhead=8, num_layers=6, dim_feedforward=2048, dropout=0.1, activation="relu", max_seq_length=5000): super().__init__(); self.d_model = d_model; self.positional_encoding = PositionalEncoding(d_model, dropout, max_seq_length); self.input_projection = nn.Linear(1, d_mod',
  //   ' self.encoder_layers = nn.TransformerEncoderLayer(d_model, nhead, dim_feedforward, dropout, activation, batch_first=True); self.transformer_encoder = nn.TransformerEncoder(self.encoder_layers, num_layers); self.decoder_layers = nn.TransformerDecoderLayer(d_model, nhead, dim_feedforward, dropout, activation, batch_first=True); self.transfo',
  //   '  def create_padding_mask(self, seq, pad_idx=0): return (seq == pad_idx); def create_look_ahead_mask(self, size): mask = torch.triu(torch.ones(size, size), diagonal=1); return mask.bool(); def forward(self, src, tgt=None, src_mask=None, tgt_mask=None, memory_mask=None): src_embedded = self.input_projection(src.unsqueeze(-1)) + self.positio',
  //   'def compute_stft(waveform, n_fft=2048, hop_length=512, win_length=None, window="hann", center=True, pad_mode="reflect", normalized=False, onesided=True, return_complex=True): if win_length is None: win_length = n_fft; window_tensor = torch.hann_window(win_length); stft_result = torch.stft(waveform, n_fft=n_fft, hop_length=hop_length, win_le',
  //   ' stft_result = torch.stft(waveform, n_fft=n_fft, hop_length=hop_length, win_length=win_length, window=window_tensor, center=center, pad_mode=pad_mode, normalized=normalized, onesided=onesided, return_complex=return_complex); magnitude = torch.abs(stft_result); phase = torch.angle(stft_result); power_spectrum = magnitude ** 2; spectral_ce',
  //   'class MultiScaleSTFTLoss(nn.Module): def __init__(self, fft_sizes=[1024, 2048, 512], hop_sizes=[120, 240, 50], win_lengths=[600, 1200, 240], window="hann_window", factor_sc=0.1, factor_mag=0.1): super().__init__(); self.fft_sizes = fft_sizes; self.hop_sizes = hop_sizes; self.win_lengths = win_lengths; self.factor_sc = factor_sc; cla',
  //   ' self.win_lengths = win_lengths; self.factor_sc = factor_sc; self.factor_mag = factor_mag; self.spectrograms = nn.ModuleList([torchaudio.transforms.Spectrogram(n_fft=fft_size, hop_length=hop_size, win_length=win_length, window_fn=getattr(torch, window), power=None) for fft_size, hop_size, win_length in zip(fft_sizes, hop_sizes, win_leng',
  //   '  def forward(self, predicted, target): total_loss = 0; for spectrogram in self.spectrograms: pred_spec = spectrogram(predicted); target_spec = spectrogram(target); pred_mag = torch.abs(pred_spec); target_mag = torch.abs(target_spec); sc_loss = F.l1_loss(pred_mag, target_mag); mag_loss = F.l1_loss(pred_mag, target_mag); total_loss += sc_',
  //   'def load_audio_file(file_path, sample_rate=None, offset=0.0, duration=None, normalize=True, channels_first=True): audio_data, original_sr = torchaudio.load(file_path, frame_offset=int(offset * original_sr) if offset > 0 else 0, num_frames=int(duration * original_sr) if duration else -1); if sample_rate and original_sr != sample_rate: resa',
  //   ' if sample_rate and original_sr != sample_rate: resampler = torchaudio.transforms.Resample(original_sr, sample_rate); audio_data = resampler(audio_data); if normalize: max_val = torch.max(torch.abs(audio_data)); if max_val > 0: audio_data = audio_data / max_val; if not channels_first and audio_data.dim() > 1: audio_data = audio_data.tra',
  //   'class ConvBlock(nn.Module): def __init__(self, in_channels, out_channels, kernel_size=3, stride=1, padding=1, dilation=1, groups=1, bias=True, use_batchnorm=True, activation="leaky_relu", dropout=0.0): super().__init__(); self.conv = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, dilation, groups, bias); self.use_batch',
  //   ' self.batchnorm = nn.BatchNorm2d(out_channels) if use_batchnorm else nn.Identity(); self.activation = self._get_activation(activation); self.dropout = nn.Dropout2d(dropout) if dropout > 0 else nn.Identity(); def _get_activation(self, activation): activations = {"relu": nn.ReLU(), "leaky_relu": nn.LeakyReLU(0.2), "elu": nn.ELU(), "swa',
  //   '  def forward(self, x): x = self.conv(x); x = self.batchnorm(x); x = self.activation(x); x = self.dropout(x); return x; def get_conv_output_size(input_size, kernel_size, stride, padding, dilation=1): numerator = input_size + 2 * padding - dilation * (kernel_size - 1) - 1; return int(numerator / stride + 1); def calculate_receptive_fiel',
  //   'class ResidualBlock(nn.Module): def __init__(self, channels, kernel_size=3, stride=1, padding=1, dilation=1, use_batchnorm=True, activation="relu", dropout=0.0): super().__init__(); self.conv1 = nn.Conv2d(channels, channels, kernel_size, stride, padding, dilation, bias=not use_batchnorm); self.conv2 = nn.Conv2d(channels, channels, kern',
  //   ' self.bn1 = nn.BatchNorm2d(channels) if use_batchnorm else nn.Identity(); self.conv2 = nn.Conv2d(channels, channels, kernel_size, stride, padding, dilation, bias=not use_batchnorm); self.bn2 = nn.BatchNorm2d(channels) if use_batchnorm else nn.Identity(); self.activation = self._get_activation(activation); self.dropout = nn.Dropout2d(dr',
  //   '  def forward(self, x): residual = x; out = self.conv1(x); out = self.bn1(out); out = self.activation(out); out = self.dropout(out) if hasattr(self, "dropout") else out; out = self.conv2(out); out = self.bn2(out); out += residual; output = self.activation(out); return output; def _get_activation(self, activation): return {"relu": nn.Re',
  //   'def apply_augmentations(audio, sample_rate, augmentations_config): augmentations = []; if augmentations_config.get("add_noise", False): augmentations.append(AddGaussianNoise(min_amplitude=0.001, max_amplitude=0.01, p=0.5)); if augmentations_config.get("time_stretch", False): augmentations.append(TimeStretch(min_rate=0.8, max_rate=1.2,',
  //   ' if augmentations_config.get("time_stretch", False): augmentations.append(TimeStretch(min_rate=0.8, max_rate=1.2, p=0.3)); if augmentations_config.get("pitch_shift", False): augmentations.append(PitchShift(min_semitones=-2, max_semitones=2, p=0.4)); if augmentations_config.get("volume_change", False): augmentations.append(Gain(min_gain',
  //   ' if augmentations_config.get("volume_change", False): augmentations.append(Gain(min_gain_in_db=-12, max_gain_in_db=12, p=0.5)); if augmentations_config.get("reverb", False): augmentations.append(RoomSimulator(p=0.3)); composed_augmentations = Compose(augmentations); augmented_audio = composed_augmentations(samples=audio, sample_rate=sam',
  //   'class PositionalEncoding(nn.Module): def __init__(self, d_model, dropout=0.1, max_length=5000): super().__init__(); self.dropout = nn.Dropout(p=dropout); position = torch.arange(max_length).unsqueeze(1); div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model)); pe = torch.zeros(max_length, 1, d_model); pe[:, ',
  //   ' pe = torch.zeros(max_length, 1, d_model); pe[:, 0, 0::2] = torch.sin(position * div_term); pe[:, 0, 1::2] = torch.cos(position * div_term); self.register_buffer("pe", pe); def forward(self, x): sequence_length = x.size(0); positional_embeddings = self.pe[:sequence_length]; x = x + positional_embeddings; return self.dropout(x); def get',
  //   'def calculate_receptive_field(layers_config): receptive_field = 1; jump = 1; for layer_config in layers_config: kernel_size = layer_config.get("kernel_size", 3); stride = layer_config.get("stride", 1); dilation = layer_config.get("dilation", 1); receptive_field += (kernel_size - 1) * jump * dilation; jump *= stride; effective_kernel',
  //   ' print(f"Layer: {layer_config}, Receptive field: {receptive_field}, Jump: {jump}"); total_receptive_field = receptive_field; total_jump = jump; return total_receptive_field, total_jump; def pad_to_target_length(tensor, target_length, dim=-1, value=0): current_length = tensor.size(dim); if current_length >= target_length: return tensor; pa',
  //   ' padding_needed = target_length - current_length; padding = [0] * (tensor.dim() * 2); padding_index = -(dim + 1) * 2 - 1; padding[padding_index] = padding_needed; padded_tensor = F.pad(tensor, padding, value=value); return padded_tensor; def trim_to_target_length(tensor, target_length, dim=-1): current_length = tensor.size(dim); if curre',
  //   'class AttentionBlock(nn.Module): def __init__(self, dim, num_heads=8, qkv_bias=False, attn_drop=0.0, proj_drop=0.0): super().__init__(); self.num_heads = num_heads; head_dim = dim // num_heads; self.scale = head_dim ** -0.5; self.qkv = nn.Linear(dim, dim * 3, bias=qkv_bias); self.attn_drop = nn.Dropout(attn_drop); self.proj = nn.Linear(',
  //   ' self.attn_drop = nn.Dropout(attn_drop); self.proj = nn.Linear(dim, dim); self.proj_drop = nn.Dropout(proj_drop); def forward(self, x): B, N, C = x.shape; qkv = self.qkv(x).reshape(B, N, 3, self.num_heads, C // self.num_heads).permute(2, 0, 3, 1, 4); q, k, v = qkv.unbind(0); attn_scores = (q @ k.transpose(-2, -1)) * self.scale; sel',
  //   '  q, k, v = qkv[0], qkv[1], qkv[2]; attn = (q @ k.transpose(-2, -1)) * self.scale; attn = attn.softmax(dim=-1); attn = self.attn_drop(attn); x = (attn @ v).transpose(1, 2).reshape(B, N, C); x = self.proj(x); x = self.proj_drop(x); attention_weights = attn.detach(); return x, attention_weights; def compute_attention_entropy(attn_weigh',
  //   'def compute_phase_sensitive_mask(mixture_stft, target_stft, epsilon=1e-8): mixture_mag = torch.abs(mixture_stft); target_mag = torch.abs(target_stft); mixture_phase = torch.angle(mixture_stft); target_phase = torch.angle(target_stft); phase_difference = target_phase - mixture_phase; cos_phase_diff = torch.cos(phase_difference); phase_sens',
  //   ' phase_difference = target_phase - mixture_phase; cos_phase_diff = torch.cos(phase_difference); mask = (target_mag / (mixture_mag + epsilon)) * cos_phase_diff; mask = torch.clamp(mask, 0, 2); ideal_ratio_mask = target_mag / (mixture_mag + epsilon); combined_mask = 0.7 * mask + 0.3 * ideal_ratio_mask; return torch.clamp(combined_mask',
  //   'class SpectralNormalization(nn.Module): def __init__(self, module, name="weight", n_power_iterations=1, dim=0, eps=1e-12): super().__init__(); self.module = module; self.name = name; self.n_power_iterations = n_power_iterations; self.dim = dim; self.eps = eps; if not self._made_params(): self._make_params(); def _l2normalize(self, v, e',
  //   ' if not self._made_params(): self._make_params(); def _l2normalize(self, v, eps=1e-12): return v / (v.norm(dim=self.dim, keepdim=True) + eps); def _make_params(self): w = getattr(self.module, self.name); height = w.data.shape[self.dim]; width = w.view(height, -1).data.shape[1]; u = nn.Parameter(w.data.new(height).normal_(0, 1), requi',
  //   '  width = w.view(height, -1).data.shape[1]; u = nn.Parameter(w.data.new(height).normal_(0, 1), requires_grad=False); v = nn.Parameter(w.data.new(width).normal_(0, 1), requires_grad=False); u.data = self._l2normalize(u.data); v.data = self._l2normalize(v.data); self.module.register_parameter(self.name + "_u", u); self.module.register_pa',
  //   'def save_separated_audio(separated_sources, output_dir, filename_prefix, sample_rate=44100, format="wav", bit_depth=16): os.makedirs(output_dir, exist_ok=True); source_names = ["vocals", "drums", "bass", "other"]; timestamp = datetime.now().strftime("%Y%m%d_%H%M%S"); for i, (source_audio, source_name) in enumerate(zip(separated_sources,',
  //   ' for i, (source_audio, source_name) in enumerate(zip(separated_sources, source_names)): output_filename = f"{filename_prefix}_{source_name}_{timestamp}.{format}"; output_path = os.path.join(output_dir, output_filename); source_audio_cpu = source_audio.cpu() if source_audio.is_cuda else source_audio; torchaudio.save(output_path, source_au',
  //   ' print(f"Saved {source_name} to {output_path}"); metadata = {"sample_rate": sample_rate, "format": format, "bit_depth": bit_depth, "num_sources": len(separated_sources), "timestamp": datetime.now().isoformat(), "source_names": source_names}; metadata_path = os.path.join(output_dir, f"{filename_prefix}_metadata.json"); with open(metadata_',
  //   'class GatedConvolution(nn.Module): def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0, dilation=1, groups=1, bias=True): super().__init__(); self.conv_gate = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, dilation, groups, bias); self.conv_feature = nn.Conv2d(in_channels, out_channels, ke',
  //   ' self.conv_feature = nn.Conv2d(in_channels, out_channels, kernel_size, stride, padding, dilation, groups, bias); def forward(self, x): gate = torch.sigmoid(self.conv_gate(x)); feature = self.conv_feature(x); gated_output = gate * feature; return gated_output; def get_output_shape(self, input_shape): batch_size, channels, height, width =',
  //   '  def get_output_shape(self, input_shape): batch_size, channels, height, width = input_shape; out_height = (height + 2 * self.conv_feature.padding[0] - self.conv_feature.dilation[0] * (self.conv_feature.kernel_size[0] - 1) - 1) // self.conv_feature.stride[0] + 1; out_width = (width + 2 * self.conv_feature.padding[1] - self.conv_fea',
  //   'def setup_distributed_training(rank, world_size, backend="nccl", init_method="env://"): os.environ["MASTER_ADDR"] = "localhost"; os.environ["MASTER_PORT"] = "12355"; os.environ["WORLD_SIZE"] = str(world_size); os.environ["RANK"] = str(rank); dist.init_process_group(backend, rank=rank, world_size=world_size, init_method=init_method); pri',
  //   ' torch.cuda.set_device(rank); device = torch.device(f"cuda:{rank}"); model = AudioModel().to(device); model = DDP(model, device_ids=[rank], output_device=rank, find_unused_parameters=False); print(f"Process {rank} initialized on device {device} with world_size {world_size}"); def cleanup_distributed(): dist.destroy_process_group(); dist',
  //   '  def cleanup_distributed(): dist.destroy_process_group(); def reduce_tensor(tensor, world_size): rt = tensor.clone(); dist.all_reduce(rt, op=dist.ReduceOp.SUM); rt /= world_size; return rt; def gather_tensor(tensor): gathered_tensors = [torch.zeros_like(tensor) for _ in range(dist.get_world_size())]; dist.all_gather(gathered_tensors, ten',
  //   'class WaveformEncoder(nn.Module): def __init__(self, n_filters=512, filter_length=40, hop_length=20, activation="relu"): super().__init__(); self.n_filters = n_filters; self.filter_length = filter_length; self.hop_length = hop_length; self.conv1d = nn.Conv1d(1, n_filters, filter_length, stride=hop_length, bias=False); self.activation',
  //   ' self.conv1d = nn.Conv1d(1, n_filters, filter_length, stride=hop_length, bias=False); self.activation = self._get_activation(activation); def _get_activation(self, activation): activation_dict = {"relu": nn.ReLU(), "leaky_relu": nn.LeakyReLU(), "tanh": nn.Tanh(), "gelu": nn.GELU()}; return activation_dict.get(activation, nn.ReLU()); sel',
  //   '  def forward(self, waveform): if waveform.dim() == 2 and waveform.size(1) == 1: waveform = waveform.transpose(1, 2); elif waveform.dim() == 1: waveform = waveform.unsqueeze(0).unsqueeze(0); elif waveform.dim() == 2 and waveform.size(0) == 1: waveform = waveform.unsqueeze(1); encoded = self.conv1d(waveform); activated = self.activation(',
  //   'def create_mel_filterbank(sample_rate, n_fft, n_mels=128, fmin=0, fmax=None): if fmax is None: fmax = sample_rate // 2; mel_min = librosa.hz_to_mel(fmin); mel_max = librosa.hz_to_mel(fmax); mel_points = torch.linspace(mel_min, mel_max, n_mels + 2); hz_points = librosa.mel_to_hz(mel_points.numpy()); bin_points = torch.floor((n_fft + ',
  //   ' hz_points = librosa.mel_to_hz(mel_points.numpy()); bin_points = torch.floor((n_fft + 1) * hz_points / sample_rate).long(); filterbank = torch.zeros(n_mels, n_fft // 2 + 1); for m in range(1, n_mels + 1): left, center, right = bin_points[m-1], bin_points[m], bin_points[m+1]; for k in range(left, center): filterbank[m-1, k] = (k - le',
  //   '  for k in range(left, center): filterbank[m-1, k] = (k - left) / (center - left); for k in range(center, right): filterbank[m-1, k] = (right - k) / (right - center); filterbank = filterbank / torch.sum(filterbank, dim=1, keepdim=True); return filterbank; def apply_mel_filterbank(spectrogram, filterbank): mel_spec = torch.matmul(filt',
  //   'class TemporalConvolutionalNetwork(nn.Module): def __init__(self, input_size, hidden_size, output_size, num_layers, kernel_size=3, dropout=0.2): super().__init__(); layers = []; dilation_size = 1; for i in range(num_layers): in_channels = input_size if i == 0 else hidden_size; out_channels = hidden_size; layers.append(nn.Conv1d(in_ch',
  //   ' for i in range(num_layers): in_channels = input_size if i == 0 else hidden_size; out_channels = hidden_size; conv_layer = nn.Conv1d(in_channels, out_channels, kernel_size, dilation=dilation_size, padding=(kernel_size-1)*dilation_size); layers.extend([conv_layer, nn.ReLU(), nn.Dropout(dropout)]); dilation_size *= 2; self.network = nn.S',
  //   '  layers.append(nn.ReLU()); layers.append(nn.Dropout(dropout)); dilation_size *= 2; self.network = nn.Sequential(*layers); self.output_layer = nn.Conv1d(hidden_size, output_size, 1); def forward(self, x): network_output = self.network(x); final_output = self.output_layer(network_output); return final_output; def get_receptive_field(',
  //   'def apply_wiener_filter(mixture_stft, source_estimates, noise_floor=1e-10): mixture_power = torch.abs(mixture_stft) ** 2; source_powers = [torch.abs(source_est) ** 2 + noise_floor for source_est in source_estimates]; total_source_power = torch.stack(source_powers).sum(dim=0); wiener_filters = [source_power / (total_source_power + nois',
  //   ' total_source_power = torch.stack(source_powers).sum(dim=0); wiener_filters = [source_power / (total_source_power + noise_floor) for source_power in source_powers]; filtered_sources = [wiener_filter * mixture_stft for wiener_filter in wiener_filters]; enhanced_sources = [torch.istft(filtered_source, n_fft=2048, hop_length=512) for filt',
  //   '  return filtered_sources; def compute_ideal_ratio_mask(target_stft, mixture_stft, epsilon=1e-8): target_magnitude = torch.abs(target_stft); mixture_magnitude = torch.abs(mixture_stft); mask = target_magnitude / (mixture_magnitude + epsilon); binary_mask = (mask > 0.5).float(); soft_mask = torch.sigmoid(10 * (mask - 0.5)); return mask',
  //   'class MultiHeadSelfAttention(nn.Module): def __init__(self, embed_dim, num_heads, dropout=0.0, bias=True): super().__init__(); assert embed_dim % num_heads == 0; self.embed_dim = embed_dim; self.num_heads = num_heads; self.head_dim = embed_dim // num_heads; self.q_proj = nn.Linear(embed_dim, embed_dim, bias=bias); self.k_proj = nn.Lin',
  //   ' self.q_proj = nn.Linear(embed_dim, embed_dim, bias=bias); self.k_proj = nn.Linear(embed_dim, embed_dim, bias=bias); self.v_proj = nn.Linear(embed_dim, embed_dim, bias=bias); self.out_proj = nn.Linear(embed_dim, embed_dim, bias=bias); self.dropout = nn.Dropout(dropout); self.scale = math.sqrt(self.head_dim); def forward(self, x, attn_',
  //   '  def forward(self, x, attn_mask=None, key_padding_mask=None): batch_size, seq_len, embed_dim = x.size(); q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2); k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2); v = self.v_proj(x).view(batch_size, seq_l',
  //   ' k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2); v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2); attn_weights = torch.matmul(q, k.transpose(-2, -1)) / self.scale; if attn_mask is not None: attn_weights += attn_mask; if key_padding_mask is not N',
  //   '  attn_weights = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim); if attn_mask is not None: attn_weights += attn_mask; if key_padding_mask is not None: attn_weights = attn_weights.masked_fill(key_padding_mask.unsqueeze(1).unsqueeze(2), float("-inf")); attn_probs = F.softmax(attn_weights, dim=-1); attn_probs = self.drop',
  //   'def load_pretrained_model(model_path, model_class, device="cpu", strict=True): checkpoint = torch.load(model_path, map_location=device); model_config = checkpoint.get("model_config", {}); model = model_class(**model_config); if "state_dict" in checkpoint: model.load_state_dict(checkpoint["state_dict"], strict=strict); elif "model_state',
  //   ' if "state_dict" in checkpoint: model.load_state_dict(checkpoint["state_dict"], strict=strict); elif "model_state_dict" in checkpoint: model.load_state_dict(checkpoint["model_state_dict"], strict=strict); else: model.load_state_dict(checkpoint, strict=strict); model.to(device); model.eval(); training_info = checkpoint.get("trainin',
  //   '  else: model.load_state_dict(checkpoint, strict=strict); model.to(device); model.eval(); training_info = checkpoint.get("training_info", {}); print(f"Loaded pretrained model from {model_path}"); print(f"Model trained for {training_info.get(\'epochs\', \'unknown\')} epochs"); return model, training_info; def save_model_checkpoint(model',
  //   'class FrequencyDomainLoss(nn.Module): def __init__(self, n_fft=2048, hop_length=512, win_length=None, window="hann", center=True, normalized=True, onesided=True): super().__init__(); self.n_fft = n_fft; self.hop_length = hop_length; self.win_length = win_length or n_fft; self.window = window; self.center = center; self.normalized = n',
  //   ' self.win_length = win_length or n_fft; self.window = window; self.center = center; self.normalized = normalized; self.onesided = onesided; self.stft_params = {"n_fft": n_fft, "hop_length": hop_length, "win_length": self.win_length, "window": torch.hann_window(self.win_length), "center": center, "normalized": normalized, "onesided": o',
  //   '  target_stft = torch.stft(target, **self.stft_params); pred_magnitude = torch.abs(pred_stft); target_magnitude = torch.abs(target_stft); magnitude_loss = F.l1_loss(pred_magnitude, target_magnitude); pred_phase = torch.angle(pred_stft); target_phase = torch.angle(target_stft); phase_loss = F.l1_loss(pred_phase, target_phase); return ma',
  //   'def batch_inference(model, audio_batch, chunk_size=44100*4, overlap_samples=4410, device="cuda"): model.eval(); model.to(device); batch_size, audio_length = audio_batch.shape; separated_batch = []; for i in range(batch_size): audio = audio_batch[i]; separated_sources = []; num_chunks = (audio_length - overlap_samples) // (chunk_size - ',
  //   ' for i in range(batch_size): audio = audio_batch[i]; separated_sources = []; num_chunks = (audio_length - overlap_samples) // (chunk_size - overlap_samples) + 1; chunk_outputs = []; for chunk_idx in range(num_chunks): start_idx = chunk_idx * (chunk_size - overlap_samples); end_idx = min(start_idx + chunk_size, audio_length); chunk =',
  //   '  for chunk_idx in range(num_chunks): start_idx = chunk_idx * (chunk_size - overlap_samples); end_idx = min(start_idx + chunk_size, audio_length); chunk = audio[start_idx:end_idx]; if chunk.size(0) < chunk_size: padding = chunk_size - chunk.size(0); chunk = F.pad(chunk, (0, padding)); with torch.no_grad(): chunk_output = model(chu',
  //   'class ConvolutionalLSTM(nn.Module): def __init__(self, input_channels, hidden_channels, kernel_size, num_layers=1, bias=True, dropout=0.0): super().__init__(); self.input_channels = input_channels; self.hidden_channels = hidden_channels; self.kernel_size = kernel_size; self.num_layers = num_layers; self.bias = bias; self.dropout = nn',
  //   ' self.kernel_size = kernel_size; self.num_layers = num_layers; self.bias = bias; self.dropout = nn.Dropout(dropout) if dropout > 0 else None; self.conv_layers = nn.ModuleList(); for i in range(num_layers): input_ch = input_channels if i == 0 else hidden_channels; conv_layer = nn.Conv2d(input_ch + hidden_channels, 4 * hidden_channels',
  //   '  for i in range(num_layers): input_ch = input_channels if i == 0 else hidden_channels; self.conv_layers.append(nn.Conv2d(input_ch + hidden_channels, 4 * hidden_channels, kernel_size, padding=kernel_size//2, bias=bias)); def forward(self, x, hidden_states=None): batch_size, channels, height, width = x.size(); if hidden_states is None',
  //   'def dynamic_range_compression(audio, threshold=-20, ratio=4, attack_time=0.003, release_time=0.1, sample_rate=44100): threshold_linear = 10 ** (threshold / 20); attack_samples = int(attack_time * sample_rate); release_samples = int(release_time * sample_rate); envelope = torch.zeros_like(audio); gain_reduction = torch.ones_like(audi',
  //   ' release_samples = int(release_time * sample_rate); envelope = torch.zeros_like(audio); gain_reduction = torch.ones_like(audio); for i in range(1, audio.size(-1)): current_level = torch.abs(audio[..., i]); if current_level > envelope[..., i-1]: envelope[..., i] = current_level; else: envelope[..., i] = envelope[..., i-1] * (1 - 1/',
  //   '  envelope[..., i] = torch.maximum(current_level, envelope[..., i-1] * (1 - 1/attack_samples) + current_level / attack_samples); if envelope[..., i] > threshold_linear: excess = envelope[..., i] - threshold_linear; gain_reduction[..., i] = threshold_linear + excess / ratio; compressed_audio = audio * gain_reduction; return compressed_au',
  //   'class FeatureFusionModule(nn.Module): def __init__(self, in_channels1, in_channels2, out_channels, reduction=16): super().__init__(); self.conv1 = nn.Conv2d(in_channels1, out_channels, 1); self.conv2 = nn.Conv2d(in_channels2, out_channels, 1); self.global_avg_pool = nn.AdaptiveAvgPool2d(1); self.fc1 = nn.Linear(out_channels, out_cha',
  //   ' self.global_avg_pool = nn.AdaptiveAvgPool2d(1); self.fc1 = nn.Linear(out_channels, out_channels // reduction); self.fc2 = nn.Linear(out_channels // reduction, out_channels); self.sigmoid = nn.Sigmoid(); self.relu = nn.ReLU(); def forward(self, x1, x2): feat1 = self.conv1(x1); feat2 = self.conv2(x2); fused = feat1 + feat2; atten',
  //   '  def forward(self, x1, x2): feat1 = self.conv1(x1); feat2 = self.conv2(x2); fused = feat1 + feat2; attention = self.global_avg_pool(fused).squeeze(-1).squeeze(-1); attention = self.fc1(attention); attention = self.relu(attention); attention = self.fc2(attention); attention = self.sigmoid(attention).unsqueeze(-1).unsqueeze(-1); weigh',
  //   'def compute_source_activity_detection(audio, threshold=0.01, frame_length=2048, hop_length=512): energy = torch.sum(audio ** 2, dim=-1); frame_energy = F.avg_pool1d(energy.unsqueeze(1), kernel_size=frame_length, stride=hop_length).squeeze(1); activity_mask = frame_energy > threshold; kernel = torch.ones(1, 1, 5) / 5; smoothed_mask =',
  //   ' activity_mask = frame_energy > threshold; smoothed_mask = F.conv1d(activity_mask.float().unsqueeze(1), torch.ones(1, 1, 5) / 5, padding=2).squeeze(1) > 0.5; voice_activity_regions = []; in_speech = False; start_frame = 0; for i, active in enumerate(smoothed_mask): if active and not in_speech: start_frame = i; in_speech = True; elif ',
  //   '  voice_activity_regions = []; in_speech = False; start_frame = 0; for i, active in enumerate(smoothed_mask): if active and not in_speech: start_frame = i; in_speech = True; elif not active and in_speech: voice_activity_regions.append((start_frame, i)); in_speech = False; if in_speech: voice_activity_regions.append((start_frame, len(',
  //   'class DilatedResidualBlock(nn.Module): def __init__(self, channels, dilation, kernel_size=3, dropout=0.1): super().__init__(); self.conv1 = nn.Conv1d(channels, channels, kernel_size, dilation=dilation, padding=dilation*(kernel_size-1)//2); self.conv2 = nn.Conv1d(channels, channels, kernel_size, dilation=dilation, padding=dilation*(',
  //   ' self.conv2 = nn.Conv1d(channels, channels, kernel_size, dilation=dilation, padding=dilation*(kernel_size-1)//2); self.dropout = nn.Dropout(dropout); self.norm1 = nn.LayerNorm(channels); self.norm2 = nn.LayerNorm(channels); def forward(self, x): residual = x; x = self.norm1(x.transpose(1, 2)).transpose(1, 2); x = F.relu(self.conv1(',
  //   '  def forward(self, x): residual = x; x = self.norm1(x.transpose(1, 2)).transpose(1, 2); x = F.relu(self.conv1(x)); x = self.dropout(x); x = self.norm2(x.transpose(1, 2)).transpose(1, 2); x = self.conv2(x); dilated_output = F.relu(x + residual); return dilated_output; def compute_output_length(self, input_length): return input_length',
  //   'def cross_fade_sources(source1, source2, fade_length=1024, fade_type="linear"): if fade_type == "linear": fade_in = torch.linspace(0, 1, fade_length); fade_out = torch.linspace(1, 0, fade_length); elif fade_type == "cosine": fade_in = 0.5 * (1 - torch.cos(torch.linspace(0, math.pi, fade_length))); fade_out = 0.5 * (1 + torch.co',
  //   ' elif fade_type == "cosine": fade_in = 0.5 * (1 - torch.cos(torch.linspace(0, math.pi, fade_length))); fade_out = 0.5 * (1 + torch.cos(torch.linspace(0, math.pi, fade_length))); elif fade_type == "exponential": fade_in = torch.exp(torch.linspace(-3, 0, fade_length)); fade_out = torch.exp(torch.linspace(0, -3, fade_length)); fade_',
  //   '  elif fade_type == "exponential": fade_in = torch.exp(torch.linspace(-3, 0, fade_length)); fade_out = torch.exp(torch.linspace(0, -3, fade_length)); fade_in /= fade_in.max(); fade_out /= fade_out.max(); source1_faded = source1 * fade_out.unsqueeze(0); source2_faded = source2 * fade_in.unsqueeze(0); crossfaded = source1_faded + sou',
  //   'class ContextualBlock(nn.Module): def __init__(self, in_channels, out_channels, context_size=5): super().__init__(); self.context_size = context_size; self.conv_layers = nn.ModuleList(); for i in range(context_size): dilation = 2 ** i; conv_layer = nn.Conv2d(in_channels if i == 0 else out_channels, out_channels, 3, dilation=dilation',
  //   ' for i in range(context_size): dilation = 2 ** i; self.conv_layers.append(nn.Conv2d(in_channels if i == 0 else out_channels, out_channels, 3, dilation=dilation, padding=dilation)); self.final_conv = nn.Conv2d(out_channels * context_size, out_channels, 1); self.activation = nn.ReLU(); def forward(self, x): context_features = []; for ',
  //   '  self.final_conv = nn.Conv2d(out_channels * context_size, out_channels, 1); self.activation = nn.ReLU(); def forward(self, x): context_features = []; for conv_layer in self.conv_layers: x = self.activation(conv_layer(x)); context_features.append(x); concatenated = torch.cat(context_features, dim=1); output = self.final_conv(concatenat',
  //   'def estimate_fundamental_frequency(audio, sample_rate=44100, frame_length=2048, hop_length=512, fmin=80, fmax=400, threshold=0.1): windowed_audio = F.conv1d(audio.unsqueeze(1), torch.hann_window(frame_length).unsqueeze(0).unsqueeze(0), stride=hop_length, padding=frame_length//2); autocorr = F.conv1d(windowed_audio, windowed_audio.',
  //   ' autocorr = F.conv1d(windowed_audio, windowed_audio.flip(-1), padding=windowed_audio.size(-1)-1); lag_min = int(sample_rate / fmax); lag_max = int(sample_rate / fmin); autocorr_region = autocorr[..., autocorr.size(-1)//2 + lag_min : autocorr.size(-1)//2 + lag_max]; peak_indices = torch.argmax(autocorr_region, dim=-1); lag_indices =',
  //   '  autocorr_region = autocorr[..., autocorr.size(-1)//2 + lag_min : autocorr.size(-1)//2 + lag_max]; peak_indices = torch.argmax(autocorr_region, dim=-1); f0_estimates = sample_rate / (peak_indices + lag_min); confidence = torch.max(autocorr_region, dim=-1)[0] / (torch.sum(autocorr_region, dim=-1) + 1e-8); reliable_f0 = f0_estimates',
  //   'class ScaleInvariantSignalDistortionRatio(nn.Module): def __init__(self, zero_mean=True, take_log=True, EPS=1e-8): super().__init__(); self.zero_mean = zero_mean; self.take_log = take_log; self.EPS = EPS; def forward(self, predictions, targets): if self.zero_mean: predictions_mean = torch.mean(predictions, dim=-1, keepdim=True); predic',
  //   ' def forward(self, predictions, targets): if self.zero_mean: predictions = predictions - torch.mean(predictions, dim=-1, keepdim=True); targets = targets - torch.mean(targets, dim=-1, keepdim=True); s_target = torch.sum(targets * predictions, dim=-1, keepdim=True) * targets / (torch.sum(targets ** 2, dim=-1, keepdim=True) + self.E',
  //   '  s_target = torch.sum(targets * predictions, dim=-1, keepdim=True) * targets / (torch.sum(targets ** 2, dim=-1, keepdim=True) + self.EPS); e_noise = predictions - s_target; si_sdr = 10 * torch.log10((torch.sum(s_target ** 2, dim=-1) + self.EPS) / (torch.sum(e_noise ** 2, dim=-1) + self.EPS)); if self.take_log: return si_sdr; s_t',
  //   'def apply_spectral_subtraction(noisy_stft, noise_estimate, alpha=2.0, beta=0.01): noisy_magnitude = torch.abs(noisy_stft); noisy_phase = torch.angle(noisy_stft); noise_magnitude = torch.abs(noise_estimate); enhanced_magnitude = noisy_magnitude - alpha * noise_magnitude; enhanced_magnitude = torch.maximum(enhanced_magnitude, beta * nois',
  //   ' enhanced_magnitude = torch.maximum(enhanced_magnitude, beta * noisy_magnitude); enhanced_stft = enhanced_magnitude * torch.exp(1j * noisy_phase); return enhanced_stft; def create_overlap_add_window(window_length, hop_length, window_type="hann"): if window_type == "hann": window = torch.hann_window(window_length); elif window_type == "ha',
  //   '  return enhanced_stft; def create_overlap_add_window(window_length, hop_length, window_type="hann"): if window_type == "hann": window = torch.hann_window(window_length); elif window_type == "hamming": window = torch.hamming_window(window_length); synthesis_window = window / torch.sum(window ** 2); return synthesis_window; def normalize_st',
  //   'class ConditionalInstanceNorm(nn.Module): def __init__(self, num_features, num_conditions, eps=1e-5, momentum=0.1, affine=True): super().__init__(); self.num_features = num_features; self.num_conditions = num_conditions; self.eps = eps; self.momentum = momentum; self.affine = affine; if affine: self.weight = nn.Parameter(torch.Tenso',
  //   ' self.eps = eps; self.momentum = momentum; self.affine = affine; if affine: self.weight = nn.Parameter(torch.Tensor(num_conditions, num_features)); self.bias = nn.Parameter(torch.Tensor(num_conditions, num_features)); else: self.register_parameter("weight", None); self.register_parameter("bias", None); self.reset_parameters(); def rese',
  //   '  else: self.register_parameter("weight", None); self.register_parameter("bias", None); self.reset_parameters(); def reset_parameters(self): if self.affine: nn.init.ones_(self.weight); nn.init.zeros_(self.bias); def forward(self, x, condition_idx): mean = torch.mean(x, dim=[2, 3], keepdim=True); var = torch.var(x, dim=[2, 3], keep',
  //   'def harmonic_percussive_separation(audio_stft, kernel_size=17, power=2.0, margin=1.0, split_zeros=False): magnitude = torch.abs(audio_stft) ** power; harmonic_kernel = torch.ones(1, 1, 1, kernel_size) / kernel_size; percussive_kernel = torch.ones(1, 1, kernel_size, 1) / kernel_size; harmonic_filtered = F.conv2d(magnitude.unsqueeze(',
  //   ' harmonic_kernel = torch.ones(1, 1, 1, kernel_size) / kernel_size; percussive_kernel = torch.ones(1, 1, kernel_size, 1) / kernel_size; harmonic_filtered = F.conv2d(magnitude.unsqueeze(1), harmonic_kernel, padding=(0, kernel_size//2)); percussive_filtered = F.conv2d(magnitude.unsqueeze(1), percussive_kernel, padding=(kernel_size//2',
  //   '  harmonic_filtered = F.conv2d(magnitude.unsqueeze(1), harmonic_kernel, padding=(0, kernel_size//2)); percussive_filtered = F.conv2d(magnitude.unsqueeze(1), percussive_kernel, padding=(kernel_size//2, 0)); harmonic_mask = harmonic_filtered > (percussive_filtered + margin); percussive_mask = percussive_filtered > (harmonic_filtered + m',
  //   'class AdaptiveInstanceNormalization(nn.Module): def __init__(self, num_features, eps=1e-5): super().__init__(); self.num_features = num_features; self.eps = eps; def calc_mean_std(self, x): mean = torch.mean(x, dim=[2, 3], keepdim=True); var = torch.var(x, dim=[2, 3], keepdim=True); std = torch.sqrt(var + self.eps); return mean, std',
  //   ' def forward(self, content_features, style_features): content_size = content_features.size(); content_mean, content_std = self.calc_mean_std(content_features); style_mean, style_std = self.calc_mean_std(style_features); normalized_content = (content_features - content_mean.expand(content_size)) / content_std.expand(content_size); styliz',
  //   '  normalized_content = (content_features - content_mean.expand(content_size)) / content_std.expand(content_size); stylized_features = normalized_content * style_std.expand(content_size) + style_mean.expand(content_size); return stylized_features; def adaptive_instance_norm_loss(content_features, style_features, target_features): conten',
  //   'def compute_perceptual_evaluation_speech_quality(reference, degraded, fs=16000, mode="wb"): try: from pesq import pesq; reference_np = reference.detach().cpu().numpy() if torch.is_tensor(reference) else reference; degraded_np = degraded.detach().cpu().numpy() if torch.is_tensor(degraded) else degraded; score = pesq(fs, reference_np, de',
  //   ' except ImportError: print("PESQ library not available, using placeholder score based on SNR"); signal_power = torch.mean(reference ** 2); noise_power = torch.mean((reference - degraded) ** 2); snr = 10 * torch.log10(signal_power / (noise_power + 1e-8)); score = torch.clamp(snr / 4.0, 1.0, 4.5).item(); return torch.tensor(sco',
  //   '  def compute_short_time_objective_intelligibility(reference, degraded, fs=10000): try: from pystoi import stoi; reference_np = reference.detach().cpu().numpy() if torch.is_tensor(reference) else reference; degraded_np = degraded.detach().cpu().numpy() if torch.is_tensor(degraded) else degraded; score = stoi(reference_np, degraded_np, f',
  //   'class VariationalAutoEncoder(nn.Module): def __init__(self, input_dim, hidden_dim, latent_dim): super().__init__(); self.encoder = nn.Sequential(nn.Linear(input_dim, hidden_dim), nn.ReLU(), nn.Linear(hidden_dim, hidden_dim), nn.ReLU()); self.mu_layer = nn.Linear(hidden_dim, latent_dim); self.logvar_layer = nn.Linear(hidden_dim, latent_',
  //   ' self.mu_layer = nn.Linear(hidden_dim, latent_dim); self.logvar_layer = nn.Linear(hidden_dim, latent_dim); self.decoder = nn.Sequential(nn.Linear(latent_dim, hidden_dim), nn.ReLU(), nn.Linear(hidden_dim, hidden_dim), nn.ReLU(), nn.Linear(hidden_dim, input_dim)); def encode(self, x): h = self.encoder(x); return self.mu_layer(h), self.lo',
  //   '  def encode(self, x): h = self.encoder(x); return self.mu_layer(h), self.logvar_layer(h); def reparameterize(self, mu, logvar): std = torch.exp(0.5 * logvar); eps = torch.randn_like(std); return mu + eps * std; def decode(self, z): return self.decoder(z); def forward(self, x): mu, logvar = self.encode(x); z = self.reparameterize(',
  //   'def create_psychoacoustic_model(sample_rate=44100, n_fft=2048): bark_scale = librosa.hz_to_mel(np.linspace(0, sample_rate//2, n_fft//2 + 1)); masking_thresholds = torch.zeros(n_fft // 2 + 1); for i in range(len(bark_scale) - 1): freq_range = (bark_scale[i], bark_scale[i+1]); threshold = compute_masking_threshold(freq_range); mask',
  //   ' masking_thresholds = torch.zeros(n_fft // 2 + 1); for i in range(len(bark_scale) - 1): freq_range = (bark_scale[i], bark_scale[i+1]); masking_thresholds[i] = compute_masking_threshold(freq_range); return masking_thresholds; def apply_psychoacoustic_masking(audio_stft, masking_model): magnitude = torch.abs(audio_stft); masked_magnitu',
  //   '  return masking_thresholds; def apply_psychoacoustic_masking(audio_stft, masking_model): magnitude = torch.abs(audio_stft); masked_magnitude = torch.maximum(magnitude, masking_model.unsqueeze(0).unsqueeze(0)); phase = torch.angle(audio_stft); masked_stft = masked_magnitude * torch.exp(1j * phase); return masked_stft; def compute_maskin',
  //   'class TemporalFeatureExtractor(nn.Module): def __init__(self, input_size, hidden_size, num_layers=2, bidirectional=True): super().__init__(); self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, bidirectional=bidirectional); output_size = hidden_size * (2 if bidirectional else 1); self.attention = nn.MultiheadA',
  //   ' self.attention = nn.MultiheadAttention(hidden_size * (2 if bidirectional else 1), num_heads=8, batch_first=True); self.layer_norm = nn.LayerNorm(hidden_size * (2 if bidirectional else 1)); self.dropout = nn.Dropout(0.1); def forward(self, x): lstm_out, (h_n, c_n) = self.lstm(x); attended_out, attention_weights = self.attention(lstm',
  //   '  def forward(self, x): lstm_out, (h_n, c_n) = self.lstm(x); attended_out, attention_weights = self.attention(lstm_out, lstm_out, lstm_out); attended_out = self.dropout(attended_out); output = self.layer_norm(attended_out + lstm_out); return output, attention_weights; def get_temporal_features(self, x): features, attn_weights = self.forwa',
  //   'def bandpass_filter_bank(audio, sample_rate, num_bands=32, low_freq=80, high_freq=8000): mel_points = torch.linspace(librosa.hz_to_mel(low_freq), librosa.hz_to_mel(high_freq), num_bands + 2); hz_points = librosa.mel_to_hz(mel_points.numpy()); filtered_bands = []; for i in range(num_bands): low_cutoff = hz_points[i]; high_cutoff = hz_',
  //   ' hz_points = librosa.mel_to_hz(mel_points.numpy()); filtered_bands = []; for i in range(num_bands): low_cutoff = hz_points[i]; high_cutoff = hz_points[i + 2]; sos = signal.butter(4, [low_cutoff, high_cutoff], btype="band", fs=sample_rate, output="sos"); filtered_band = signal.sosfilt(sos, audio.numpy()); filtered_bands.append(torch',
  //   '  sos = signal.butter(4, [low_cutoff, high_cutoff], btype="band", fs=sample_rate, output="sos"); filtered_band = signal.sosfilt(sos, audio.numpy()); filtered_bands.append(torch.from_numpy(filtered_band)); filtered_tensor = torch.stack(filtered_bands); subband_energies = torch.sum(filtered_tensor ** 2, dim=-1); return filtered_tensor',
  //   'class CrossAttentionFusion(nn.Module): def __init__(self, d_model, nhead=8, dropout=0.1): super().__init__(); self.cross_attention = nn.MultiheadAttention(d_model, nhead, dropout=dropout, batch_first=True); self.layer_norm1 = nn.LayerNorm(d_model); self.layer_norm2 = nn.LayerNorm(d_model); self.feedforward = nn.Sequential(nn.Linear(',
  //   ' self.layer_norm1 = nn.LayerNorm(d_model); self.layer_norm2 = nn.LayerNorm(d_model); self.feedforward = nn.Sequential(nn.Linear(d_model, d_model * 4), nn.ReLU(), nn.Dropout(dropout), nn.Linear(d_model * 4, d_model)); def forward(self, query, key, value): attended_output, attention_weights = self.cross_attention(query, key, value); out',
  //   '  def forward(self, query, key, value): attended_output, attention_weights = self.cross_attention(query, key, value); output1 = self.layer_norm1(query + attended_output); ff_output = self.feedforward(output1); output2 = self.layer_norm2(output1 + ff_output); return output2, attention_weights; def compute_cross_attention_similarity(que',
  //   'def compute_envelope_following(audio, attack_time=0.003, release_time=0.1, sample_rate=44100): attack_coeff = torch.exp(torch.tensor(-1.0 / (attack_time * sample_rate))); release_coeff = torch.exp(torch.tensor(-1.0 / (release_time * sample_rate))); envelope = torch.zeros_like(audio); envelope[..., 0] = torch.abs(audio[..., 0]); for',
  //   ' release_coeff = torch.exp(torch.tensor(-1.0 / (release_time * sample_rate))); envelope = torch.zeros_like(audio); envelope[..., 0] = torch.abs(audio[..., 0]); for i in range(1, audio.size(-1)): current_level = torch.abs(audio[..., i]); if current_level > envelope[..., i-1]: envelope[..., i] = attack_coeff * envelope[..., i-1] + (',
  //   '  for i in range(1, audio.size(-1)): current_level = torch.abs(audio[..., i]); if current_level > envelope[..., i-1]: envelope[..., i] = attack_coeff * envelope[..., i-1] + (1 - attack_coeff) * current_level; else: envelope[..., i] = release_coeff * envelope[..., i-1] + (1 - release_coeff) * current_level; return envelope; def smo',
  //   'class SpectralFeatureExtractor(nn.Module): def __init__(self, n_fft=2048, hop_length=512, n_mels=128, fmin=0, fmax=8000, sample_rate=44100): super().__init__(); self.mel_transform = torchaudio.transforms.MelSpectrogram(sample_rate, n_fft, hop_length=hop_length, n_mels=n_mels, fmin=fmin, fmax=fmax); self.mfcc_transform = torchaudio.',
  //   ' self.mfcc_transform = torchaudio.transforms.MFCC(sample_rate, n_mfcc=13, melkwargs={"n_fft": n_fft, "hop_length": hop_length, "n_mels": n_mels, "fmin": fmin, "fmax": fmax}); def forward(self, audio): mel_spectrogram = self.mel_transform(audio); mfcc_features = self.mfcc_transform(audio); spectral_centroid = torchaudio.functional.sp',
  //   '  def forward(self, audio): mel_spectrogram = self.mel_transform(audio); mfcc_features = self.mfcc_transform(audio); spectral_centroid = torchaudio.functional.spectral_centroid(audio, sample_rate=self.mel_transform.sample_rate); spectral_features = {"mel": mel_spectrogram, "mfcc": mfcc_features, "centroid": spectral_centroid}; return sp',
  //   'def real_time_audio_processing(audio_stream, model, chunk_size=1024, overlap=512, device="cuda"): model.eval(); model.to(device); buffer = torch.zeros(overlap); processed_chunks = []; for chunk in audio_stream: combined_audio = torch.cat([buffer, chunk]); if combined_audio.size(0) >= chunk_size: processing_chunk = combined_audio[:chun',
  //   ' for chunk in audio_stream: combined_audio = torch.cat([buffer, chunk]); if combined_audio.size(0) >= chunk_size: processing_chunk = combined_audio[:chunk_size]; with torch.no_grad(): processed_chunk = model(processing_chunk.unsqueeze(0).to(device)).squeeze(0).cpu(); processed_chunks.append(processed_chunk[overlap:]); buffer = combin',
  //   '  with torch.no_grad(): processed_chunk = model(processing_chunk.unsqueeze(0).to(device)).squeeze(0).cpu(); processed_chunks.append(processed_chunk[overlap:]); buffer = combined_audio[chunk_size-overlap:chunk_size]; else: buffer = combined_audio; final_audio = torch.cat(processed_chunks) if processed_chunks else torch.empty(0); return fi',
  //   'class TimeDomainAudioNet(nn.Module): def __init__(self, in_channels=1, out_channels=4, hidden_channels=64, num_blocks=8, kernel_size=3, dilation_growth=2): super().__init__(); self.input_conv = nn.Conv1d(in_channels, hidden_channels, 1); self.encoder_blocks = nn.ModuleList(); self.decoder_blocks = nn.ModuleList(); dilation = 1; for',
  //   ' self.encoder_blocks = nn.ModuleList(); self.decoder_blocks = nn.ModuleList(); dilation = 1; for i in range(num_blocks): self.encoder_blocks.append(DilatedResidualBlock(hidden_channels, dilation, kernel_size)); dilation *= dilation_growth; for i in range(num_blocks): self.decoder_blocks.append(DilatedResidualBlock(hidden_channels, d',
  //   '  dilation *= dilation_growth; for i in range(num_blocks): self.decoder_blocks.append(DilatedResidualBlock(hidden_channels, dilation, kernel_size)); dilation //= dilation_growth; self.output_conv = nn.Conv1d(hidden_channels, out_channels, 1); def forward(self, x): x = self.input_conv(x); encoder_outputs = []; for block in self.enc',
  //   'def adaptive_noise_reduction(noisy_audio, noise_profile, reduction_factor=0.8, freq_smoothing=3, time_smoothing=5): noisy_stft = torch.stft(noisy_audio, n_fft=2048, hop_length=512, return_complex=True); noisy_magnitude = torch.abs(noisy_stft); noisy_phase = torch.angle(noisy_stft); noise_magnitude = torch.abs(noise_profile); smoothing',
  //   ' noisy_magnitude = torch.abs(noisy_stft); noisy_phase = torch.angle(noisy_stft); noise_magnitude = torch.abs(noise_profile); smoothing_kernel = torch.ones(1, 1, time_smoothing, freq_smoothing) / (time_smoothing * freq_smoothing); estimated_noise = F.conv2d(noise_magnitude.unsqueeze(0).unsqueeze(0), smoothing_kernel, padding=(time_smoo',
  //   '  gain_function = torch.clamp(1 - reduction_factor * (estimated_noise.squeeze() / (noisy_magnitude + 1e-8)), min=0.1, max=1.0); enhanced_magnitude = noisy_magnitude * gain_function; enhanced_stft = enhanced_magnitude * torch.exp(1j * noisy_phase); enhanced_audio = torch.istft(enhanced_stft, n_fft=2048, hop_length=512); return enhance',
  //   'class MultiScaleFeaturePyramid(nn.Module): def __init__(self, in_channels, pyramid_channels=[64, 128, 256, 512], scale_factors=[1, 2, 4, 8]): super().__init__(); self.scale_factors = scale_factors; self.pyramid_convs = nn.ModuleList(); for channels in pyramid_channels: conv_block = nn.Sequential(nn.Conv2d(in_channels, channels, 3, pad',
  //   ' for channels in pyramid_channels: self.pyramid_convs.append(nn.Sequential(nn.Conv2d(in_channels, channels, 3, padding=1), nn.ReLU(), nn.Conv2d(channels, channels, 3, padding=1), nn.ReLU())); self.fusion_conv = nn.Conv2d(sum(pyramid_channels), in_channels, 1); def forward(self, x): pyramid_features = []; for i, (conv, scale_factor) i',
  //   '  self.fusion_conv = nn.Conv2d(sum(pyramid_channels), in_channels, 1); def forward(self, x): pyramid_features = []; for i, (conv, scale_factor) in enumerate(zip(self.pyramid_convs, self.scale_factors)): if scale_factor > 1: scaled_x = F.interpolate(x, scale_factor=1/scale_factor, mode="bilinear", align_corners=False); else: scaled_x =',
  //   'def pitch_shift_audio(audio, shift_semitones, sample_rate=44100, n_fft=2048, hop_length=512): shift_factor = 2 ** (shift_semitones / 12); stft = torch.stft(audio, n_fft, hop_length, return_complex=True); magnitude = torch.abs(stft); phase = torch.angle(stft); shifted_phase = torch.zeros_like(phase); phase_advance = torch.linspace(0',
  //   ' magnitude = torch.abs(stft); phase = torch.angle(stft); shifted_phase = torch.zeros_like(phase); phase_advance = torch.linspace(0, np.pi * hop_length / hop_length, n_fft // 2 + 1).unsqueeze(1); for frame in range(1, phase.size(-1)): phase_diff = phase[..., frame] - phase[..., frame-1] - phase_advance; phase_diff = phase_diff - 2 ',
  //   '  for frame in range(1, phase.size(-1)): phase_diff = phase[..., frame] - phase[..., frame-1] - phase_advance; phase_diff = phase_diff - 2 * np.pi * torch.round(phase_diff / (2 * np.pi)); shifted_phase[..., frame] = shifted_phase[..., frame-1] + phase_diff / shift_factor + phase_advance; shifted_stft = magnitude * torch.exp(1j * sh',
  //   'class DynamicConvolution(nn.Module): def __init__(self, in_channels, out_channels, kernel_size, num_experts=4, temperature=30): super().__init__(); self.num_experts = num_experts; self.temperature = temperature; self.expert_convs = nn.ModuleList([nn.Conv2d(in_channels, out_channels, kernel_size, padding=kernel_size//2) for _ in range(',
  //   ' self.expert_convs = nn.ModuleList([nn.Conv2d(in_channels, out_channels, kernel_size, padding=kernel_size//2) for _ in range(num_experts)]); self.routing_network = nn.Sequential(nn.AdaptiveAvgPool2d(1), nn.Conv2d(in_channels, num_experts, 1), nn.Softmax(dim=1)); def forward(self, x): routing_weights = self.routing_network(x); expert_ou',
  //   '  def forward(self, x): routing_weights = self.routing_network(x); expert_outputs = [conv(x) for conv in self.expert_convs]; weighted_output = sum(weight * output for weight, output in zip(routing_weights.unbind(1), expert_outputs)); return weighted_output; def get_routing_entropy(self, x): routing_weights = self.routing_network(x); ent',
  // ];

  const codeLines = [
    'import torch; import torch.nn as nn; import torchaudio; from lightning import LightningModule; import torch.nn.functional as F',
    'class AudioModel(LightningModule): def __init__(self, n_fft=2048, lr=1e-3, hidden_dim=512, n_mels=128, sample_rate=44100):',
    '    super().__init__(); self.mel_transform = torchaudio.transforms.MelSpectrogram(sample_rate, n_fft, n_mels=n_mels)',
    '    self.encoder = nn.Conv2d(1, 64, 3, padding=1); self.decoder = nn.ConvTranspose2d(128, 1, 3, padding=1)',
    '    self.attention = nn.MultiheadAttention(hidden_dim, 8); self.dropout = nn.Dropout(0.1); self.lr = lr',
    '  def forward(self, x): mel_spec = self.mel_transform(x); encoded = self.encoder(mel_spec.unsqueeze(1))',
    '    attended, _ = self.attention(encoded.flatten(2).transpose(1, 2), encoded.flatten(2).transpose(1, 2))',
    '    return self.decoder(encoded); def training_step(self, batch, idx): x, y = batch; pred = self(x)',
    '    loss = F.mse_loss(pred, y); self.log("train_loss", loss); return loss',
    '  def configure_optimizers(self): return torch.optim.AdamW(self.parameters(), lr=self.lr, weight_decay=1e-4)',
    'dataloader = DataLoader(dataset, batch_size=32, shuffle=True, num_workers=4, pin_memory=True)',
    'trainer = Trainer(max_epochs=100, accelerator="gpu", precision=16, log_every_n_steps=50)',
    'checkpoint = torch.load("model.ckpt"); model.load_state_dict(checkpoint["state_dict"])',
    'spectrogram = torchaudio.transforms.Spectrogram(n_fft=2048, hop_length=512, power=2.0)',
    'mel_spectrogram = torchaudio.transforms.MelSpectrogram(sample_rate=44100, n_mels=128, fmax=8000)',
    'audio_data, sr = torchaudio.load("audio.wav"); resampler = torchaudio.transforms.Resample(sr, 22050)',
    'stft = torch.stft(waveform, n_fft=2048, hop_length=512, return_complex=True)',
    'magnitude = torch.abs(stft); phase = torch.angle(stft); power = magnitude ** 2',
    'class ResBlock(nn.Module): def __init__(self, channels): super().__init__(); self.conv1 = nn.Conv2d(channels, channels, 3, 1, 1)',
    '  def forward(self, x): return F.relu(self.conv1(x)) + x',
    'augmentations = Compose([AddGaussianNoise(p=0.5), TimeStretch(p=0.3), PitchShift(p=0.4)])',
    'optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3); scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, 100)',
    'loss_fn = torch.nn.MSELoss(); model.train(); for batch in dataloader: loss = loss_fn(model(x), y); loss.backward()',
    'model.eval(); with torch.no_grad(): predictions = model(test_input); torchaudio.save("output.wav", predictions, 44100)',
    'class Attention(nn.Module): def __init__(self, dim): super().__init__(); self.scale = dim ** -0.5; self.to_qkv = nn.Linear(dim, dim * 3)'
  ];

  /*====================================================================
    3. CHARACTER GRID PRE-COMPUTATION
  ====================================================================*/
  // Flatten the code into one continuous stream
  const allText = codeLines.join(' ');
  const allChars = allText.replace(/\s+/g, ' ').split('');
  let cols, rows, charW, lineH;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.clientWidth  * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = 'top';
    charW = ctx.measureText('M').width;
    lineH = FONT_SIZE * 1.25;
    // compute how many characters fit per row/column
    cols = Math.ceil(canvas.clientWidth / charW);
    rows = Math.ceil(canvas.clientHeight / lineH);
    // dynamically adjust segment size based on screen width
    segmentSize = canvas.clientWidth > WIDTH_THRESHOLD ? LARGE_SEGMENT_SIZE : DEFAULT_SEGMENT_SIZE;
  }

  function getColors() {
    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue('--clr-background-primary').trim();
    const fg = styles.getPropertyValue('--clr-border-primary').trim(); // Use border-primary as subtle code color in both modes
    return { bg, fg };
  }

  function draw(ts) {
    if (USE_THROTTLE) {
      if (ts - lastFrameTime < 1000 / TARGET_FPS) {
        requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = ts;
    }
    const { bg, fg } = getColors();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.fillStyle = fg;
    for (let r = 0; r < rows; r++) {
      const yBase = r * lineH;
      for (let segX = 0; segX < cols; segX += segmentSize) {
        const count = Math.min(segmentSize, cols - segX);
        // build a substring of chars
        let segment = '';
        for (let j = 0; j < count; j++) {
          const idx = (r * cols + segX + j) % allChars.length;
          segment += allChars[idx];
        }
        const xPos = segX * charW;
        const xMid = xPos + (count * charW) * 0.5;
        const yOffset = Math.sin(ts * WAVE_SPEED + xMid * WAVE_LENGTH + r * WAVE_PHASE_Y) * WAVE_AMPL;
        ctx.fillText(segment, xPos, yBase + yOffset);
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  new MutationObserver(resize).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  resize();
  requestAnimationFrame(draw);
}

/**
 * Sets up the interests carousel with infinite horizontal scrolling
 */
function setupInterestsCarousel() {
  const carouselTrack = document.getElementById('carousel-track');
  if (!carouselTrack) return;

  // Calculate animation speed based on 20-second transit time
  const viewportWidth = window.innerWidth;
  const speed = viewportWidth / 20000; // pixels per millisecond

  let currentPosition = 0;
  let lastTimestamp = 0;
  
  // Get the width of the original content (first half of duplicated content)
  const originalItems = carouselTrack.children;
  const originalCount = originalItems.length / 2; // Since we duplicate everything
  
  function calculateOriginalWidth() {
    let width = 0;
    for (let i = 0; i < originalCount; i++) {
      width += originalItems[i].offsetWidth + 16; // +16 for gap
    }
    return width;
  }

  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Move left by speed * time elapsed
    currentPosition -= speed * deltaTime;

    // Reset position when we've scrolled through the original content
    const originalWidth = calculateOriginalWidth();
    if (Math.abs(currentPosition) >= originalWidth) {
      currentPosition = 0;
    }

    carouselTrack.style.transform = `translateX(${currentPosition}px)`;
    requestAnimationFrame(animate);
  }

  // Wait for images to load before starting animation
  Promise.all(Array.from(carouselTrack.querySelectorAll('img')).map(img => {
    return new Promise(resolve => {
      if (img.complete) resolve();
      else img.onload = resolve;
    });
  })).then(() => {
    requestAnimationFrame(animate);
  });

  // Recalculate on window resize
  window.addEventListener('resize', debounce(() => {
    // Speed will automatically adjust based on new viewport width
  }, 250));
}
