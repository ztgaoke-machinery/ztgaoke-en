// ZTGAOKE Machinery website - shared scripts
(function () {
  // Mobile menu toggle
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when a link is clicked
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  // Scroll reveal animation
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Contact form: send via Web3Forms if configured, otherwise fallback to mailto
  var form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var accessKey = form.getAttribute('data-access-key') || '';

      if (accessKey && accessKey.indexOf('YOUR_WEB3FORMS') === -1) {
        var fd = new FormData(form);
        status.className = 'form-status';
        status.textContent = 'Sending...';
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: fd
        }).then(function (r) { return r.json(); }).then(function (data) {
          if (data.success) {
            status.className = 'form-status ok';
            status.textContent = 'Thank you! Your inquiry has been sent. We will reply within 24 hours.';
            form.reset();
          } else {
            status.className = 'form-status err';
            status.textContent = 'Sorry, sending failed. Please email us directly or try again.';
          }
        }).catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Network error. Please email us directly or try again.';
        });
      } else {
        // Fallback: build a mailto link
        var name = form.elements['name'] ? form.elements['name'].value : '';
        var email = form.elements['email'] ? form.elements['email'].value : '';
        var subject = encodeURIComponent('Inquiry from website - ' + name);
        var body = encodeURIComponent(
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Country: ' + (form.elements['country'] ? form.elements['country'].value : '') + '\n' +
          'Product: ' + (form.elements['product'] ? form.elements['product'].value : '') + '\n' +
          'Message:\n' + (form.elements['message'] ? form.elements['message'].value : '')
        );
        window.location.href = 'mailto:Rungin231220@gmail.com?subject=' + subject + '&body=' + body;
        status.className = 'form-status ok';
        status.textContent = 'Opening your email app... You can also WhatsApp/phone us directly.';
      }
    });
  }

  // Hero carousel: auto-rotate slides, dots are clickable
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDots = document.querySelectorAll('.hero-dot');
  if (heroSlides.length > 1) {
    var heroIndex = 0;
    var heroTimer = null;
    var showSlide = function (i) {
      heroIndex = (i + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (s, k) { s.classList.toggle('active', k === heroIndex); });
      heroDots.forEach(function (d, k) { d.classList.toggle('active', k === heroIndex); });
    };
    var startTimer = function () {
      if (heroTimer) clearInterval(heroTimer);
      heroTimer = setInterval(function () { showSlide(heroIndex + 1); }, 5000);
    };
    heroDots.forEach(function (d, k) {
      d.addEventListener('click', function () { showSlide(k); startTimer(); });
    });
    showSlide(0);
    startTimer();
  }

  // Auto fill year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
