document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Initialize all best-sellers sections
    const sections = document.querySelectorAll('.best-sellers[data-section-id]');

    sections.forEach(section => {
        const sectionId = section.getAttribute('data-section-id');

        // Navigation functionality
        const navItems = section.querySelectorAll('.best-sellers__nav-item');
        const products = section.querySelectorAll('.best-sellers__product');

        navItems.forEach(item => {
            item.addEventListener('click', function () {
                const blockId = this.getAttribute('data-block-id');

                // Update active nav item within this section
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                // Update active product within this section
                products.forEach(product => {
                    if (product.getAttribute('data-block-id') === blockId) {
                        product.classList.add('active');
                    } else {
                        product.classList.remove('active');
                    }
                });
            });
        });

        // Wishlist modal functionality
        const modal = document.querySelector(`.best-sellers-modal[data-modal-id="${sectionId}"]`);

        if (!modal) return;

        const modalText = modal.querySelector('.best-sellers-modal__text');
        const modalClose = modal.querySelector('.best-sellers-modal__close');
        const modalOverlay = modal.querySelector('.best-sellers-modal__overlay');
        const wishlistBtns = section.querySelectorAll('.best-sellers__wishlist-btn');

        function openModal(productName) {
            modalText.textContent = `${productName} has been added to the your wishlist.`;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const productName = this.getAttribute('data-product-name');
                openModal(productName);
            });
        });

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Add to cart functionality
        const addToCartBtns = section.querySelectorAll('.best-sellers__add-to-cart-btn');

        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                if (this.disabled) return;

                const variantId = this.getAttribute('data-variant-id');

                if (!variantId) {
                    console.error('No variant ID found');
                    return;
                }

                // Disable button during request
                this.disabled = true;

                fetch('/cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: [{
                            id: variantId,
                            quantity: 1
                        }]
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Product added to cart:', data);

                        // Re-enable button
                        this.disabled = false;
                    })
                    .catch(error => {
                        console.error('Error adding to cart:', error);
                        this.disabled = false;
                    });
            });
        });

        // Close modal on ESC key - check if this specific modal is active
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    });
});