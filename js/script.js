/**
 * GRUPO CAPRICHO VEÍCULOS - INTERAÇÕES & ANIMAÇÕES JAVASCRIPT
 * Implementação limpa, nativa (Vanilla JS) e performática.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================
     1. SCROLL REVEAL VIA INTERSECTION OBSERVER
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const blurTextElements = document.querySelectorAll('.blur-text');
  blurTextElements.forEach(element => {
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = '';

    words.forEach((word, index) => {
      const wordElement = document.createElement('span');
      wordElement.className = 'blur-text-word';
      wordElement.style.setProperty('--blur-index', index);
      wordElement.textContent = word;
      element.append(wordElement);
      if (index < words.length - 1) {
        element.append(' ');
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const blurObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-blurred-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    blurTextElements.forEach(element => blurObserver.observe(element));
  } else {
    blurTextElements.forEach(element => element.classList.add('is-blurred-in'));
  }

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }


  /* ==========================================
     2. HERO "SCROLL EXPAND": a imagem dos 3 carros cresce de
     enquadrada para tela cheia conforme o usuário rola a página.
     Implementado com uma única CSS custom property (--hp) atualizada
    via requestAnimationFrame.
     ========================================== */
  const heroSection = document.getElementById('hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroSection && !prefersReducedMotion) {
    let ticking = false;
    let heroHeight = heroSection.offsetHeight;

    const updateHeroProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = Math.min(Math.max(scrollY / (heroHeight * 0.9), 0), 1);
      heroSection.style.setProperty('--hp', progress.toFixed(4));
      ticking = false;
    };

    const onHeroScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeroProgress);
        ticking = true;
      }
    };

    const onResize = () => {
      heroHeight = heroSection.offsetHeight;
      onHeroScroll();
    };

    updateHeroProgress();
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pageshow', updateHeroProgress);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateHeroProgress();
    });
  } else if (heroSection) {
    // Movimento reduzido: mostra a imagem já expandida, sem animação
    heroSection.style.setProperty('--hp', '1');
  }


  /* ==========================================
     2.1 ACCORDION GALLERY ("OS CAMINHOS DO GRUPO")
     Em telas sem hover (touch), o primeiro toque expande o painel;
     o segundo toque segue para o link.
     ========================================== */
  const pathPanels = document.querySelectorAll('.path-panel');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (isTouchDevice && pathPanels.length) {
    pathPanels.forEach(panel => {
      panel.addEventListener('click', (e) => {
        if (!panel.classList.contains('is-expanded')) {
          e.preventDefault();
          pathPanels.forEach(p => p.classList.remove('is-expanded'));
          panel.classList.add('is-expanded');
        }
      });
    });
  }

  /* ==========================================
     6. ROLAGEM SUAVE REFINADA PARA ÂNCORAS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
