/**
 * Movra Store Animations
 * Using GSAP for advanced animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Animations will not work.');
    return;
  }
  
  // Register plugins if available
  if (gsap.registerPlugin) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initScrollAnimations();
    }
    
    if (typeof SplitText !== 'undefined') {
      gsap.registerPlugin(SplitText);
      initTextAnimations();
    }
  }
  
  // Initialize animations
  initPageTransitions();
  initHeroAnimations();
  initProductAnimations();
  initCartAnimations();
});

/**
 * Page transition animations
 */
function initPageTransitions() {
  // Page enter animation
  gsap.from('body > *', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out',
  });
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  
  if (!hero) return;
  
  const tl = gsap.timeline();
  
  tl.from('.hero-content h1', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
  })
  .from('.hero-content p', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.6')
  .from('.hero-btns .btn', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out',
  }, '-=0.4');
}

/**
 * Product animations
 */
function initProductAnimations() {
  // Product card hover animations
  gsap.utils.toArray('.shop-card').forEach(card => {
    const image = card.querySelector('img');
    const info = card.querySelector('.shop-card-info');
    
    if (!image || !info) return;
    
    const tl = gsap.timeline({ paused: true });
    
    tl.to(image, {
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out',
    })
    .to(info, {
      y: -5,
      duration: 0.4,
      ease: 'power2.out',
    }, 0);
    
    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());
  });
  
  // Product image gallery animation
  const productImages = document.querySelectorAll('.product-gallery .thumb');
  
  productImages.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const mainImage = document.querySelector('.product-gallery .main-image img');
      if (!mainImage) return;
      
      gsap.fromTo(mainImage, 
        { opacity: 0.8, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    });
  });
  
  // Collection card animations
  gsap.utils.toArray('.collection-card').forEach(card => {
    const overlay = card.querySelector('.collection-overlay');
    const image = card.querySelector('img');
    
    if (!overlay || !image) return;
    
    const tl = gsap.timeline({ paused: true });
    
    tl.to(image, {
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.out',
    })
    .to(overlay, {
      backgroundColor: 'rgba(44, 62, 80, 0.7)',
      duration: 0.4,
      ease: 'power2.out',
    }, 0)
    .from(overlay.querySelector('h3'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.1)
    .from(overlay.querySelector('p'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.2);
    
    card.addEventListener('mouseenter', () => tl.play());
    card.addEventListener('mouseleave', () => tl.reverse());
  });
  
  // Add to cart animation
  document.addEventListener('click', function(e) {
    const addToCartBtn = e.target.closest('.add-to-cart');
    
    if (!addToCartBtn) return;
    
    const productCard = addToCartBtn.closest('.shop-card');
    const cartIcon = document.getElementById('cart-icon');
    
    if (!productCard || !cartIcon) return;
    
    const productImage = productCard.querySelector('img');
    
    if (!productImage) return;
    
    // Create flying image element
    const flyingImage = productImage.cloneNode();
    const startRect = productImage.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();
    
    // Set initial position and styles
    flyingImage.style.position = 'fixed';
    flyingImage.style.top = startRect.top + 'px';
    flyingImage.style.left = startRect.left + 'px';
    flyingImage.style.width = startRect.width + 'px';
    flyingImage.style.height = startRect.height + 'px';
    flyingImage.style.objectFit = 'cover';
    flyingImage.style.zIndex = '9999';
    flyingImage.style.borderRadius = '4px';
    flyingImage.style.pointerEvents = 'none';
    
    document.body.appendChild(flyingImage);
    
    // Animate to cart
    gsap.to(flyingImage, {
      top: endRect.top + endRect.height / 2,
      left: endRect.left + endRect.width / 2,
      width: 30,
      height: 30,
      borderRadius: '50%',
      duration: 0.8,
      ease: 'power3.in',
      onComplete: () => {
        // Remove flying image
        document.body.removeChild(flyingImage);
        
        // Animate cart icon
        gsap.to(cartIcon, {
          scale: 1.2,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(cartIcon, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.in',
            });
            
            // Show notification
            const toast = document.getElementById('toast');
            if (toast) {
              toast.classList.add('show');
              setTimeout(() => {
                toast.classList.remove('show');
              }, 3000);
            }
          },
        });
      },
    });
  });
}

/**
 * Cart animations
 */
function initCartAnimations() {
  const cartDrawer = document.getElementById('cart-drawer');
  
  if (!cartDrawer) return;
  
  // Animate cart items
  const observer = new MutationObserver(() => {
    const cartItems = cartDrawer.querySelectorAll('.cart-item');
    
    gsap.from(cartItems, {
      opacity: 0,
      x: 20,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'all',
    });
  });
  
  observer.observe(cartDrawer, { childList: true, subtree: true });
}

/**
 * Scroll animations using ScrollTrigger
 */
function initScrollAnimations() {
  // Section titles
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
    });
  });
  
  // Product cards
  gsap.utils.toArray('.shop-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.shop-card');
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  });
  
  // Collection cards
  gsap.utils.toArray('.collections-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.card');
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out',
    });
  });
}

/**
 * Text animations using SplitText
 */
function initTextAnimations() {
  // Hero heading
  const heroHeading = document.querySelector('.hero-content h1');
  
  if (heroHeading) {
    const split = new SplitText(heroHeading, { type: 'chars, words' });
    
    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      rotationX: -90,
      stagger: 0.02,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => split.revert(),
    });
  }
} 