/**
 * Module 4: Persistent Cart & Payment Pipeline
 * Manages cart state in localStorage ('freshgo_cart'), quantity calculations,
 * and processes mock checkout with stock deduction and order persistence ('freshgo_orders').
 */

const CART_STORAGE_KEY = 'freshgo_cart';
const ORDERS_STORAGE_KEY = 'freshgo_orders';

// Retrieve cart array from localStorage
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        return [];
    }
}

// Save cart array to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
    if (typeof renderCatalog === 'function') {
        renderCatalog(); // Re-render stock limits on catalog
    }
}

// Add Item to Cart
function handleAddToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const availableStock = getProductStock(productId);
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        if (cart[existingIndex].qty >= availableStock) {
            showToast(`Sorry, only ${availableStock} units available in stock!`, 'error');
            return;
        }
        cart[existingIndex].qty += 1;
    } else {
        if (availableStock <= 0) {
            showToast(`This item is currently out of stock.`, 'error');
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            unit: product.unit,
            qty: 1
        });
    }

    saveCart(cart);
    showToast(`Added ${product.name} to cart!`, 'success');
}

// Increment or Decrement quantity
function updateCartItemQty(productId, delta) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    const availableStock = getProductStock(productId);
    const newQty = cart[itemIndex].qty + delta;

    if (newQty <= 0) {
        // Remove item if qty becomes 0
        cart.splice(itemIndex, 1);
        showToast('Item removed from cart.', 'info');
    } else if (newQty > availableStock) {
        showToast(`Cannot add more. Only ${availableStock} units available!`, 'error');
        return;
    } else {
        cart[itemIndex].qty = newQty;
    }

    saveCart(cart);
}

// Remove item directly
function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Item removed from cart.', 'info');
}

// Clear all items in cart
function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartUI();
    if (typeof renderCatalog === 'function') {
        renderCatalog();
    }
}
// Calculate totals: Subtotal, Tax, Delivery, Grand Total
function calculateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.05; // 5% Tax
    const deliveryFee = (subtotal === 0 || subtotal >= 35) ? 0.00 : 4.99; // Free delivery over $35
    const grandTotal = subtotal > 0 ? (subtotal + tax + deliveryFee) : 0;
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        totalCount: totalCount
    };
}

// Update Cart Drawer UI
function updateCartUI() {
    const cart = getCart();
    const summary = calculateCartSummary();

    // Update count badges
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = summary.totalCount;
    }

    const cartListEl = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const deliveryEl = document.getElementById('cart-delivery');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('btn-checkout');

    if (!cartListEl) return;

    if (cart.length === 0) {
        cartListEl.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: #94a3b8;">
                <div style="font-size: 40px; margin-bottom: 10px;">🛒</div>
                <h4 style="color: #334155; margin-bottom: 6px;">Your cart is empty</h4>
                <p style="font-size: 13px;">Add fresh groceries from the catalog to get started!</p>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cartListEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} &times; ${item.qty} = $${(item.price * item.qty).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)">-</button>
                    <span class="cart-qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)">+</button>
                </div>
                <button class="btn-remove-item" title="Remove Item" onclick="removeCartItem('${item.id}')">&times;</button>
            </div>
        `).join('');
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    if (subtotalEl) subtotalEl.textContent = `$${summary.subtotal}`;
    if (taxEl) taxEl.textContent = `$${summary.tax}`;
    if (deliveryEl) deliveryEl.textContent = summary.deliveryFee === '0.00' ? 'FREE' : `$${summary.deliveryFee}`;
    if (totalEl) totalEl.textContent = `$${summary.grandTotal}`;
}

// Open / Close Cart Drawer
function toggleCartDrawer(open = true) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
        if (open) {
            drawer.classList.add('active');
            backdrop.classList.add('active');
            updateCartUI();
        } else {
            drawer.classList.remove('active');
            backdrop.classList.remove('active');
        }
    }
}

// Open Checkout Modal
function openCheckoutModal() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty! Add items before checking out.', 'error');
        return;
    }

    // Pre-fill user data if logged in
    const userJson = localStorage.getItem('freshgo_user');
    if (userJson) {
        const user = JSON.parse(userJson);
        const nameInput = document.getElementById('checkout-name');
        const emailInput = document.getElementById('checkout-email');
        if (nameInput && !nameInput.value) nameInput.value = user.username || '';
        if (emailInput && !emailInput.value) emailInput.value = user.email || '';
    }

    // Initialize delivery slots
    if (typeof initDeliverySlotPicker === 'function') {
        initDeliverySlotPicker();
    }

    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('active');
    toggleCartDrawer(false);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('active');
}

// Process Simulated Checkout
function processCheckout(event) {
    event.preventDefault();

    const schedule = getSelectedDeliverySchedule();
    const errorEl = document.getElementById('slot-error-msg');

    if (!schedule) {
        if (errorEl) {
            errorEl.textContent = 'Please select an available 2-hour delivery slot.';
            errorEl.style.display = 'block';
        }
        return;
    }

    const form = document.getElementById('checkout-form');
    const customerName = form.elements['customer_name'].value.trim();
    const customerEmail = form.elements['customer_email'].value.trim();
    const customerPhone = form.elements['customer_phone'].value.trim();
    const customerAddress = form.elements['customer_address'].value.trim();
    const paymentMethod = form.elements['payment_method'].value;

    const cart = getCart();
    const summary = calculateCartSummary();

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress
        },
        deliverySlot: {
            date: schedule.date,
            timeSlot: schedule.timeSlot
        },
        items: cart,
        pricing: summary,
        paymentMethod: paymentMethod,
        status: 'Pending' // Initial state in fulfillment cycle
    };

    // Deduct stock from Godown
    cart.forEach(item => {
        const currentStock = getProductStock(item.id);
        updateGodownStock(item.id, currentStock - item.qty);
    });

    // Save order into localStorage
    const savedOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    savedOrders.unshift(orderData);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(savedOrders));
    updateUserOrdersBadge();

    // Clear cart
    clearCart();
    closeCheckoutModal();

    // Show Confirmation Modal
    showOrderConfirmation(orderData);
}

// Show Order Confirmation Receipt Modal
function showOrderConfirmation(order) {
    const modal = document.getElementById('confirmation-modal');
    const details = document.getElementById('confirmation-details');

    if (details) {
        details.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 50px;">🎉</div>
                <h2 style="color: #065f46; font-size: 22px; margin-top: 8px;">Order Confirmed!</h2>
                <p style="color: #64748b; font-size: 14px;">Order ID: <strong>#${order.id}</strong></p>
            </div>
            <div style="background: #f8fafc; padding: 16px; border-radius: 10px; margin-bottom: 16px; font-size: 13px;">
                <p><strong>Scheduled Delivery:</strong> ${order.deliverySlot.date} (${order.deliverySlot.timeSlot})</p>
                <p><strong>Delivery To:</strong> ${order.customer.name}, ${order.customer.address}</p>
                <p><strong>Contact:</strong> ${order.customer.phone}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                <p><strong>Total Paid:</strong> $${order.pricing.grandTotal}</p>
            </div>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 20px;">
                Your items are now being packaged at our godown and will be dispatched in your scheduled delivery window.
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn-checkout-proceed" style="flex: 1; text-align: center; background: #10b981;" onclick="closeConfirmationModal(); openOrdersModal();">Track in My Orders</button>
                <button class="btn-checkout-proceed" style="flex: 1; text-align: center; background: #64748b;" onclick="closeConfirmationModal()">Continue Shopping</button>
            </div>
        `;
    }

    if (modal) modal.classList.add('active');
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.remove('active');
}

// Simple Toast Notification system
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3200);
}
// ==========================================================
// User Dashboard & Order History Functions
// ==========================================================

function openOrdersModal() {
    renderUserOrders();
    const modal = document.getElementById('orders-modal');
    if (modal) modal.classList.add('active');
}

function closeOrdersModal() {
    const modal = document.getElementById('orders-modal');
    if (modal) modal.classList.remove('active');
}

function getUserOrders() {
    try {
        const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const orders = raw ? JSON.parse(raw) : [];

        // Check if a specific user is logged in
        const userJson = localStorage.getItem('freshgo_user');
        if (userJson) {
            const user = JSON.parse(userJson);
            // Match orders by email or username if present, otherwise show all local orders
            const matched = orders.filter(o =>
                (o.customer && (o.customer.email === user.email || o.customer.name === user.username))
            );
            return matched.length > 0 ? matched : orders;
        }
        return orders;
    } catch (e) {
        console.error('Error fetching user orders:', e);
        return [];
    }
}

function updateUserOrdersBadge() {
    const badge = document.getElementById('user-orders-badge');
    if (badge) {
        const orders = getUserOrders();
        badge.textContent = orders.length;
    }
}

function renderUserOrders() {
    const container = document.getElementById('user-orders-list');
    if (!container) return;

    const orders = getUserOrders();
    updateUserOrdersBadge();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 40px 20px;">
                <div class="icon">📦</div>
                <h3>No Orders Found</h3>
                <p>You haven't placed any grocery orders yet. Start adding items to your cart!</p>
                <button class="btn-checkout-proceed" style="max-width: 200px; margin: 16px auto 0;" onclick="closeOrdersModal()">Start Shopping</button>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => {
        const statusClass = (order.status || 'pending').toLowerCase();
        const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const isPending = order.status === 'Pending';

        // Stepper Progress calculation
        let step1 = 'completed';
        let step2 = (order.status === 'Processing' || order.status === 'Delivered') ? 'completed' : (order.status === 'Pending' ? 'active' : '');
        let step3 = (order.status === 'Delivered') ? 'completed' : (order.status === 'Processing' ? 'active' : '');

        if (order.status === 'Cancelled') {
            step1 = 'cancelled';
            step2 = 'cancelled';
            step3 = 'cancelled';
        }

        return `
            <div class="order-history-card">
                <div class="order-history-header">
                    <div>
                        <div class="order-id-label">Order #${order.id}</div>
                        <div class="order-date-label">Placed on ${dateFormatted}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="status-badge ${statusClass}">${order.status}</span>
                        <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 4px;">$${order.pricing.grandTotal}</div>
                    </div>
                </div>

                <!-- Order Stepper Tracking -->
                <div class="order-stepper">
                    <div class="step ${step1}">
                        <div class="step-icon">1</div>
                        <div class="step-label">Placed</div>
                    </div>
                    <div class="step-line ${step2 === 'completed' ? 'active' : ''}"></div>
                    <div class="step ${step2}">
                        <div class="step-icon">2</div>
                        <div class="step-label">Godown Packing</div>
                    </div>
                    <div class="step-line ${step3 === 'completed' ? 'active' : ''}"></div>
                    <div class="step ${step3}">
                        <div class="step-icon">3</div>
                        <div class="step-label">Delivered</div>
                    </div>
                </div>

                <!-- Delivery Schedule & Info -->
                <div class="order-slot-banner">
                    <div>
                        <strong>Scheduled Delivery:</strong> ${order.deliverySlot.date} &bull; <span style="color:#059669; font-weight:600;">${order.deliverySlot.timeSlot}</span>
                    </div>
                    <div>
                        <small style="color:#64748b;">${order.customer.address} (${order.paymentMethod})</small>
                    </div>
                </div>

                <!-- Itemized Breakdown -->
                <div class="order-items-compact">
                    ${order.items.map(item => `
                        <div class="order-item-compact-row">
                            <div style="display:flex; align-items:center; gap: 8px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover;">
                                <span>${item.name} <small style="color:#64748b;">(${item.unit || 'unit'})</small></span>
                            </div>
                            <div>
                                <span style="color:#64748b;">&times; ${item.qty}</span>
                                <strong style="margin-left: 10px;">$${(item.price * item.qty).toFixed(2)}</strong>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer Actions -->
                <div class="order-history-footer">
                    <span style="font-size: 12px; color: #64748b;">
                        Items Subtotal: $${order.pricing.subtotal} | Tax: $${order.pricing.tax} | Delivery: ${order.pricing.deliveryFee === '0.00' ? 'FREE' : '$' + order.pricing.deliveryFee}
                    </span>
                    ${isPending ? `
                        <button class="btn-cancel-order" onclick="cancelUserOrder('${order.id}')">Cancel Order</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Cancel User Order (Restores stock to inventory)
function cancelUserOrder(orderId) {
    if (!confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return;

    let orders = JSON.parse(raw);
    const order = orders.find(o => o.id === orderId);

    if (order && order.status === 'Pending') {
        order.status = 'Cancelled';

        // Return stock back to Godown inventory
        order.items.forEach(item => {
            const currentStock = getProductStock(item.id);
            updateGodownStock(item.id, currentStock + item.qty);
        });

        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        showToast(`Order #${orderId} has been cancelled and refunded.`, 'info');
        renderUserOrders();
        if (typeof renderCatalog === 'function') renderCatalog();
    }
}
