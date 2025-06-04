/**
 * Movra Store Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing components');
    // Initialize components
    initHeader();
    initMobileMenu();
    initSearch();
    initQuantityControls();
    initProductGallery();
    initProductTabs();
    initCartDrawer();
    initWishlist();
    initFilters();
    initTooltips();
    initAnimations();
    initDarkMode();
    initScrollToTop();
    loadProductImages();
    initSmoothScrolling();
    
    // Initialize sliders if Swiper is loaded
    if (typeof Swiper !== 'undefined') {
        initSliders();
    }
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.getElementById('main-header');
    
    if (!header) {
        console.error('Header element not found!');
        return;
    }
    console.log('Header initialized successfully');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menu = document.getElementById('main-nav');
    const overlay = document.querySelector('.menu-overlay');
    
    console.log('Mobile menu elements:', {menuBtn: !!menuBtn, closeBtn: !!closeBtn, menu: !!menu, overlay: !!overlay});
    
    if (!menuBtn || !menu) return;
    
    menuBtn.addEventListener('click', function() {
        console.log('Mobile menu button clicked');
        menu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            menu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle dropdowns in mobile menu
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth < 768) {
                e.preventDefault();
                const parent = this.parentElement;
                const dropdown = parent.querySelector('.dropdown-menu');
                
                dropdown.classList.toggle('show');
                this.classList.toggle('active');
            }
        });
    });
}

/**
 * Search functionality
 */
function initSearch() {
    const searchIcon = document.getElementById('search-icon');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.querySelector('#search-container input');
    
    if (!searchIcon || !searchContainer) return;
    
    searchIcon.addEventListener('click', function() {
        searchContainer.classList.toggle('active');
        
        if (searchContainer.classList.contains('active') && searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (searchContainer && searchContainer.classList.contains('active') && 
            !searchContainer.contains(e.target) && e.target !== searchIcon) {
            searchContainer.classList.remove('active');
        }
    });
}

/**
 * Quantity controls for product and cart
 */
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.quantity-controls');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.quantity-minus');
        const plusBtn = control.querySelector('.quantity-plus');
        const input = control.querySelector('.quantity-input');
        
        if (!minusBtn || !plusBtn || !input) return;
        
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                // Trigger change event for any listeners
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
        
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            // Trigger change event for any listeners
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        });
        
        // Prevent non-numeric input
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value === '' || parseInt(this.value) < 1) {
                this.value = 1;
            }
        });
    });
}

/**
 * Product gallery functionality
 */
function initProductGallery() {
    const gallery = document.querySelector('.product-gallery');
    
    if (!gallery) return;
    
    const mainImage = gallery.querySelector('.main-image img');
    const thumbs = gallery.querySelectorAll('.gallery-thumbs .thumb');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            
            // Update main image
            if (mainImage) {
                mainImage.setAttribute('src', imgSrc);
            }
            
            // Update active state
            thumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Image zoom functionality
    const zoomIcon = gallery.querySelector('.zoom-icon');
    
    if (zoomIcon && mainImage) {
        zoomIcon.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            const zoomedImg = document.createElement('img');
            zoomedImg.setAttribute('src', mainImage.getAttribute('src'));
            zoomedImg.className = 'zoomed-image';
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(zoomedImg);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

/**
 * Product tabs functionality
 */
function initProductTabs() {
    const tabsContainer = document.querySelector('.product-tabs');
    
    if (!tabsContainer) return;
    
    const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    const tabPanes = tabsContainer.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active state for buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === target) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

/**
 * Cart drawer functionality
 */
function initCartDrawer() {
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('cart-drawer-close');
    const overlay = document.querySelector('.cart-drawer-overlay');
    
    if (!cartIcon || !cartDrawer) return;
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartDrawer.classList.add('open');
        
        if (overlay) {
            overlay.classList.add('active');
        } else {
            // Create overlay if it doesn't exist
            const newOverlay = document.createElement('div');
            newOverlay.className = 'modal-overlay cart-drawer-overlay active';
            document.body.appendChild(newOverlay);
            
            newOverlay.addEventListener('click', function() {
                cartDrawer.classList.remove('open');
                this.classList.remove('active');
            });
        }
        
        document.body.style.overflow = 'hidden';
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cartDrawer.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            if (item) {
                item.remove();
                updateCartCount();
                updateCartTotal();
            }
        });
    });
    
    // Handle quantity changes
    const quantityInputs = document.querySelectorAll('.cart-item .quantity-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateCartTotal();
        });
    });
}

/**
 * Update cart count
 */
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const countElement = document.querySelector('#cart-icon .count');
    
    if (countElement) {
        countElement.textContent = cartItems.length;
    }
}

/**
 * Update cart total
 */
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.getAttribute('data-price') || 0);
        const quantity = parseInt(item.querySelector('.quantity-input')?.value || 1);
        total += price * quantity;
    });
    
    const totalElement = document.querySelector('.cart-total-amount');
    
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
    }
}

/**
 * Wishlist functionality
 */
function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn, .shop-card-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            // Show notification
            showNotification(
                this.classList.contains('active') 
                    ? 'Product added to wishlist' 
                    : 'Product removed from wishlist'
            );
        });
    });
}

/**
 * Filter functionality for shop page
 */
function initFilters() {
    const filterToggle = document.querySelector('.filter-toggle');
    const sidebar = document.querySelector('.shop-sidebar');
    
    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // View switcher
    const viewOptions = document.querySelectorAll('.view-option');
    const shopGrid = document.querySelector('.shop-grid');
    
    if (viewOptions.length && shopGrid) {
        viewOptions.forEach(option => {
            option.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active state
                viewOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Update grid view
                shopGrid.className = 'shop-grid';
                if (view === 'list') {
                    shopGrid.classList.add('list-view');
                }
            });
        });
    }
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

/**
 * Initialize tooltips using Tippy.js if available
 */
function initTooltips() {
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]');
    }
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('main-nav');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const overlay = document.querySelector('.menu-overlay');
                    if (overlay) overlay.classList.remove('active');
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

/**
 * Initialize sliders using Swiper
 */
function initSliders() {
    // Products slider for Best Sellers section
    if (document.querySelector('.products-slider')) {
        new Swiper('.products-slider .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                },
            },
        });
    }
    
    // Instagram feed slider
    if (document.querySelector('.instagram-feed')) {
        // Populate Instagram feed with placeholder images
        const instaFeed = document.querySelector('.instagram-feed');
        let instaHTML = '';
        
        for (let i = 0; i < 6; i++) {
            const imgIndex = (i % 8) + 1;
            instaHTML += `
                <div class="instagram-item">
                    <img src="assets/images/products/generated-image-1 (${imgIndex}).png" alt="Instagram Post">
                    <div class="instagram-overlay">
                        <i class="fab fa-instagram"></i>
                    </div>
                </div>
            `;
        }
        
        instaFeed.innerHTML = instaHTML;
    }
}

/**
 * Initialize AOS animations if available
 */
function initAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }
}

/**
 * Dark mode toggle functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    // Check for saved user preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Set initial state
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.classList.add('active');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.classList.toggle('active');
        
        // Save user preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
}

/**
 * Scroll to top button functionality
 */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('active');
        } else {
            scrollBtn.classList.remove('active');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Show notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('active');
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Newsletter form
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // Add newsletter subscription logic here
        alert('Thank you for subscribing!');
        newsletterForm.reset();
    });
}

// Animate on scroll
const animateElements = document.querySelectorAll('.animate-on-scroll');
if (animateElements.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    
    animateElements.forEach(element => observer.observe(element));
}

// Update cart quantity
window.updateCartQty = function(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty < 1) {
            cart = cart.filter(item => item.id !== id);
        }
        localStorage.setItem('cartItems', JSON.stringify(cart));
        renderCartDrawer();
    }
}

// Remove item from cart
window.removeCartItem = function(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    renderCartDrawer();
}

/**
 * Load product images from local directory
 */
function loadProductImages() {
    // Product data with local image paths
    const products = [
        {
            id: 1,
            name: "Amber Elegance",
            category: "For Her",
            price: 89.99,
            originalPrice: 119.99,
            description: "A sophisticated blend of amber, vanilla, and jasmine for a warm, elegant scent.",
            image: "assets/images/products/generated-image-1.png"
        },
        {
            id: 2,
            name: "Ocean Breeze",
            category: "For Him",
            price: 79.99,
            originalPrice: 99.99,
            description: "Fresh marine notes combined with citrus and woody undertones for a refreshing experience.",
            image: "assets/images/products/generated-image-1 (1).png"
        },
        {
            id: 3,
            name: "Rose Noir",
            category: "For Her",
            price: 94.99,
            originalPrice: 124.99,
            description: "Mysterious dark rose with hints of patchouli and black pepper for a bold statement.",
            image: "assets/images/products/generated-image-1 (2).png"
        },
        {
            id: 4,
            name: "Cedar Whisper",
            category: "For Him",
            price: 84.99,
            originalPrice: 109.99,
            description: "Sophisticated cedar wood with amber and leather notes for a timeless masculine scent.",
            image: "assets/images/products/generated-image-1 (3).png"
        },
        {
            id: 5,
            name: "Velvet Orchid",
            category: "For Her",
            price: 99.99,
            originalPrice: 129.99,
            description: "Luxurious orchid blended with honey and vanilla for an opulent feminine fragrance.",
            image: "assets/images/products/generated-image-1 (4).png"
        },
        {
            id: 6,
            name: "Midnight Oud",
            category: "For Him",
            price: 109.99,
            originalPrice: 139.99,
            description: "Rich oud wood with spicy notes and a hint of saffron for a mysterious evening scent.",
            image: "assets/images/products/generated-image-1 (5).png"
        },
        {
            id: 7,
            name: "Citrus Bloom",
            category: "Unisex",
            price: 74.99,
            originalPrice: 94.99,
            description: "Vibrant citrus notes with delicate floral undertones for a fresh, versatile fragrance.",
            image: "assets/images/products/generated-image-1 (6).png"
        },
        {
            id: 8,
            name: "Sandalwood Dreams",
            category: "Unisex",
            price: 89.99,
            originalPrice: 119.99,
            description: "Warm sandalwood blended with vanilla and musk for a comforting, dreamy experience.",
            image: "assets/images/products/generated-image-1 (7).png"
        }
    ];

    // Populate product sliders and grids
    populateProductsSlider(products);
    populateShopGrid(products);
}

/**
 * Populate products slider with product data
 * @param {Array} products - Array of product objects
 */
function populateProductsSlider(products) {
    const productsSlider = document.querySelector('.products-slider');
    
    if (!productsSlider) return;
    
    let html = '<div class="swiper-container"><div class="swiper-wrapper">';
    
    products.forEach(product => {
        html += `
            <div class="swiper-slide">
                <div class="shop-card" data-id="${product.id}">
                    <div class="shop-card-img">
                        <img src="${product.image}" alt="${product.name}">
                        <button class="shop-card-wishlist" title="Add to Wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                        ${product.originalPrice > product.price ? 
                            `<span class="shop-card-badge">Sale</span>` : ''}
                    </div>
                    <div class="shop-card-info">
                        <span class="shop-card-category">${product.category}</span>
                        <h3 class="shop-card-title">${product.name}</h3>
                        <div class="shop-card-price">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice > product.price ? 
                                `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="shop-card-actions">
                            <button class="btn btn-sm add-to-cart">Add to Cart</button>
                            <button class="btn btn-sm btn-outline quick-view" data-id="${product.id}">Quick View</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '<div class="swiper-pagination"></div>';
    html += '<div class="swiper-button-next"></div>';
    html += '<div class="swiper-button-prev"></div>';
    html += '</div>';
    
    productsSlider.innerHTML = html;
    
    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined') {
        new Swiper('.products-slider .swiper-container', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                },
            },
        });
    }
}

/**
 * Populate shop grid with product data
 * @param {Array} products - Array of product objects
 */
function populateShopGrid(products) {
    const shopGrid = document.querySelector('.shop-grid');
    
    if (!shopGrid) return;
    
    let html = '';
    
    products.forEach(product => {
        html += `
            <div class="shop-card" data-id="${product.id}">
                <div class="shop-card-img">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="shop-card-wishlist" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                    ${product.originalPrice > product.price ? 
                        `<span class="shop-card-badge">Sale</span>` : ''}
                </div>
                <div class="shop-card-info">
                    <span class="shop-card-category">${product.category}</span>
                    <h3 class="shop-card-title">${product.name}</h3>
                    <div class="shop-card-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <p class="shop-card-desc">${product.description}</p>
                    <div class="shop-card-actions">
                        <button class="btn btn-sm add-to-cart">Add to Cart</button>
                        <button class="btn btn-sm btn-outline quick-view" data-id="${product.id}">Quick View</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    shopGrid.innerHTML = html;
} 