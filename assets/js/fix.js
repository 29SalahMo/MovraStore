/**
 * Movra Store - Bug Fixes
 * This file contains fixes for various functionality issues on the Movra store website.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fixes
    fixSearchIcon();
    fixLoginIcon();
    fixAddToCart();
    fixShopSection();
    fixInstagramFeed();
    fixNavigation();
    fixSearch();
    fixLoginSignup();
    fixAboutPage(); // Added about page fix
});

/**
 * Fix for search icon functionality
 */
function fixSearchIcon() {
    const searchIcon = document.getElementById('search-icon');
    
    if (!searchIcon) {
        console.error('Search icon not found');
        return;
    }
    
    // Create search container if it doesn't exist
    let searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'search-container';
        searchContainer.innerHTML = `
            <div class="container">
                <form class="search-form">
                    <input type="text" id="shop-search" placeholder="Search for products...">
                    <button type="button" class="clear-search-btn">&times;</button>
                    <button type="submit"><i class="fas fa-search"></i></button>
                </form>
            </div>
        `;
        
        // Insert after header
        const header = document.getElementById('main-header');
        if (header) {
            header.parentNode.insertBefore(searchContainer, header.nextSibling);
        } else {
            document.body.appendChild(searchContainer);
        }
        
        // Set up the search input
        const searchInput = searchContainer.querySelector('#shop-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                // Show/hide clear button
                const clearBtn = this.nextElementSibling;
                if (clearBtn && clearBtn.classList.contains('clear-search-btn')) {
                    clearBtn.style.display = this.value ? 'block' : 'none';
                }
                
                // Perform search
                performSearch(this.value);
            });
        }
        
        // Set up clear button
        const clearBtn = searchContainer.querySelector('.clear-search-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                const input = searchContainer.querySelector('#shop-search');
                if (input) {
                    input.value = '';
                    input.dispatchEvent(new Event('input'));
                    this.style.display = 'none';
                }
            });
        }
        
        // Handle form submission
        const form = searchContainer.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = this.querySelector('#shop-search');
                if (input) {
                    performSearch(input.value);
                    
                    // Scroll to shop section
                    const shopSection = document.getElementById('shop-section') || 
                                      document.getElementById('best-sellers');
                    if (shopSection) {
                        shopSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    }
    
    // Add click event to search icon
    searchIcon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle search container
        if (searchContainer) {
            searchContainer.classList.toggle('active');
            
            // Focus input if visible
            if (searchContainer.classList.contains('active')) {
                const input = searchContainer.querySelector('#shop-search');
                if (input) {
                    setTimeout(() => {
                        input.focus();
                    }, 100);
                }
            }
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (searchContainer && 
            searchContainer.classList.contains('active') && 
            !searchContainer.contains(e.target) && 
            e.target !== searchIcon && 
            !e.target.closest('#search-icon')) {
            searchContainer.classList.remove('active');
        }
    });
    
    // Add custom CSS for search container
    const searchStyles = `
        #search-container {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #fff;
            padding: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: none;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        #search-container.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }
        
        .search-form {
            display: flex;
            max-width: 700px;
            margin: 0 auto;
            position: relative;
        }
        
        .search-form input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
            font-size: 16px;
        }
        
        .search-form input:focus {
            outline: none;
            border-color: #4F8CFF;
        }
        
        .search-form button[type="submit"] {
            background-color: #4F8CFF;
            color: white;
            border: none;
            padding: 0 20px;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        
        .clear-search-btn {
            position: absolute;
            right: 60px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            z-index: 5;
            display: none;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.getElementById('search-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'search-styles';
        styleEl.textContent = searchStyles;
        document.head.appendChild(styleEl);
    }
}

/**
 * Fix for login icon functionality
 */
function fixLoginIcon() {
    const userIcon = document.getElementById('user-icon');
    
    if (!userIcon) {
        console.error('User icon not found');
        return;
    }
    
    // Create login modal if it doesn't exist
    let loginModal = document.getElementById('login-modal');
    if (!loginModal) {
        loginModal = document.createElement('div');
        loginModal.id = 'login-modal';
        loginModal.className = 'login-modal';
        
        loginModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Login to Your Account</h2>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" required>
                        <div id="login-email-error" class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <div class="password-input">
                            <input type="password" id="login-password" required>
                            <i class="far fa-eye toggle-password"></i>
                        </div>
                        <div id="login-password-error" class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-label">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Remember me</label>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-block">Login</button>
                    
                    <div class="form-footer">
                        <a href="#" id="forgot-password">Forgot Password?</a>
                    </div>
                </form>
                
                <div class="social-login">
                    <p>Or login with</p>
                    <div class="social-buttons">
                        <button class="social-btn google">
                            <i class="fab fa-google"></i> Google
                        </button>
                        <button class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>
                
                <div class="switch-form">
                    <p>Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginModal);
    }
    
    // Create signup modal if it doesn't exist
    let signupModal = document.getElementById('signup-modal');
    if (!signupModal) {
        signupModal = document.createElement('div');
        signupModal.id = 'signup-modal';
        signupModal.className = 'signup-modal';
        
        signupModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Create an Account</h2>
                
                <form id="signup-form">
                    <div class="form-group">
                        <label for="signup-name">Full Name</label>
                        <input type="text" id="signup-name" required>
                        <div id="signup-name-error" class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="signup-email">Email</label>
                        <input type="email" id="signup-email" required>
                        <div id="signup-email-error" class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <div class="password-input">
                            <input type="password" id="signup-password" required>
                            <i class="far fa-eye toggle-password"></i>
                        </div>
                        <div id="signup-password-error" class="error-message"></div>
                        
                        <div class="password-requirements">
                            <p>Password must contain:</p>
                            <ul>
                                <li id="length">At least 8 characters</li>
                                <li id="uppercase">At least 1 uppercase letter</li>
                                <li id="lowercase">At least 1 lowercase letter</li>
                                <li id="number">At least 1 number</li>
                                <li id="special">At least 1 special character</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="signup-confirm-password">Confirm Password</label>
                        <div class="password-input">
                            <input type="password" id="signup-confirm-password" required>
                            <i class="far fa-eye toggle-password"></i>
                        </div>
                        <div id="signup-confirm-password-error" class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <div class="checkbox-label">
                            <input type="checkbox" id="terms">
                            <label for="terms">I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></label>
                        </div>
                        <div id="terms-error" class="error-message"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-block">Create Account</button>
                </form>
                
                <div class="social-signup">
                    <p>Or sign up with</p>
                    <div class="social-buttons">
                        <button class="social-btn google">
                            <i class="fab fa-google"></i> Google
                        </button>
                        <button class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>
                
                <div class="switch-form">
                    <p>Already have an account? <a href="#" id="show-login">Login</a></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(signupModal);
    }
    
    // Create forgot password modal if it doesn't exist
    let forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (!forgotPasswordModal) {
        forgotPasswordModal = document.createElement('div');
        forgotPasswordModal.id = 'forgot-password-modal';
        forgotPasswordModal.className = 'forgot-password-modal';
        
        forgotPasswordModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Reset Your Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                <form id="forgot-password-form">
                    <div class="form-group">
                        <label for="forgot-password-email">Email</label>
                        <input type="email" id="forgot-password-email" required>
                        <div id="forgot-password-email-error" class="error-message"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-block">Send Reset Link</button>
                    
                    <div class="form-footer">
                        <a href="#" id="back-to-login">Back to Login</a>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(forgotPasswordModal);
    }
    
    // Create toast notification if it doesn't exist
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.innerHTML = `<div class="toast-message"></div>`;
        document.body.appendChild(toast);
    }
    
    // Handle user icon click
    userIcon.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor action
        
        // Force display of login modal with inline styles
        if (loginModal) {
            loginModal.style.display = 'flex';
            loginModal.style.opacity = '1';
            loginModal.style.zIndex = '9999';
            document.body.style.overflow = 'hidden';
            
            // Add active class for animation
            loginModal.classList.add('active');
            
            console.log('Login modal should be visible now');
        } else {
            console.error('Login modal not found or created');
        }
    });
    
    // Setup event listeners for all modals
    [loginModal, signupModal, forgotPasswordModal].forEach(modal => {
        if (!modal) return;
        
        // Close button handler
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Click outside modal to close
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Switch between modals
    setupModalSwitching(loginModal, signupModal, forgotPasswordModal);
    
    // Toggle password visibility
    setupPasswordToggles();
    
    // Setup form validation
    setupFormValidation();
}

/**
 * Helper function to close a modal
 * @param {Element} modal - The modal to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Helper function to setup modal switching
 * @param {Element} loginModal - The login modal
 * @param {Element} signupModal - The signup modal
 * @param {Element} forgotPasswordModal - The forgot password modal
 */
function setupModalSwitching(loginModal, signupModal, forgotPasswordModal) {
    // Switch from login to signup
    const showSignupLink = document.getElementById('show-signup');
    if (showSignupLink && loginModal && signupModal) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            closeModal(loginModal);
            setTimeout(() => {
                signupModal.style.display = 'flex';
                signupModal.style.opacity = '1';
                signupModal.style.zIndex = '9999';
                signupModal.classList.add('active');
            }, 300);
        });
    }
    
    // Switch from signup to login
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink && loginModal && signupModal) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            closeModal(signupModal);
            setTimeout(() => {
                loginModal.style.display = 'flex';
                loginModal.style.opacity = '1';
                loginModal.style.zIndex = '9999';
                loginModal.classList.add('active');
            }, 300);
        });
    }
    
    // Switch from login to forgot password
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink && loginModal && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            closeModal(loginModal);
            setTimeout(() => {
                forgotPasswordModal.style.display = 'flex';
                forgotPasswordModal.style.opacity = '1';
                forgotPasswordModal.style.zIndex = '9999';
                forgotPasswordModal.classList.add('active');
            }, 300);
        });
    }
    
    // Switch from forgot password to login
    const backToLoginLink = document.getElementById('back-to-login');
    if (backToLoginLink && loginModal && forgotPasswordModal) {
        backToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            closeModal(forgotPasswordModal);
            setTimeout(() => {
                loginModal.style.display = 'flex';
                loginModal.style.opacity = '1';
                loginModal.style.zIndex = '9999';
                loginModal.classList.add('active');
            }, 300);
        });
    }
}

/**
 * Setup password toggle functionality
 */
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Password strength checking
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            
            // Check each requirement
            const lengthRequirement = document.getElementById('length');
            const uppercaseRequirement = document.getElementById('uppercase');
            const lowercaseRequirement = document.getElementById('lowercase');
            const numberRequirement = document.getElementById('number');
            const specialRequirement = document.getElementById('special');
            
            if (lengthRequirement) lengthRequirement.classList.toggle('valid', password.length >= 8);
            if (uppercaseRequirement) uppercaseRequirement.classList.toggle('valid', /[A-Z]/.test(password));
            if (lowercaseRequirement) lowercaseRequirement.classList.toggle('valid', /[a-z]/.test(password));
            if (numberRequirement) numberRequirement.classList.toggle('valid', /[0-9]/.test(password));
            if (specialRequirement) specialRequirement.classList.toggle('valid', /[^A-Za-z0-9]/.test(password));
        });
    }
}

/**
 * Fix for add to cart functionality
 */
function fixAddToCart() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Update cart count on page load
    updateCartCount();
    
    // Handle add to cart button clicks
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart, .btn.add-to-cart, #modal-add-to-cart, .add-to-cart-shop');
        
        if (!addToCartBtn) return;
        
        e.preventDefault();
        
        // Get product information
        const productCard = addToCartBtn.closest('.shop-card');
        if (!productCard) return;
        
        const productId = parseInt(productCard.getAttribute('data-id')) || Math.floor(Math.random() * 1000);
        const productName = productCard.querySelector('.shop-card-title')?.textContent || 'Product';
        const productPrice = parseFloat(productCard.querySelector('.current-price')?.textContent?.replace('$', '')) || 99.99;
        const productImage = productCard.querySelector('img')?.getAttribute('src') || '';
        
        // Create product object
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Check if product already in cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex >= 0) {
            // Increase quantity if product already in cart
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showToast('Item added to cart!');
        
        // Do fly-to-cart animation if using animations.js
        // Animation is already handled in animations.js
    });
    
    // Render cart items in cart drawer
    renderCartDrawer();
    
    // Setup cart icon click handler
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) {
                cartDrawer.classList.add('open');
                
                // Rerender cart contents when opening
                renderCartDrawer();
                
                // Add overlay if it doesn't exist
                let overlay = document.querySelector('.cart-drawer-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'modal-overlay cart-drawer-overlay';
                    document.body.appendChild(overlay);
                    
                    overlay.addEventListener('click', function() {
                        cartDrawer.classList.remove('open');
                        this.classList.remove('active');
                    });
                }
                
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Setup cart drawer close button
    const cartDrawerClose = document.getElementById('cart-drawer-close');
    if (cartDrawerClose) {
        cartDrawerClose.addEventListener('click', function() {
            const cartDrawer = document.getElementById('cart-drawer');
            const overlay = document.querySelector('.cart-drawer-overlay');
            
            if (cartDrawer) {
                cartDrawer.classList.remove('open');
            }
            
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        });
    }
    
    // Setup empty cart button
    const emptyCartBtn = document.getElementById('empty-cart');
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', function() {
            cart = [];
            localStorage.setItem('cartItems', JSON.stringify(cart));
            renderCartDrawer();
            updateCartCount();
        });
    }
    
    // Setup continue shopping button
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            const cartDrawer = document.getElementById('cart-drawer');
            const overlay = document.querySelector('.cart-drawer-overlay');
            
            if (cartDrawer) {
                cartDrawer.classList.remove('open');
            }
            
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        });
    }
}

/**
 * Update cart count
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElement = document.querySelector('#cart-icon .count');
    
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

/**
 * Render cart drawer with items
 */
function renderCartDrawer() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-drawer-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTaxElement = document.getElementById('cart-tax');
    const cartTotalElement = document.getElementById('cart-drawer-total');
    const cartCountElement = document.getElementById('cart-count');
    
    if (!cartItemsContainer) return;
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    // Update cart count in drawer if exists
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty</p>
                <button id="continue-shopping-empty" class="btn btn-outline">Continue Shopping</button>
            </div>
        `;
        
        // Update totals
        if (cartSubtotalElement) cartSubtotalElement.textContent = '$0.00';
        if (cartShippingElement) cartShippingElement.textContent = '$0.00';
        if (cartTaxElement) cartTaxElement.textContent = '$0.00';
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        
        // Setup continue shopping button
        setTimeout(() => {
            const continueShoppingEmptyBtn = document.getElementById('continue-shopping-empty');
            if (continueShoppingEmptyBtn) {
                continueShoppingEmptyBtn.addEventListener('click', function() {
                    const cartDrawer = document.getElementById('cart-drawer');
                    const overlay = document.querySelector('.cart-drawer-overlay');
                    
                    if (cartDrawer) {
                        cartDrawer.classList.remove('open');
                    }
                    
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    
                    document.body.style.overflow = '';
                });
            }
        }, 100);
        
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    // Add each cart item
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.setAttribute('data-id', item.id);
        
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">
                    <span class="current-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateCartItemQuantity(${item.id}, -1)">-</button>
                        <input type="number" class="quantity-input" min="1" max="99" value="${item.quantity}" 
                            onchange="updateCartItemQuantity(${item.id}, 0, this.value)">
                        <button class="quantity-btn plus" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeCartItem(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-subtotal">
                <span>Subtotal:</span>
                <span class="subtotal-amount">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update totals
    if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (cartShippingElement) cartShippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (cartTaxElement) cartTaxElement.textContent = `$${tax.toFixed(2)}`;
    if (cartTotalElement) cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Fix for shop section
 */
function fixShopSection() {
    // Find shop section container
    const shopSection = document.getElementById('shop-section');
    
    // If shop section doesn't exist, create one
    if (!shopSection) {
        // Look for a suitable location to add the shop section
        const bestSellers = document.getElementById('best-sellers');
        const instagramSection = document.querySelector('.instagram');
        
        let insertAfter = bestSellers || instagramSection;
        
        if (!insertAfter) {
            // If no suitable section found, insert after hero
            insertAfter = document.querySelector('.hero');
        }
        
        if (!insertAfter) return; // Can't find a place to insert
        
        // Create shop section
        const shopSectionElement = document.createElement('section');
        shopSectionElement.id = 'shop-section';
        shopSectionElement.className = 'section';
        
        shopSectionElement.innerHTML = `
            <div class="container">
                <div class="section-title">
                    <h2>Shop Our Collection</h2>
                </div>
                
                <div class="shop-grid">
                    <!-- Products will be dynamically loaded here -->
                </div>
            </div>
        `;
        
        // Insert shop section after selected element
        insertAfter.parentNode.insertBefore(shopSectionElement, insertAfter.nextSibling);
        
        // Load products for shop section
        populateShopGrid();
    } else {
        // If shop section exists, but might be empty
        const shopGrid = shopSection.querySelector('.shop-grid');
        
        if (shopGrid && shopGrid.children.length === 0) {
            populateShopGrid(shopGrid);
        }
    }
}

/**
 * Populate shop grid with products
 * @param {Element} shopGridElement - Optional shop grid element
 */
function populateShopGrid(shopGridElement) {
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
        }
    ];
    
    // Find shop grid or use provided element
    const shopGrid = shopGridElement || document.querySelector('#shop-section .shop-grid');
    
    if (!shopGrid) return;
    
    // Build HTML for shop products
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
    
    // Insert products into shop grid
    shopGrid.innerHTML = html;
}

/**
 * Fix for Instagram feed
 */
function fixInstagramFeed() {
    const instagramFeed = document.querySelector('.instagram-feed');
    
    if (!instagramFeed || instagramFeed.children.length > 0) return;
    
    // Populate Instagram feed with placeholder images
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
    
    instagramFeed.innerHTML = instaHTML;
}

/**
 * Show toast notification
 * @param {string} message - Message to display in toast
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Update cart item quantity
 * @param {number} id - Product ID
 * @param {number} delta - Quantity change amount
 * @param {number} newQuantity - New quantity value (optional)
 */
window.updateCartItemQuantity = function(id, delta = 0, newQuantity = null) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return;
    
    if (newQuantity !== null) {
        // Set exact quantity
        cart[itemIndex].quantity = parseInt(newQuantity);
    } else {
        // Adjust quantity by delta
        cart[itemIndex].quantity += delta;
    }
    
    // Remove item if quantity is zero or less
    if (cart[itemIndex].quantity < 1) {
        cart.splice(itemIndex, 1);
    }
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Update UI
    renderCartDrawer();
    updateCartCount();
};

/**
 * Remove item from cart
 * @param {number} id - Product ID
 */
window.removeCartItem = function(id) {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    cart = cart.filter(item => item.id !== id);
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Update UI
    renderCartDrawer();
    updateCartCount();
};

/**
 * Fix for navigation links
 */
function fixNavigation() {
    // Find the navigation menu
    const mainNav = document.getElementById('main-nav');
    
    if (!mainNav) {
        console.error('Navigation menu not found');
        return;
    }
    
    // Check if navigation has a ul element
    if (!mainNav.querySelector('ul')) {
        // Create navigation list if it doesn't exist
        const navList = document.createElement('ul');
        navList.className = 'nav-list';
        
        // Add navigation items
        navList.innerHTML = `
            <li><a href="#home" class="nav-link active">Home</a></li>
            <li><a href="#shop-section" class="nav-link">Shop</a></li>
            <li><a href="#forhim" class="nav-link">For Him</a></li>
            <li><a href="#forher" class="nav-link">For Her</a></li>
            <li><a href="#giftset" class="nav-link">Gift Set</a></li>
            <li><a href="#about" class="nav-link">About</a></li>
        `;
        
        // Append to navigation
        mainNav.appendChild(navList);
    }
    
    // Get all navigation links
    const navLinks = mainNav.querySelectorAll('.nav-link');
    
    // Check if For Him, For Her, and Gift Set sections exist
    let forHimSection = document.getElementById('forhim');
    let forHerSection = document.getElementById('forher');
    let giftSetSection = document.getElementById('giftset');
    
    // Create sections if they don't exist
    if (!forHimSection) {
        forHimSection = createProductSection('forhim', 'For Him', 'For Him');
    }
    
    if (!forHerSection) {
        forHerSection = createProductSection('forher', 'For Her', 'For Her');
    }
    
    if (!giftSetSection) {
        giftSetSection = createProductSection('giftset', 'Gift Sets', 'Gift Set');
    }
    
    // Make sure navigation links are working
    navLinks.forEach(link => {
        // Add active class when clicked
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section ID
            const targetId = this.getAttribute('href');
            
            // Scroll to the target section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('main-nav');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const overlay = document.querySelector('.menu-overlay');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fix for mobile menu toggle
    let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    // Create mobile menu button if it doesn't exist
    if (!mobileMenuBtn) {
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        
        // Find header where to insert the button
        const header = document.getElementById('main-header');
        if (header) {
            const headerInner = header.querySelector('.header-inner') || header;
            // Insert before the logo or as first child
            const logo = headerInner.querySelector('.logo');
            if (logo) {
                headerInner.insertBefore(mobileMenuBtn, logo);
            } else {
                headerInner.insertBefore(mobileMenuBtn, headerInner.firstChild);
            }
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Add overlay if it doesn't exist
            let overlay = document.querySelector('.menu-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                document.body.appendChild(overlay);
                
                // Close menu when clicking overlay
                overlay.addEventListener('click', function() {
                    mainNav.classList.remove('active');
                    this.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            // Toggle overlay
            if (mainNav.classList.contains('active')) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add mobile menu CSS if not present
    const mobileMenuStyles = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 10px;
            z-index: 1002;
        }
        
        .mobile-menu-btn span {
            display: block;
            width: 25px;
            height: 3px;
            background-color: #333;
            margin: 5px 0;
            transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
            
            #main-nav {
                position: fixed;
                top: 0;
                left: -300px;
                width: 280px;
                height: 100vh;
                background-color: #fff;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                z-index: 1001;
                transition: left 0.3s ease;
                padding-top: 70px;
            }
            
            #main-nav.active {
                left: 0;
            }
            
            #main-nav ul {
                flex-direction: column;
                padding: 0 20px;
            }
            
            #main-nav ul li {
                margin: 15px 0;
            }
        }
    `;
    
    // Add styles to head if not already present
    if (!document.getElementById('mobile-menu-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'mobile-menu-styles';
        styleEl.textContent = mobileMenuStyles;
        document.head.appendChild(styleEl);
    }
}

/**
 * Create a product category section
 * @param {string} id - Section ID
 * @param {string} title - Section title
 * @param {string} category - Product category
 * @returns {Element} - The created section element
 */
function createProductSection(id, title, category) {
    // Find shop section to insert after
    const shopSection = document.getElementById('shop-section');
    const bestSellers = document.getElementById('best-sellers');
    const insertAfter = shopSection || bestSellers || document.querySelector('.hero');
    
    if (!insertAfter) return null;
    
    // Create section element
    const sectionElement = document.createElement('section');
    sectionElement.id = id;
    sectionElement.className = 'section';
    
    // Get products for this category
    const products = getProductsByCategory(category);
    
    // Create section HTML
    sectionElement.innerHTML = `
        <div class="container">
            <div class="section-title">
                <h2>${title}</h2>
            </div>
            
            <div class="products-grid shop-grid">
                ${generateProductsHTML(products)}
            </div>
        </div>
    `;
    
    // Insert section after shop section
    insertAfter.parentNode.insertBefore(sectionElement, insertAfter.nextSibling);
    
    return sectionElement;
}

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Array} - Array of product objects
 */
function getProductsByCategory(category) {
    // Product data filtered by category
    const allProducts = [
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
            category: "Gift Set",
            price: 74.99,
            originalPrice: 94.99,
            description: "Vibrant citrus notes with delicate floral undertones for a fresh, versatile fragrance.",
            image: "assets/images/products/generated-image-1 (6).png"
        },
        {
            id: 8,
            name: "Sandalwood Dreams",
            category: "Gift Set",
            price: 89.99,
            originalPrice: 119.99,
            description: "Warm sandalwood blended with vanilla and musk for a comforting, dreamy experience.",
            image: "assets/images/products/generated-image-1 (7).png"
        }
    ];
    
    // Filter products by category
    return allProducts.filter(product => product.category === category);
}

/**
 * Generate HTML for product cards
 * @param {Array} products - Array of product objects
 * @returns {string} - HTML string for product cards
 */
function generateProductsHTML(products) {
    if (!products || products.length === 0) {
        return '<p class="text-center">No products found.</p>';
    }
    
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
    
    return html;
}

/**
 * Fix for search functionality
 */
function fixSearch() {
    // Setup search input event listener
    const searchContainer = document.getElementById('search-container');
    const searchInput = searchContainer?.querySelector('input') || document.getElementById('shop-search');
    
    if (!searchInput) {
        // Create search input if it doesn't exist
        const searchIcon = document.getElementById('search-icon');
        if (searchIcon) {
            searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create search container if it doesn't exist
                let container = document.getElementById('search-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'search-container';
                    container.className = 'active';
                    container.innerHTML = `
                        <div class="container">
                            <form class="search-form">
                                <input type="text" id="shop-search" placeholder="Search products...">
                                <button class="clear-search-btn" type="button">&times;</button>
                                <button type="submit"><i class="fas fa-search"></i></button>
                            </form>
                        </div>
                    `;
                    
                    // Insert after header
                    const header = document.getElementById('main-header');
                    if (header) {
                        header.parentNode.insertBefore(container, header.nextSibling);
                    } else {
                        document.body.appendChild(container);
                    }
                    
                    // Set up search functionality
                    const newInput = document.getElementById('shop-search');
                    setupSearchHandlers(newInput);
                    
                    // Set up form submit handling
                    const form = container.querySelector('form');
                    if (form) {
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            performSearch(newInput.value);
                        });
                    }
                    
                    // Set up clear button
                    const clearBtn = container.querySelector('.clear-search-btn');
                    if (clearBtn) {
                        clearBtn.addEventListener('click', function() {
                            newInput.value = '';
                            newInput.dispatchEvent(new Event('input'));
                            this.style.display = 'none';
                        });
                    }
                    
                    // Focus on input
                    setTimeout(() => {
                        newInput.focus();
                    }, 100);
                } else {
                    container.classList.toggle('active');
                    if (container.classList.contains('active')) {
                        const input = container.querySelector('#shop-search');
                        if (input) {
                            setTimeout(() => {
                                input.focus();
                            }, 100);
                        }
                    }
                }
            });
        }
    } else {
        setupSearchHandlers(searchInput);
    }
}

/**
 * Setup search handlers for an input element
 * @param {HTMLInputElement} inputElement - The search input element
 */
function setupSearchHandlers(inputElement) {
    if (!inputElement) return;
    
    // Handle input events
    inputElement.addEventListener('input', function() {
        performSearch(this.value);
        
        // Show/hide clear button if exists
        const clearBtn = this.parentNode.querySelector('.clear-search-btn');
        if (clearBtn) {
            clearBtn.style.display = this.value ? 'block' : 'none';
        }
    });
    
    // Handle form submission
    const form = inputElement.closest('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(inputElement.value);
            
            // Scroll to shop section
            const shopSection = document.getElementById('shop-section') || 
                                document.getElementById('best-sellers');
            if (shopSection) {
                shopSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Perform search on products
 * @param {string} searchTerm - The search term
 */
function performSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    
    // Find all product cards
    const productCards = document.querySelectorAll('.shop-card, .product-card');
    let foundProducts = false;
    
    productCards.forEach(card => {
        const title = card.querySelector('.shop-card-title')?.textContent.toLowerCase() || '';
        const category = card.querySelector('.shop-card-category, .product-category')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.shop-card-desc')?.textContent.toLowerCase() || '';
        
        if (searchTerm === '' || 
            title.includes(searchTerm) || 
            category.includes(searchTerm) || 
            description.includes(searchTerm)) {
            card.style.display = '';
            foundProducts = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Handle no results message
    const productContainers = document.querySelectorAll('.shop-grid, .products-grid, .products-slider');
    
    productContainers.forEach(container => {
        // Count visible products in this container
        let visibleCount = 0;
        container.querySelectorAll('.shop-card, .product-card').forEach(card => {
            if (card.style.display !== 'none') {
                visibleCount++;
            }
        });
        
        // Check if container already has a no-results message
        let noResultsMsg = container.querySelector('.no-results-message');
        
        if (visibleCount === 0 && searchTerm !== '') {
            // No visible products, show message
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                container.appendChild(noResultsMsg);
            }
            
            noResultsMsg.innerHTML = `
                <p>No products found matching "${searchTerm}"</p>
                <button class="btn btn-sm clear-search">Clear Search</button>
            `;
            noResultsMsg.style.display = 'block';
            
            // Add event listener to clear search button
            const clearBtn = noResultsMsg.querySelector('.clear-search');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    const searchInput = document.getElementById('shop-search');
                    if (searchInput) {
                        searchInput.value = '';
                        searchInput.dispatchEvent(new Event('input'));
                    }
                });
            }
        } else if (noResultsMsg) {
            // Hide message if there are products or empty search
            noResultsMsg.style.display = 'none';
        }
    });
    
    // Create a global search results message if nothing found
    if (!foundProducts && searchTerm !== '' && productCards.length > 0) {
        let globalSearchMsg = document.getElementById('global-search-message');
        
        if (!globalSearchMsg) {
            globalSearchMsg = document.createElement('div');
            globalSearchMsg.id = 'global-search-message';
            globalSearchMsg.className = 'global-search-message';
            
            // Insert before main shop section or best sellers
            const insertPoint = document.getElementById('shop-section') || 
                               document.getElementById('best-sellers');
            
            if (insertPoint) {
                insertPoint.parentNode.insertBefore(globalSearchMsg, insertPoint);
            } else {
                // Fallback to appending to body
                document.body.appendChild(globalSearchMsg);
            }
        }
        
        globalSearchMsg.innerHTML = `
            <div class="container">
                <h2>Search Results for "${searchTerm}"</h2>
                <p>No products found. Try a different search term or browse our categories.</p>
                <button class="btn clear-search">Clear Search</button>
            </div>
        `;
        globalSearchMsg.style.display = 'block';
        
        // Add event listener to clear button
        const clearBtn = globalSearchMsg.querySelector('.clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                const searchInput = document.getElementById('shop-search');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    globalSearchMsg.style.display = 'none';
                }
            });
        }
    } else {
        const globalSearchMsg = document.getElementById('global-search-message');
        if (globalSearchMsg) {
            globalSearchMsg.style.display = 'none';
        }
    }
}

/**
 * Fix About page functionality
 */
function fixAboutPage() {
    // Get about link and about page elements
    const aboutLink = document.querySelector('a[href="#about"]');
    const aboutPage = document.getElementById('about-page');
    const aboutSection = document.getElementById('about');
    
    // Setup click handler for about link
    if (aboutLink && (aboutPage || aboutSection)) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (aboutPage) {
                // Show about page
                aboutPage.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            } else if (aboutSection) {
                // Scroll to about section
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Setup return to store button
    const returnToStoreBtn = document.getElementById('return-to-store');
    if (returnToStoreBtn && aboutPage) {
        returnToStoreBtn.addEventListener('click', function() {
            aboutPage.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Setup close button
    const closeAboutBtn = document.getElementById('close-about');
    if (closeAboutBtn && aboutPage) {
        closeAboutBtn.addEventListener('click', function() {
            aboutPage.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Add CSS for about page if needed
    const aboutStyles = `
        #about-page {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.95);
            z-index: 2000;
            display: none;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            padding: 40px 20px;
        }
        
        #about-page .about-content {
            background-color: white;
            max-width: 800px;
            width: 100%;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        
        #close-about {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #777;
            transition: color 0.2s ease;
        }
        
        #close-about:hover {
            color: #333;
        }
        
        .movra-logo {
            width: 80px;
            height: auto;
            margin-bottom: 10px;
        }
    `;
    
    // Add styles if not already present
    if (!document.getElementById('about-page-styles') && aboutPage) {
        const styleEl = document.createElement('style');
        styleEl.id = 'about-page-styles';
        styleEl.textContent = aboutStyles;
        document.head.appendChild(styleEl);
    }
}

/**
 * Fix for login and signup modals
 */
function fixLoginSignup() {
    // Get modal elements
    const userIcon = document.getElementById('user-icon');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    
    // Open login modal when user icon is clicked
    if (userIcon && loginModal) {
        userIcon.addEventListener('click', function() {
            showModal(loginModal);
        });
    }
    
    // Handle close buttons for modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.login-modal, .signup-modal, .forgot-password-modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });
    
    // Toggle between login and signup
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    
    if (showSignup && loginModal && signupModal) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(loginModal);
            showModal(signupModal);
        });
    }
    
    if (showLogin && loginModal && signupModal) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(signupModal);
            showModal(loginModal);
        });
    }
    
    // Handle forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password');
    const backToLoginLink = document.getElementById('back-to-login');
    
    if (forgotPasswordLink && loginModal && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(loginModal);
            showModal(forgotPasswordModal);
        });
    }
    
    if (backToLoginLink && loginModal && forgotPasswordModal) {
        backToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(forgotPasswordModal);
            showModal(loginModal);
        });
    }
    
    // Handle form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Validate email and password
            let isValid = true;
            
            if (!validateEmail(email)) {
                showError('login-email-error', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('login-email-error');
            }
            
            if (!password || password.length < 6) {
                showError('login-password-error', 'Password must be at least 6 characters');
                isValid = false;
            } else {
                clearError('login-password-error');
            }
            
            if (isValid) {
                // Mock login functionality
                mockLogin(email);
                hideModal(loginModal);
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate form fields
            let isValid = true;
            
            if (!name || name.length < 3) {
                showError('signup-name-error', 'Please enter your full name');
                isValid = false;
            } else {
                clearError('signup-name-error');
            }
            
            if (!validateEmail(email)) {
                showError('signup-email-error', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('signup-email-error');
            }
            
            if (!validatePassword(password)) {
                showError('signup-password-error', 'Password does not meet requirements');
                isValid = false;
            } else {
                clearError('signup-password-error');
            }
            
            if (password !== confirmPassword) {
                showError('signup-confirm-password-error', 'Passwords do not match');
                isValid = false;
            } else {
                clearError('signup-confirm-password-error');
            }
            
            if (!terms) {
                showError('terms-error', 'You must agree to the Terms & Conditions');
                isValid = false;
            } else {
                clearError('terms-error');
            }
            
            if (isValid) {
                // Mock signup functionality
                mockSignup(name, email);
                hideModal(signupModal);
                showModal(loginModal);
                showToast('Account created successfully! Please login.');
            }
        });
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-password-email').value;
            
            // Validate email
            if (!validateEmail(email)) {
                showError('forgot-password-email-error', 'Please enter a valid email address');
            } else {
                clearError('forgot-password-email-error');
                hideModal(forgotPasswordModal);
                showToast('Password reset link sent to your email');
            }
        });
    }
    
    // Password toggle visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Password validation highlighting
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            
            // Check each requirement
            document.getElementById('length').classList.toggle('valid', password.length >= 8);
            document.getElementById('uppercase').classList.toggle('valid', /[A-Z]/.test(password));
            document.getElementById('lowercase').classList.toggle('valid', /[a-z]/.test(password));
            document.getElementById('number').classList.toggle('valid', /[0-9]/.test(password));
            document.getElementById('special').classList.toggle('valid', /[^A-Za-z0-9]/.test(password));
        });
    }
}

/**
 * Show a modal
 * @param {Element} modal - The modal element to show
 */
function showModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

/**
 * Hide a modal
 * @param {Element} modal - The modal element to hide
 */
function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Show error message
 * @param {string} id - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(id, message) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Clear error message
 * @param {string} id - The ID of the error message element
 */
function clearError(id) {
    const errorElement = document.getElementById(id);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password meets requirements
 */
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return re.test(password);
}

/**
 * Mock login functionality
 * @param {string} email - The user's email
 */
function mockLogin(email) {
    // Store user info in localStorage
    const user = {
        email: email,
        loggedIn: true,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update UI for logged in user
    updateUserUI(true);
    
    // Show success message
    showToast('Login successful!');
}

/**
 * Mock signup functionality
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 */
function mockSignup(name, email) {
    // Store new user in localStorage
    const user = {
        name: name,
        email: email,
        registered: true,
        registrationTime: new Date().toISOString()
    };
    localStorage.setItem('newUser', JSON.stringify(user));
}

/**
 * Update UI based on user login status
 * @param {boolean} isLoggedIn - Whether the user is logged in
 */
function updateUserUI(isLoggedIn) {
    const userIcon = document.getElementById('user-icon');
    
    if (userIcon) {
        if (isLoggedIn) {
            userIcon.classList.remove('fa-user');
            userIcon.classList.add('fa-user-check');
            userIcon.title = 'My Account';
        } else {
            userIcon.classList.remove('fa-user-check');
            userIcon.classList.add('fa-user');
            userIcon.title = 'Login / Signup';
        }
    }
}

/**
 * Setup form validation and submission
 */
function setupFormValidation() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Validate inputs
            let isValid = true;
            
            if (!email || !validateEmail(email)) {
                const errorEl = document.getElementById('login-email-error');
                if (errorEl) {
                    errorEl.textContent = 'Please enter a valid email address';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('login-email-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (!password || password.length < 6) {
                const errorEl = document.getElementById('login-password-error');
                if (errorEl) {
                    errorEl.textContent = 'Password must be at least 6 characters';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('login-password-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (isValid) {
                // Mock successful login
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.remove('active');
                    setTimeout(() => {
                        loginModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                }
                
                // Store user in localStorage
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    loggedIn: true
                }));
                
                // Update UI
                const userIcon = document.getElementById('user-icon');
                if (userIcon) {
                    userIcon.classList.remove('fa-user');
                    userIcon.classList.add('fa-user-check');
                    userIcon.title = 'My Account';
                }
                
                // Show success message
                showToast('Login successful!');
            }
        });
    }
    
    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const terms = document.getElementById('terms')?.checked;
            
            // Validate inputs
            let isValid = true;
            
            if (!name || name.length < 3) {
                const errorEl = document.getElementById('signup-name-error');
                if (errorEl) {
                    errorEl.textContent = 'Please enter your full name';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('signup-name-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (!email || !validateEmail(email)) {
                const errorEl = document.getElementById('signup-email-error');
                if (errorEl) {
                    errorEl.textContent = 'Please enter a valid email address';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('signup-email-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (!password || password.length < 8) {
                const errorEl = document.getElementById('signup-password-error');
                if (errorEl) {
                    errorEl.textContent = 'Password must be at least 8 characters';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('signup-password-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (password !== confirmPassword) {
                const errorEl = document.getElementById('signup-confirm-password-error');
                if (errorEl) {
                    errorEl.textContent = 'Passwords do not match';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('signup-confirm-password-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (!terms) {
                const errorEl = document.getElementById('terms-error');
                if (errorEl) {
                    errorEl.textContent = 'You must agree to the Terms & Conditions';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                const errorEl = document.getElementById('terms-error');
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }
            
            if (isValid) {
                // Mock successful signup
                const signupModal = document.getElementById('signup-modal');
                if (signupModal) {
                    signupModal.classList.remove('active');
                    setTimeout(() => {
                        signupModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                }
                
                // Show success message
                showToast('Account created successfully!');
            }
        });
    }
    
    // Forgot password form validation
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-password-email').value;
            
            // Validate email
            if (!email || !validateEmail(email)) {
                const errorEl = document.getElementById('forgot-password-email-error');
                if (errorEl) {
                    errorEl.textContent = 'Please enter a valid email address';
                    errorEl.style.display = 'block';
                }
                return;
            }
            
            // Mock successful password reset
            const forgotPasswordModal = document.getElementById('forgot-password-modal');
            if (forgotPasswordModal) {
                forgotPasswordModal.classList.remove('active');
                setTimeout(() => {
                    forgotPasswordModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }
            
            // Show success message
            showToast('Password reset link sent to your email');
        });
    }
}

// Apply CSS fixes
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Navigation menu fixes */
    #main-nav {
        display: block;
    }
    
    #main-nav ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    #main-nav ul li {
        margin: 0 15px;
    }
    
    .nav-link {
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 5px 0;
        position: relative;
        transition: color 0.3s ease;
        text-decoration: none;
    }
    
    .nav-link:hover, .nav-link.active {
        color: #3498db;
    }
    
    .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #3498db;
        transition: width 0.3s ease;
    }
    
    .nav-link:hover::after, .nav-link.active::after {
        width: 100%;
    }
    
    /* Mobile menu styles */
    @media (max-width: 767px) {
        .mobile-menu-btn {
            display: block;
        }
        
        #main-nav {
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100vh;
            background-color: #fff;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            transition: left 0.3s ease;
            overflow-y: auto;
        }
        
        #main-nav.active {
            left: 0;
        }
        
        #main-nav ul {
            flex-direction: column;
            padding: 80px 20px 20px;
        }
        
        #main-nav ul li {
            margin: 0 0 20px 0;
        }
        
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }
    }

    /* Products grid layout */
    .products-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1.5rem;
    }
    
    @media (min-width: 576px) {
        .products-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (min-width: 992px) {
        .products-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    /* Instagram feed styles */
    .instagram-feed {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }
    
    @media (min-width: 576px) {
        .instagram-feed {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    
    @media (min-width: 768px) {
        .instagram-feed {
            grid-template-columns: repeat(6, 1fr);
        }
    }
    
    .instagram-item {
        position: relative;
        aspect-ratio: 1/1;
        overflow: hidden;
    }
    
    .instagram-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .instagram-item:hover img {
        transform: scale(1.1);
    }
    
    .instagram-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(44, 62, 80, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .instagram-item:hover .instagram-overlay {
        opacity: 1;
    }
    
    .instagram-overlay i {
        color: white;
        font-size: 1.5rem;
    }

    /* Cart drawer styles */
    #cart-drawer {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        max-width: 100%;
        height: 100vh;
        background-color: #fff;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        z-index: 1050;
        transition: right 0.3s ease;
        display: flex;
        flex-direction: column;
    }
    
    #cart-drawer.open {
        right: 0;
    }
    
    #cart-drawer-header {
        padding: 1rem;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    #cart-drawer-close {
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.3s ease;
    }
    
    #cart-drawer-close:hover {
        transform: rotate(90deg);
    }
    
    #cart-drawer-items {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    
    #cart-drawer-footer {
        padding: 1rem;
        border-top: 1px solid #ddd;
    }
    
    .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #ddd;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .cart-item-image img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    /* Mobile responsiveness for cart drawer */
    @media (max-width: 576px) {
        #cart-drawer {
            width: 100%;
        }
        
        .cart-item {
            grid-template-columns: 60px 1fr;
            grid-template-rows: auto auto;
        }
        
        .cart-item-subtotal {
            grid-column: 1/-1;
            display: flex;
            justify-content: space-between;
            padding-top: 0.5rem;
            margin-top: 0.5rem;
            border-top: 1px dashed #eee;
        }
    }
    
    .modal-overlay, .cart-drawer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1040;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .modal-overlay.active, .cart-drawer-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    /* Search container styles */
    #search-container {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 1rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: none;
    }
    
    #search-container.active {
        display: block;
        animation: fadeInDown 0.3s ease;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .search-form {
        display: flex;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
    }
    
    .search-form input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 4px 0 0 4px;
        font-size: 16px;
        transition: border-color 0.3s ease;
    }
    
    .search-form input:focus {
        outline: none;
        border-color: #4F8CFF;
    }
    
    .search-form button[type="submit"] {
        background-color: #4F8CFF;
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .search-form button[type="submit"]:hover {
        background-color: #3a78e7;
    }
    
    .clear-search-btn {
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        z-index: 5;
    }
    
    .clear-search-btn:hover {
        color: #333;
    }
    
    /* No results message */
    .no-results-message {
        text-align: center;
        padding: 30px;
        color: #666;
        background-color: rgba(0,0,0,0.02);
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .no-results-message p {
        margin-bottom: 15px;
        font-size: 16px;
    }
    
    .no-results-message .btn {
        display: inline-block;
        background-color: #4F8CFF;
        color: white;
        padding: 8px 15px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        border: none;
    }
    
    /* Toast notification */
    #toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2c3e50;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1050;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    }
    
    #toast.show {
        opacity: 1;
        visibility: visible;
    }
    
    /* Login/Signup modals */
    .login-modal, .signup-modal, .forgot-password-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .login-modal.active, .signup-modal.active, .forgot-password-modal.active {
        opacity: 1;
    }
    
    .login-modal .modal-content, .signup-modal .modal-content, .forgot-password-modal .modal-content {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
        position: relative;
    }
    
    .login-modal .close-modal, .signup-modal .close-modal, .forgot-password-modal .close-modal {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 1.5rem;
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    }
    
    .login-modal .close-modal:hover, .signup-modal .close-modal:hover, .forgot-password-modal .close-modal:hover {
        color: #333;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        display: none;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .checkbox-label input {
        margin-top: 3px;
    }
    
    .social-login, .social-signup {
        margin-top: 1.5rem;
        text-align: center;
    }
    
    .social-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .social-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 15px;
        border-radius: 4px;
        border: none;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .social-btn.google {
        background-color: #DB4437;
        color: white;
    }
    
    .social-btn.facebook {
        background-color: #4267B2;
        color: white;
    }
    
    .social-btn:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }
    
    .switch-form {
        margin-top: 1rem;
        text-align: center;
        font-size: 0.9rem;
    }
    
    .switch-form a {
        color: #4F8CFF;
        font-weight: 600;
    }
    
    .password-input {
        position: relative;
    }
    
    .toggle-password {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #777;
    }
    
    .password-requirements {
        margin-top: 0.5rem;
        padding: 0.75rem;
        background-color: #f9f9f9;
        border-radius: 4px;
        font-size: 0.85rem;
    }
    
    .password-requirements p {
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .password-requirements ul {
        padding-left: 1.5rem;
        margin: 0;
    }
    
    .password-requirements li {
        margin-bottom: 0.25rem;
        color: #777;
    }
    
    .password-requirements li.valid {
        color: #2ecc71;
    }
    
    .password-requirements li.valid::before {
        content: "✓ ";
    }

    /* Critical Login/Signup Modal Styles */
    .login-modal, .signup-modal, .forgot-password-modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        z-index: 9999 !important;
        display: none;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0;
        transition: opacity 0.3s ease !important;
        overflow-y: auto !important;
        padding: 20px !important;
    }

    .login-modal.active, .signup-modal.active, .forgot-password-modal.active {
        opacity: 1 !important;
    }

    .login-modal .modal-content, .signup-modal .modal-content, .forgot-password-modal .modal-content {
        background-color: #fff !important;
        padding: 30px !important;
        border-radius: 8px !important;
        max-width: 450px !important;
        width: 100% !important;
        position: relative !important;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        animation: modalFadeIn 0.3s ease !important;
    }

    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .login-modal h2, .signup-modal h2, .forgot-password-modal h2 {
        margin-top: 0 !important;
        margin-bottom: 20px !important;
        font-size: 24px !important;
        text-align: center !important;
    }

    .login-modal .close-modal, .signup-modal .close-modal, .forgot-password-modal .close-modal {
        position: absolute !important;
        top: 15px !important;
        right: 15px !important;
        font-size: 24px !important;
        cursor: pointer !important;
        color: #777 !important;
        transition: color 0.2s ease !important;
        z-index: 100 !important;
    }

    .login-modal .close-modal:hover, .signup-modal .close-modal:hover, .forgot-password-modal .close-modal:hover {
        color: #333 !important;
    }

    .form-group {
        margin-bottom: 20px !important;
    }

    .form-group label {
        display: block !important;
        margin-bottom: 5px !important;
        font-weight: 500 !important;
    }

    .form-group input {
        width: 100% !important;
        padding: 10px 12px !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        font-size: 16px !important;
        transition: border-color 0.2s ease !important;
    }

    .form-group input:focus {
        outline: none !important;
        border-color: #4F8CFF !important;
    }

    .password-input {
        position: relative !important;
    }

    .toggle-password {
        position: absolute !important;
        top: 50% !important;
        right: 12px !important;
        transform: translateY(-50%) !important;
        cursor: pointer !important;
        color: #777 !important;
    }

    .btn {
        display: inline-block !important;
        padding: 12px 24px !important;
        background-color: #4F8CFF !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        transition: background-color 0.2s ease !important;
        text-align: center !important;
    }

    .btn:hover {
        background-color: #3a7bea !important;
    }

    .btn-block {
        display: block !important;
        width: 100% !important;
    }

    .form-footer {
        margin-top: 20px !important;
        text-align: center !important;
    }

    .form-footer a {
        color: #4F8CFF !important;
        text-decoration: none !important;
    }

    .form-footer a:hover {
        text-decoration: underline !important;
    }

    .social-login, .social-signup {
        margin-top: 25px !important;
        text-align: center !important;
        position: relative !important;
    }

    .social-login:before, .social-signup:before {
        content: "" !important;
        position: absolute !important;
        top: 50% !important;
        left: 0 !important;
        right: 0 !important;
        height: 1px !important;
        background-color: #ddd !important;
        z-index: 1 !important;
    }

    .social-login p, .social-signup p {
        display: inline-block !important;
        position: relative !important;
        background-color: #fff !important;
        padding: 0 15px !important;
        z-index: 2 !important;
        margin: 0 0 15px 0 !important;
        color: #777 !important;
    }

    .social-buttons {
        display: flex !important;
        gap: 10px !important;
    }

    .social-btn {
        flex: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        padding: 10px !important;
        border-radius: 4px !important;
        border: none !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        transition: opacity 0.2s ease, transform 0.2s ease !important;
    }

    .social-btn:hover {
        opacity: 0.9 !important;
        transform: translateY(-2px) !important;
    }

    .social-btn.google {
        background-color: #DB4437 !important;
        color: white !important;
    }

    .social-btn.facebook {
        background-color: #4267B2 !important;
        color: white !important;
    }

    .switch-form {
        margin-top: 25px !important;
        text-align: center !important;
    }

    .switch-form p {
        margin: 0 !important;
        color: #777 !important;
    }

    .switch-form a {
        color: #4F8CFF !important;
        text-decoration: none !important;
        font-weight: 500 !important;
    }

    .switch-form a:hover {
        text-decoration: underline !important;
    }

    .checkbox-label {
        display: flex !important;
        align-items: flex-start !important;
        gap: 8px !important;
    }

    .checkbox-label input[type="checkbox"] {
        width: auto !important;
        margin-top: 3px !important;
    }

    .error-message {
        color: #e74c3c !important;
        font-size: 14px !important;
        margin-top: 5px !important;
        display: none;
    }

    .password-requirements {
        margin-top: 12px !important;
        padding: 12px !important;
        background-color: #f8f9fa !important;
        border-radius: 4px !important;
        font-size: 14px !important;
    }

    .password-requirements p {
        margin-top: 0 !important;
        margin-bottom: 8px !important;
        font-weight: 500 !important;
    }

    .password-requirements ul {
        margin: 0 !important;
        padding-left: 20px !important;
    }

    .password-requirements li {
        margin-bottom: 4px !important;
        color: #777 !important;
    }

    .password-requirements li.valid {
        color: #2ecc71 !important;
    }

    /* Toast notification */
    #toast {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        background-color: #333 !important;
        color: #fff !important;
        padding: 15px 20px !important;
        border-radius: 4px !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        z-index: 10000 !important;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s !important;
    }

    #toast.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
    }

    .toast-message {
        font-size: 14px !important;
        font-weight: 500 !important;
    }

    /* Global search message styles */
    .global-search-message {
        background-color: #f8f9fa;
        padding: 30px 0;
        margin: 20px 0;
        border-radius: 8px;
        text-align: center;
        display: none;
    }
    
    .global-search-message h2 {
        font-size: 24px;
        margin-bottom: 15px;
        color: #333;
    }
    
    .global-search-message p {
        margin-bottom: 20px;
        color: #666;
    }
    
    /* Search container enhancements */
    #search-container {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: none;
    }
    
    #search-container.active {
        display: block;
        animation: fadeInDown 0.3s ease;
    }
    
    .search-form {
        display: flex;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
    }
    
    .search-form input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 4px 0 0 4px;
        font-size: 16px;
    }
    
    .search-form input:focus {
        outline: none;
        border-color: #4F8CFF;
    }
    
    .search-form button[type="submit"] {
        background-color: #4F8CFF;
        color: white;
        border: none;
        padding: 0 20px;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
    }
    
    .clear-search-btn {
        position: absolute;
        right: 60px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        font-size: 20px;
        cursor: pointer;
        z-index: 5;
        display: none;
    }

    h1, .h1 {
      font-size: 2.5rem;  /* Base size for mobile */
    }
    @media (min-width: 768px) {
      h1, .h1 {
        font-size: 3rem;  /* Larger for tablets */
      }
    }
    @media (min-width: 992px) {
      h1, .h1 {
        font-size: 3.5rem;  /* Even larger for desktops */
      }
    }
</style>`); 