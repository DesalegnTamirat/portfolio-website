document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.desktop-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = mobileBtn.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = mobileBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Sticky Header Scrolled State
  const header = document.querySelector('.glass-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger once on load

  // Active Nav Link highlight on Scroll
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });
});
