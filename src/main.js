/**
 * main.js - Main entry point for the application
 */

// Import the i18n manager
import i18n from './i18n/i18n.js';

// SPA Router
class SPARouter {
  constructor() {
    this.routes = {
      '#hero': 'hero',
      '#about': 'about', 
      '#projects': 'projects',
      '#skills': 'skills',
      '#cv': 'cv',
      '#contact': 'contact'
    };
    this.currentSection = '#hero';
    this.init();
  }

  init() {
    // Handle initial route
    this.handleRoute();
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle navigation clicks
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = link.getAttribute('href');
        this.navigateTo(hash);
      });
    });
  }

  navigateTo(hash) {
    if (this.routes[hash]) {
      window.location.hash = hash;
      this.handleRoute();
    }
  }

  handleRoute() {
    const hash = window.location.hash || '#hero';
    const sectionId = this.routes[hash];
    
    if (sectionId) {
      this.showSection(sectionId);
      this.updateActiveNav(hash);
      this.currentSection = hash;
    }
    
    // Track page views
    const currentHash = window.location.hash || '#hero';
    trackEvent('page_view', {
        page_title: currentHash.replace('#', ''),
        page_location: window.location.href
    });
  }

  showSection(targetId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.style.display = 'flex';
      // Trigger fade-in animations for newly visible elements
      this.triggerAnimations(targetSection);
    }
  }

  updateActiveNav(hash) {
    // Remove active class from all nav links
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('text-yellow-400');
    });
    
    // Add active class to current nav link
    const activeLink = document.querySelector(`nav a[href="${hash}"]`);
    if (activeLink) {
      activeLink.classList.add('text-yellow-400');
    }
  }

  triggerAnimations(section) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    section.querySelectorAll('.fade-in').forEach(el => {
      el.classList.remove('show');
      observer.observe(el);
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize SPA Router
  const router = new SPARouter();

  // Initialize fade-in animations for initial load
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = mobileMenuButton ? mobileMenuButton.querySelector('svg') : null;
  
  // Create X icon for close state
  const createXIcon = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`;
  };
  
  // Create hamburger icon for open state
  const createHamburgerIcon = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>`;
  };
  
  if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Toggle icon between hamburger and X
      if (navLinks.classList.contains('active')) {
        mobileMenuButton.innerHTML = createXIcon();
      } else {
        mobileMenuButton.innerHTML = createHamburgerIcon();
      }
    });
    
    // Close menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuButton.innerHTML = createHamburgerIcon();
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuButton.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuButton.innerHTML = createHamburgerIcon();
      }
    });
  }
});

// Google Analytics event tracking
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Track CTA clicks
document.addEventListener('DOMContentLoaded', () => {
    // Track contact button clicks
    document.querySelectorAll('a[href="#contact"]').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('contact_click', {
                button_location: 'cta_button'
            });
        });
    });
    
    // Track project views
    document.querySelectorAll('a[href="#projects"]').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('projects_view', {
                source: 'navigation'
            });
        });
    });
});

// Google Analytics Banner
document.addEventListener('DOMContentLoaded', () => {
  const analyticsBanner = document.getElementById('analytics-banner');
  const acceptButton = document.getElementById('analytics-accept');
  const declineButton = document.getElementById('analytics-decline');
  const closeButton = document.getElementById('analytics-close');
  const bannerText = document.getElementById('analytics-banner-text');
  
  // Check if user has already made a choice
  const analyticsChoice = localStorage.getItem('analytics-choice');
  
  // Update banner text based on language
  if (i18n && i18n.currentLanguage) {
    const lang = i18n.currentLanguage;
    if (lang === 'es') {
      bannerText.textContent = 'Este sitio web utiliza Google Analytics para mejorar la experiencia del usuario.';
      if (acceptButton) acceptButton.textContent = 'Aceptar';
      if (declineButton) declineButton.textContent = 'Rechazar';
    }
  }
  
  // Show banner if no choice has been made
  if (!analyticsChoice) {
    setTimeout(() => {
      analyticsBanner.classList.add('show');
    }, 1000); // Show after 1 second
  }
  
  // Handle accept button click
  acceptButton.addEventListener('click', () => {
    localStorage.setItem('analytics-choice', 'accepted');
    enableAnalytics();
    analyticsBanner.classList.remove('show');
  });
  
  // Handle decline button click
  declineButton.addEventListener('click', () => {
    localStorage.setItem('analytics-choice', 'declined');
    disableAnalytics();
    analyticsBanner.classList.remove('show');
  });
  
  // Handle close button click
  closeButton.addEventListener('click', () => {
    analyticsBanner.classList.remove('show');
  });
  
  // Enable or disable analytics based on stored preference
  if (analyticsChoice === 'accepted') {
    enableAnalytics();
  } else if (analyticsChoice === 'declined') {
    disableAnalytics();
  }
  
  // Function to enable Google Analytics
  function enableAnalytics() {
    // Only enable in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      window['ga-disable-G-5YP3MMRNWF'] = false;
      gtag('config', 'G-5YP3MMRNWF');
    }
  }
  
  // Function to disable Google Analytics
  function disableAnalytics() {
    window['ga-disable-G-5YP3MMRNWF'] = true;
  }
});