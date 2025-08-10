/**
 * main.js - Main entry point for the application
 */

// Import the i18n manager
import i18n from './i18n/i18n.js';

// Import any other modules or assets here

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize fade-in animations
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