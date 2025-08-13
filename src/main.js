/**
 * main.js - Main entry point for the application
 */

// Import the i18n manager
import i18n from './i18n/i18n.js';

// Lightweight Typewriter Effect
class TypewriterEffect {
  constructor(element, text, speed = 100, delay = 1000) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.delay = delay;
    this.index = 0;
  }

  start() {
    this.element.textContent = '';
    this.element.style.borderRight = '2px solid #facc15';
    this.element.style.animation = 'blink 1s infinite';
    
    setTimeout(() => {
      this.type();
    }, this.delay);
  }

  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        this.element.style.borderRight = 'none';
        this.element.style.animation = 'none';
      }, 1000);
    }
  }
}

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
      
      // Trigger typewriter effect when navigating to hero
      if (hash === '#hero') {
        this.initTypewriterEffect();
      }
    }
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

  initTypewriterEffect() {
    setTimeout(() => {
      const greetingElement = document.getElementById('typewriter-greeting');
      const subtitleElement = document.getElementById('typewriter-subtitle');
      
      if (greetingElement && subtitleElement) {
        const greetingText = greetingElement.textContent;
        const subtitleText = subtitleElement.textContent;
        
        // Start greeting typewriter
        const greetingTypewriter = new TypewriterEffect(greetingElement, greetingText, 80, 500);
        greetingTypewriter.start();
        
        // Start subtitle typewriter after greeting is done
        setTimeout(() => {
          const subtitleTypewriter = new TypewriterEffect(subtitleElement, subtitleText, 60, 0);
          subtitleTypewriter.start();
        }, greetingText.length * 80 + 1500);
      }
    }, 1000);
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
  
  // Initialize typewriter effect on initial load if on hero section
  if (!window.location.hash || window.location.hash === '#hero') {
    router.initTypewriterEffect();
  }
  
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