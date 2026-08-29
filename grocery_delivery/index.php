<?php
session_start();
$isLoggedIn = isset($_SESSION['user_id']);
$username = $isLoggedIn ? $_SESSION['username'] : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshGo - Online Grocery Delivery</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Top Navigation Bar -->
    <header class="navbar">
        <div class="nav-container">
            <!-- FreshGo Logo with Double-Tap / Double-Click Passcode Gate -->
            <a href="index.php" class="nav-brand" id="brand-logo" title="FreshGo Groceries (Double-tap for Admin)"
               ondblclick="handleLogoDoubleTap(event)"
               ontouchend="handleLogoTouchEnd(event)">
                🛒 Fresh<span>Go</span>
            </a>

            <div class="nav-search">
                <span class="search-icon">🔍</span>
                <input type="text" id="search-input" placeholder="Search fresh vegetables, fruits, dairy, snacks...">
            </div>

            <div class="nav-actions">
                <button class="btn-orders-toggle" onclick="openOrdersModal()" title="View your order history & status">
                    <span>📦 My Orders</span>
                    <span class="orders-count-badge" id="user-orders-badge">0</span>
                </button>

                <?php if ($isLoggedIn): ?>
                    <div class="user-chip">
                        <div class="avatar"><?= strtoupper(substr($username, 0, 1)) ?></div>
                        <span>Hello, <?= htmlspecialchars($username) ?></span>
                    </div>
                    <a href="auth/logout.php" class="btn-auth btn-auth-outline">Sign Out</a>
                <?php else: ?>
                    <a href="auth/login.php" class="btn-auth btn-auth-outline">Sign In</a>
                    <a href="auth/register.php" class="btn-auth btn-auth-primary">Register</a>
                <?php endif; ?>

                <button class="btn-cart-toggle" onclick="toggleCartDrawer(true)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Cart</span>
                    <span class="cart-count-badge" id="cart-badge">0</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Hero Banner -->
    <section class="hero-banner">
        <div class="hero-content">
            <div class="hero-text" style="max-width: 750px;">
                <span class="hero-badge">⚡ Express Delivery in 2-Hour Slots</span>
                <h1>Fresh Groceries Delivered Straight from Godown</h1>
                <p>Farm fresh produce, dairy essentials, and everyday groceries scheduled at your preferred time.</p>
            </div>
        </div>
    </section>

    <!-- Main Content Container -->
    <main class="main-container">
        <!-- Category Filter Buttons -->
        <div class="category-filter-bar">
            <button class="filter-btn active" data-category="all">All Groceries</button>
            <button class="filter-btn" data-category="fruits-vegetables">🥦 Fruits & Vegetables</button>
            <button class="filter-btn" data-category="dairy-bakery">🥛 Dairy & Bakery</button>
            <button class="filter-btn" data-category="pantry-staples">🌾 Pantry & Staples</button>
            <button class="filter-btn" data-category="beverages-snacks">☕ Beverages & Snacks</button>
            <button class="filter-btn" data-category="meat-seafood">🥩 Meat & Seafood</button>
            <button class="filter-btn" data-category="home-care">🧴 Home & Care</button>
        </div>

        <!-- Section Title -->
        <div class="section-header">
            <h2>Godown Inventory Catalog</h2>
            <span class="product-count" id="product-count">Loading products...</span>
        </div>

        <!-- Dynamic Product Grid -->
        <div class="products-grid" id="products-grid">
            <!-- Dynamically populated by catalog.js -->
        </div>
    </main>
    <!-- Cart Drawer Backdrop -->
    <div class="cart-drawer-backdrop" id="cart-backdrop" onclick="toggleCartDrawer(false)"></div>

    <!-- Cart Drawer Sidebar -->
    <aside class="cart-drawer" id="cart-drawer">
        <div class="cart-header">
            <h3>Your Grocery Cart</h3>
            <button class="btn-close-drawer" onclick="toggleCartDrawer(false)">&times;</button>
        </div>

        <div class="cart-items-list" id="cart-items-list">
            <!-- Dynamically populated by cart.js -->
        </div>

        <div class="cart-footer">
            <div class="bill-row">
                <span>Subtotal</span>
                <span id="cart-subtotal">$0.00</span>
            </div>
            <div class="bill-row">
                <span>Estimated Tax (5%)</span>
                <span id="cart-tax">$0.00</span>
            </div>
            <div class="bill-row">
                <span>Delivery Fee</span>
                <span id="cart-delivery">FREE</span>
            </div>
            <div class="bill-row total">
                <span>Total Amount</span>
                <span id="cart-total">$0.00</span>
            </div>
            <button class="btn-checkout-proceed" id="btn-checkout" onclick="openCheckoutModal()">
                Proceed to Slot & Payment
            </button>
        </div>
    </aside>

    <!-- Checkout & Delivery Slot Scheduling Modal -->
    <div class="modal-overlay" id="checkout-modal">
        <div class="modal-card">
            <div class="modal-header">
                <h3>Schedule Delivery & Checkout</h3>
                <button class="btn-close-drawer" onclick="closeCheckoutModal()">&times;</button>
            </div>

            <form id="checkout-form" onsubmit="processCheckout(event)">
                <h4 style="font-size: 14px; margin-bottom: 10px; color: #0f172a;">1. Customer & Delivery Address</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div class="form-group">
                        <label style="font-size: 12px; font-weight: 600;">Full Name</label>
                        <input type="text" name="customer_name" id="checkout-name" required placeholder="John Doe" style="padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 13px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 12px; font-weight: 600;">Email</label>
                        <input type="email" name="customer_email" id="checkout-email" required placeholder="john@example.com" style="padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 13px;">
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px; margin-bottom: 16px;">
                    <div class="form-group">
                        <label style="font-size: 12px; font-weight: 600;">Phone Number</label>
                        <input type="tel" name="customer_phone" required placeholder="+1 555-0199" style="padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 13px;">
                    </div>
                    <div class="form-group">
                        <label style="font-size: 12px; font-weight: 600;">Street Address / Apt</label>
                        <input type="text" name="customer_address" required placeholder="123 Orchard Lane, Apt 4" style="padding: 9px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 13px;">
                    </div>
                </div>

                <h4 style="font-size: 14px; margin-bottom: 6px; color: #0f172a;">2. Select Delivery Slot (Up to 7 Days Ahead)</h4>
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 12px; font-weight: 600; color: #64748b; display: block; margin-bottom: 4px;">Delivery Date</label>
                    <select id="delivery-date-select" style="width: 100%; padding: 10px; border-radius: 6px; border: 1.5px solid #e2e8f0; font-size: 13px; font-weight: 600;">
                        <!-- Populated by delivery_slots.js -->
                    </select>
                </div>

                <label style="font-size: 12px; font-weight: 600; color: #64748b;">Available 2-Hour Delivery Slots</label>
                <div class="slots-container" id="delivery-slots-container">
                    <!-- Populated dynamically and filtered by delivery_slots.js -->
                </div>
                <div id="slot-error-msg" style="display: none; color: #ef4444; font-size: 12px; margin-top: -12px; margin-bottom: 14px; font-weight: 600;"></div>

                <h4 style="font-size: 14px; margin-bottom: 10px; color: #0f172a;">3. Payment Method</h4>
                <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                    <label style="flex: 1; border: 1.5px solid #e2e8f0; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <input type="radio" name="payment_method" value="Cash on Delivery" checked> Cash on Delivery
                    </label>
                    <label style="flex: 1; border: 1.5px solid #e2e8f0; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <input type="radio" name="payment_method" value="Credit/Debit Card"> Card
                    </label>
                    <label style="flex: 1; border: 1.5px solid #e2e8f0; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <input type="radio" name="payment_method" value="UPI / Wallet"> UPI / Wallet
                    </label>
                </div>

                <button type="submit" class="btn-checkout-proceed">Confirm & Place Grocery Order</button>
            </form>
        </div>
    </div>

    <!-- My Orders & Order History Modal -->
    <div class="modal-overlay" id="orders-modal">
        <div class="modal-card orders-modal-card">
            <div class="modal-header">
                <div>
                    <h3 style="font-size: 19px; font-weight: 700;">📦 My Orders & Delivery History</h3>
                    <p style="font-size: 13px; color: #64748b; margin-top: 2px;">Track your live delivery status and past godown orders.</p>
                </div>
                <button class="btn-close-drawer" onclick="closeOrdersModal()">&times;</button>
            </div>

            <!-- Populated dynamically by renderUserOrders() in cart.js -->
            <div class="user-orders-list" id="user-orders-list"></div>
        </div>
    </div>

    <!-- Admin Passcode Gate Modal (Prompts for Passcode: 1811 on Double Tap) -->
    <div class="modal-overlay" id="admin-passcode-modal">
        <div class="modal-card" id="admin-passcode-card" style="max-width: 360px; text-align: center; padding: 32px 24px;">
            <div style="width: 56px; height: 56px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px;">
                🔒
            </div>
            <h3 style="font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Admin Passcode Required</h3>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Please enter the manager passcode (1811) to access the admin dashboard.</p>

            <form onsubmit="verifyStoreAdminPasscode(event)">
                <input
                    type="password"
                    id="store-admin-pin-input"
                    maxlength="8"
                    placeholder="••••"
                    required
                    autocomplete="off"
                    style="width: 100%; padding: 12px; font-size: 22px; letter-spacing: 8px; text-align: center; border: 2px solid #e2e8f0; border-radius: 8px; font-weight: 700; outline: none; margin-bottom: 6px;"
                >
                <div id="store-admin-pin-error" style="color: #ef4444; font-size: 12px; font-weight: 600; min-height: 20px; margin-bottom: 14px;"></div>

                <div style="display: flex; gap: 10px;">
                    <button type="button" class="btn-checkout-proceed" style="background: #f1f5f9; color: #475569; flex: 1;" onclick="closeAdminPasscodeModal()">Cancel</button>
                    <button type="submit" class="btn-checkout-proceed" style="background: #10b981; color: #ffffff; flex: 2;">Verify & Enter</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal-overlay" id="confirmation-modal">
        <div class="modal-card" id="confirmation-details">
            <!-- Populated upon checkout completion -->
        </div>
    </div>

    <!-- JavaScript Modules -->
    <script src="assets/js/catalog.js"></script>
    <script src="assets/js/delivery_slots.js"></script>
    <script src="assets/js/cart.js"></script>
    <script>
        // ==========================================================
        // Admin Passcode Gate (Requires Passcode: 1811 on Double Tap)
        // ==========================================================
        const ADMIN_GATE_PASSCODE = '1811';
        let lastLogoTapTime = 0;

        // Desktop Double Click
        function handleLogoDoubleTap(e) {
            e.preventDefault();
            openAdminPasscodeModal();
        }

        // Mobile Touch Double Tap
        function handleLogoTouchEnd(e) {
            const currentTime = new Date().getTime();
            const tapGap = currentTime - lastLogoTapTime;
            if (tapGap < 350 && tapGap > 0) {
                e.preventDefault();
                openAdminPasscodeModal();
            }
            lastLogoTapTime = currentTime;
        }

        function openAdminPasscodeModal() {
            const modal = document.getElementById('admin-passcode-modal');
            const pinInput = document.getElementById('store-admin-pin-input');
            const errorEl = document.getElementById('store-admin-pin-error');
            if (errorEl) errorEl.textContent = '';
            if (pinInput) pinInput.value = '';
            if (modal) {
                modal.classList.add('active');
                setTimeout(() => pinInput && pinInput.focus(), 150);
            }
        }

        function closeAdminPasscodeModal() {
            const modal = document.getElementById('admin-passcode-modal');
            if (modal) modal.classList.remove('active');
        }

        function verifyStoreAdminPasscode(e) {
            e.preventDefault();
            const pinInput = document.getElementById('store-admin-pin-input');
            const errorEl = document.getElementById('store-admin-pin-error');
            const card = document.getElementById('admin-passcode-card');
            const entered = pinInput ? pinInput.value.trim() : '';

            if (entered === ADMIN_GATE_PASSCODE) {
                sessionStorage.setItem('freshgo_admin_auth', 'true');
                closeAdminPasscodeModal();
                window.location.href = 'admin.html';
            } else {
                if (errorEl) errorEl.textContent = '❌ Incorrect Passcode. Access Denied.';
                if (card) {
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = 'shakeAnim 0.4s ease-in-out';
                }
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.focus();
                }
            }
        }

        // Initialize on DOM load
        document.addEventListener('DOMContentLoaded', () => {
            renderCatalog();
            setupCatalogEvents();
            updateCartUI();
            updateUserOrdersBadge();
        });
    </script>
</body>
</html>
