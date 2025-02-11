document.addEventListener('DOMContentLoaded', () => {
  // Always start at the top
  window.scrollTo(0, 0);

  const text = "See What I'm About";
  const typingText = document.querySelector('.typing-text');
  const introContainer = document.querySelector('.intro-container');
  const tourContainer = document.querySelector('.tour-container');
  const mainContainer = document.querySelector('.container');
  const logoHeader = document.querySelector('.logo-header');
  const navMenu = document.querySelector('.nav-menu');
  const galleryRows = document.querySelectorAll('.gallery-row');
  const contactSection = document.querySelector('.contact-section');

  // Global flag for gallery clickability (modal works only after fade in)
  let galleryClickable = false;

  // For results animation
  let resultsAnimationStarted = false;
  const initialSubscribers = 38012;
  const initialViews = 13046787;
  let subscriberCount = initialSubscribers;
  let viewCount = initialViews;
  let subscriberInterval;
  let viewInterval;

  // Set up the observer for tour sections
  let tourTransitioning = false;
  const tourObserverOptions = { threshold: 0.1, rootMargin: '-50px' };
  const tourObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (tourTransitioning) return;
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // If this is the results section and animation hasn't started, trigger it.
        if (entry.target.classList.contains('tour-results') && !resultsAnimationStarted) {
          startResultsAnimation();
          resultsAnimationStarted = true;
        }
      }
    });
  }, tourObserverOptions);
  document.querySelectorAll('.tour-section').forEach(section => {
    tourObserver.observe(section);
  });

  // Function that runs the intro/tour animation sequence
  function runIntroAnimation() {
    setTimeout(() => {
      // Animate the "See What I'm About" text
      typingText.style.transition = 'all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)';
      typingText.style.opacity = '1';
      typingText.style.transform = 'translateY(0)';
      let i = 0;
      const typeWriter = setInterval(() => {
        if (i < text.length) {
          typingText.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeWriter);
          setTimeout(() => {
            introContainer.classList.add('fade-out');
            introContainer.addEventListener('transitionend', () => {
              introContainer.style.display = 'none';
              // Show the tour container
              tourContainer.style.display = 'block';
              const aboutText = document.querySelector('.about-text');
              aboutText.style.removeProperty('opacity');
              aboutText.classList.add('visible');
              // Type out the scroll prompt
              setTimeout(() => {
                const scrollPrompt = document.querySelector('.scroll-prompt');
                const promptText = 'Keep scrolling to explore!';
                let j = 0;
                const typePrompt = setInterval(() => {
                  if (j < promptText.length) {
                    scrollPrompt.style.opacity = '1';
                    scrollPrompt.textContent += promptText.charAt(j);
                    j++;
                  } else {
                    clearInterval(typePrompt);
                  }
                }, 100);
              }, 2000);
            }, { once: true });
          }, 1500);
        }
      }, 120);
    }, 2000);
  }

  runIntroAnimation();

  // Function to replay the entire intro and tour animation sequence exactly as on first load
  function replayIntroAnimation() {
    window.scrollTo(0, 0);
    introContainer.style.display = 'flex';
    introContainer.classList.remove('fade-out');
    typingText.textContent = '';
    typingText.style.opacity = '0';
    typingText.style.transform = 'translateY(20px)';

    tourContainer.classList.remove('fade-out');
    tourContainer.style.display = 'none';
    document.querySelectorAll('.tour-section').forEach(section => {
      section.classList.remove('visible');
    });
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.classList.remove('visible');
      aboutText.style.removeProperty('opacity');
    }
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.style.opacity = '0';
      scrollPrompt.textContent = '';
      scrollPrompt.style.display = '';
    }

    mainContainer.style.display = 'none';
    mainContainer.classList.remove('visible');
    logoHeader.classList.remove('visible');
    navMenu.classList.remove('visible');
    galleryRows.forEach(row => {
      row.classList.remove('visible');
      row.classList.remove('scroll');
    });
    contactSection.classList.remove('visible');

    galleryClickable = false;
    resultsAnimationStarted = false;
    clearInterval(subscriberInterval);
    clearInterval(viewInterval);
    subscriberCount = initialSubscribers;
    viewCount = initialViews;

    tourTransitioning = false;
    document.querySelectorAll('.tour-section').forEach(section => {
      section.classList.remove('visible');
      tourObserver.observe(section);
    });

    runIntroAnimation();
  }

  document.getElementById('about-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    replayIntroAnimation();
  });

  document.querySelector('.enter-portfolio').addEventListener('click', () => {
    tourTransitioning = true;
    tourObserver.disconnect();

    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.style.transition = 'none';
      aboutText.style.opacity = '0';
    }
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.style.transition = 'none';
      scrollPrompt.style.opacity = '0';
      scrollPrompt.style.display = 'none';
    }

    tourContainer.classList.add('fade-out');
    tourContainer.addEventListener('transitionend', () => {
      setTimeout(() => {
        tourContainer.style.display = 'none';
      }, 1000);
    }, { once: true });

    setTimeout(() => {
      window.scrollTo(0, 0);
      mainContainer.style.display = 'flex';
      mainContainer.classList.remove('visible');
      requestAnimationFrame(() => {
        mainContainer.classList.add('visible');
        setTimeout(() => {
          logoHeader.classList.add('visible');
          setTimeout(() => {
            navMenu.classList.add('visible');
            let rowDelay = 1000;
            galleryRows.forEach((row, idx) => {
              setTimeout(() => {
                row.classList.add('visible');
              }, rowDelay * (idx + 1));
            });
            setTimeout(() => {
              contactSection.classList.add('visible');
              galleryRows.forEach(row => {
                const firstInner = row.querySelector('.inner');
                const computedGap = getComputedStyle(row).gap;
                const gapValue = parseFloat(computedGap) || 0;
                const scrollDistance = firstInner.offsetWidth + gapValue;
                row.style.setProperty('--scroll-distance', scrollDistance + 'px');
              });
              galleryRows.forEach(row => {
                row.classList.add('scroll');
              });
              galleryClickable = true;
            }, rowDelay * galleryRows.length + 1000);
          }, 500);
        }, 500);
      });
    }, 800);
  });

  document.getElementById('logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('contact-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.gallery-row img').forEach(img => {
    img.addEventListener('click', (e) => {
      if (!galleryClickable) return;
      createModal(e.target.src);
    });
  });

  function createModal(src) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const modalImageWrapper = document.createElement('div');
    modalImageWrapper.classList.add('modal-image-wrapper');
    
    const modalImage = document.createElement('img');
    modalImage.src = src;
    modalImageWrapper.appendChild(modalImage);
    
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close');
    closeButton.textContent = 'Close';
    
    modalContent.appendChild(modalImageWrapper);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    requestAnimationFrame(() => {
      modalOverlay.classList.add('visible');
    });
    
    closeButton.addEventListener('click', () => {
      modalOverlay.classList.remove('visible');
      modalOverlay.addEventListener('transitionend', () => {
        modalOverlay.remove();
      }, { once: true });
    });
  }

  // Start the results animation when the tour-results section comes into view.
  function startResultsAnimation() {
    // Typewriter effect for the results title.
    const titleEl = document.querySelector('.results-title');
    const finalTitleHTML = 'But what are the <span class="highlight">results</span>?';
    const plainTitle = "But what are the results?";
    titleEl.textContent = "";
    let index = 0;
    const titleInterval = setInterval(() => {
      titleEl.textContent += plainTitle.charAt(index);
      index++;
      if (index === plainTitle.length) {
        clearInterval(titleInterval);
        titleEl.innerHTML = finalTitleHTML;
      }
    }, 100);  // Slower interval

    // Typewriter effect for the description.
    const descEl = document.querySelector('.results-description');
    const finalDescHTML = 'Well, across two channel\'s I\'ve amassed <span class="subscriber-count">' + initialSubscribers + '</span> subscribers and <span class="view-count">' + initialViews + '</span> views.';
    const plainDesc = "Well, across two channel's I've amassed subscribers and views.";
    descEl.textContent = "";
    let dIndex = 0;
    const descInterval = setInterval(() => {
      descEl.textContent += plainDesc.charAt(dIndex);
      dIndex++;
      if (dIndex === plainDesc.length) {
        clearInterval(descInterval);
        descEl.innerHTML = finalDescHTML;
        // Start the counters
        subscriberInterval = setInterval(() => {
          subscriberCount++;
          document.querySelector('.subscriber-count').textContent = subscriberCount.toLocaleString();
        }, 5000);
        viewInterval = setInterval(() => {
          viewCount++;
          document.querySelector('.view-count').textContent = viewCount.toLocaleString();
        }, 2000);
      }
    }, 60);  // Slower interval
  }
});
