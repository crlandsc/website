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

  // Set up carousel
  setupCarousel();

  // Set up contact form
  setupContactForm();

  // Set up parallax effect for hero image
  setupParallax();

  // Set up smooth scrolling for navigation links
  setupSmoothScrolling();

  // Handle URL hash on page load
  handleInitialHash();
  
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
      htmlElement.setAttribute('data-theme', 'light');
      if (themeToggleButton) themeToggleButton.setAttribute('aria-label', 'Switch to dark mode');
      if (lightIcon) lightIcon.style.display = 'block';
      if (darkIcon) darkIcon.style.display = 'none';
    }
  };

  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  let currentTheme;

  if (storedTheme) {
    currentTheme = storedTheme;
  } else {
    currentTheme = systemPrefersDark.matches ? 'dark' : 'light';
  }
  applyTheme(currentTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    });
  }

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
        <div class="edu-card">
          <h4>${edu.degree}</h4>
          <p>${edu.school}</p>
          <p>${edu.period}</p>
          ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
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
function setupCarousel() {
  const carousel = document.querySelector('.carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  
  if (carousel && prevBtn && nextBtn) {
    // Previous button click
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({
        left: -280,
        behavior: 'smooth'
      });
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({
        left: 280,
        behavior: 'smooth'
      });
    });

    // Make buttons always visible on mobile
    const updateButtonVisibility = () => {
      if (window.innerWidth < 768) {
        prevBtn.style.opacity = '1';
        nextBtn.style.opacity = '1';
      } else {
        prevBtn.style.opacity = '';
        nextBtn.style.opacity = '';
      }
    };

    updateButtonVisibility();
    window.addEventListener('resize', updateButtonVisibility);
  }
}

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
      const mailtoUrl = `mailto:clandschoot@example.com?subject=${subject}&body=Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
      
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
  }
}
