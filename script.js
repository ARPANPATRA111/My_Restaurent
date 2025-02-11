document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const cartIcon = document.querySelector('.cart-icon');
    const cartContainer = document.querySelector('.cart-container');

    cartIcon.addEventListener('click', () => {
        cartContainer.classList.toggle('active');
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            targetSection.scrollIntoView({
                behavior: 'smooth'
            });

            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const cart = new ShoppingCart();
});

class ShoppingCart {
    constructor() {
        this.items = [];
        this.initializeCart();
    }

    initializeCart() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const product = e.target.dataset.product;
                this.addToCart(product);
            });
        });

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartDisplay();
            this.updateCartCount();
        }
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.product === product);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = {
                product: product,
                quantity: 1,
                price: this.getProductPrice(product)
            };
            this.items.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartDisplay();
        this.updateCartCount();
    }

    getProductPrice(product) {
        const prices = {
            'margherita': 14.99,
            'meat-lovers': 19.99,
            'veggie': 17.99,
            'classic-burger': 12.99,
            'bacon-cheese': 14.99,
            'mushroom-swiss': 13.99
        };
        return prices[product] || 0;
    }

    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-container');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p>Cart is empty</p>';
            return;
        }

        const total = this.calculateTotal();

        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-content">
                    <span class="item-name">${this.getProductName(item.product)}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" data-product="${item.product}">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);

            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                this.removeFromCart(item.product);
            });
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'cart-total';
        totalElement.innerHTML = `
            <span class="total-label">Total:</span>
            <span class="total-amount">$${total.toFixed(2)}</span>
        `;
        cartContainer.appendChild(totalElement);
    }

    getProductName(product) {
        const names = {
            'margherita': 'Classic Margherita',
            'meat-lovers': 'Meat Lover\'s',
            'veggie': 'Veggie Delight',
            'classic-burger': 'Classic Burger',
            'bacon-cheese': 'Bacon Cheeseburger',
            'mushroom-swiss': 'Mushroom Swiss'
        };
        return names[product] || product;
    }

    removeFromCart(product) {
        this.items = this.items.filter(item => item.product !== product);
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartDisplay();
        this.updateCartCount();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }
}
