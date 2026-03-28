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

  // Theme Toggle (Light/Dark Mode)
  const themeToggle = document.querySelector('.theme-toggle-btn');
  const icon = themeToggle.querySelector('i');
  
  // Check local storage for theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
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

  // Contact Form AJAX Submission
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');
  
  if(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('form-submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          statusMsg.innerHTML = "Thanks for your message! I'll get back to you soon.";
          statusMsg.style.color = "#28a745"; // Success green
          statusMsg.style.display = "block";
          form.reset();
        } else {
          const responseData = await response.json();
          if (responseData.hasOwnProperty('errors')) {
            statusMsg.innerHTML = responseData.errors.map(error => error.message).join(", ");
          } else {
            statusMsg.innerHTML = "Oops! There was a problem submitting your form";
          }
          statusMsg.style.color = "#ff4c4c"; // Error red
          statusMsg.style.display = "block";
        }
      } catch (error) {
        statusMsg.innerHTML = "Oops! There was a problem submitting your form";
        statusMsg.style.color = "#ff4c4c";
        statusMsg.style.display = "block";
      }
      
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      
      // Hide status message after 5 seconds
      setTimeout(() => {
        statusMsg.style.display = "none";
      }, 5000);
    });
  }
});
