/**
 * Module 5: Admin Dashboard & Order Fulfillment
 * Secured with Manager Passcode Gate (Passcode: 1811).
 * Multi-Godown inventory tracking & real-time order dispatch.
 */

const ADMIN_PASSCODE = '1811';
const ADMIN_AUTH_SESSION_KEY = 'freshgo_admin_auth';
const ORDERS_STORAGE_KEY = 'freshgo_orders';

// Check if admin is currently authenticated via Passcode 1811
function checkAdminAuthentication() {
    const isAuth = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'true';
    const lockOverlay = document.getElementById('admin-lock-screen');
    const passInput = document.getElementById('admin-passcode-input');

    if (isAuth) {
        if (lockOverlay) lockOverlay.style.display = 'none';
        return true;
    } else {
        if (lockOverlay) {
            lockOverlay.style.display = 'flex';
            if (passInput) {
                passInput.value = '';
                setTimeout(() => passInput.focus(), 150);
            }
        }
        return false;
    }
}

// Handle Passcode Unlock Form Submit
function handlePasscodeSubmit(e) {
    e.preventDefault();
    const passInput = document.getElementById('admin-passcode-input');
    const errorEl = document.getElementById('passcode-error');
    const lockCard = document.getElementById('lock-card-box');
    const entered = passInput ? passInput.value.trim() : '';

    if (entered === ADMIN_PASSCODE) {
        sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
        const lockOverlay = document.getElementById('admin-lock-screen');
        if (lockOverlay) lockOverlay.style.display = 'none';
        if (errorEl) errorEl.textContent = '';

        // Render current dashboard tab
        if (currentAdminTab === 'inventory') {
            renderInventoryDashboard();
        } else {
            renderAdminDashboard();
        }
    } else {
        if (errorEl) errorEl.textContent = '❌ Invalid Passcode. Access Denied.';
        if (lockCard) {
            lockCard.classList.remove('shake');
            void lockCard.offsetWidth; // Trigger reflow
            lockCard.classList.add('shake');
        }
        if (passInput) {
            passInput.value = '';
            passInput.focus();
        }
    }
}

// Lock Admin Session
function lockAdminPanel() {
    sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    checkAdminAuthentication();
}

// Initial demo orders for simulation
const DEMO_ORDERS = [
    {
        id: "ORD-782194",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        customer: {
            name: "Eleanor Vance",
            email: "eleanor@example.com",
            phone: "+1 (555) 234-5678",
            address: "742 Evergreen Terrace, Springfield"
        },
        deliverySlot: {
            date: new Date().toISOString().split('T')[0],
            timeSlot: "04:00 PM - 06:00 PM"
        },
        items: [
            { id: "prod-001", name: "Fresh Organic Bananas", price: 2.49, qty: 2, unit: "1 bunch" },
            { id: "prod-002", name: "Farm Fresh Whole Milk", price: 3.89, qty: 1, unit: "1 Gallon" }
        ],
        pricing: { subtotal: "8.87", tax: "0.44", deliveryFee: "4.99", grandTotal: "14.30" },
        paymentMethod: "Card",
        status: "Pending"
    },
    {
        id: "ORD-910482",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        customer: {
            name: "Marcus Aurelius",
            email: "marcus@rome.org",
            phone: "+1 (555) 987-6543",
            address: "10 Downing St, Suite 4B"
        },
        deliverySlot: {
            date: new Date(Date.now() - 3600000 * 20).toISOString().split('T')[0],
            timeSlot: "10:00 AM - 12:00 PM"
        },
        items: [
            { id: "prod-005", name: "Premium Basmati Rice", price: 14.99, qty: 2, unit: "5 kg Bag" },
            { id: "prod-006", name: "Extra Virgin Olive Oil", price: 12.49, qty: 1, unit: "750 ml" }
        ],
        pricing: { subtotal: "42.47", tax: "2.12", deliveryFee: "0.00", grandTotal: "44.59" },
        paymentMethod: "UPI / Wallet",
        status: "Delivered"
    }
];

// Load Orders from localStorage
function getAdminOrders() {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
        // Seed initial demo orders
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEMO_ORDERS));
        return DEMO_ORDERS;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

// Save Orders to localStorage
function saveAdminOrders(orders) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    renderAdminDashboard();
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
    const orders = getAdminOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = newStatus;
        saveAdminOrders(orders);
    }
}

// Reset Demo Data
function resetDemoData() {
    if (confirm('Are you sure you want to reset all order data to demo defaults?')) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(DEMO_ORDERS));
        localStorage.removeItem('freshgo_godown_stock'); // Reset inventory
        renderAdminDashboard();
    }
}

// Render Dashboard
function renderAdminDashboard() {
    const orders = getAdminOrders();

    // 1. Compute Metrics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const totalRevenue = orders.reduce((sum, o) => {
        if (o.status !== 'Cancelled') {
            return sum + parseFloat(o.pricing.grandTotal || 0);
        }
        return sum;
    }, 0);

    // Update DOM Metrics
    document.getElementById('metric-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('metric-total-orders').textContent = totalOrders;
    document.getElementById('metric-pending-orders').textContent = pendingOrders;
    document.getElementById('metric-delivered-orders').textContent = deliveredOrders;

    // 2. Render Orders Table
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding: 40px; color: #94a3b8;">
                    No orders recorded yet. Place an order in the store to see it here!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const statusClass = order.status.toLowerCase();
        const itemsSummary = order.items.map(i => `${i.name} (&times;${i.qty})`).join(', ');

        return `
            <tr>
                <td><strong>#${order.id}</strong><br><small style="color:#94a3b8;">${new Date(order.createdAt).toLocaleDateString()}</small></td>
                <td>
                    <strong>${order.customer.name}</strong><br>
                    <small style="color:#64748b;">${order.customer.phone}</small>
                </td>
                <td>
                    <span style="font-weight:600; font-size:13px;">${order.deliverySlot.date}</span><br>
                    <small style="color:#059669;">${order.deliverySlot.timeSlot}</small>
                </td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsSummary}">
                    ${itemsSummary}
                </td>
                <td><strong>$${order.pricing.grandTotal}</strong></td>
                <td>
                    <span class="status-badge ${statusClass}">${order.status}</span>
                </td>
                <td>
                    <button class="btn-view-details" onclick="openOrderModal('${order.id}')">Details</button>
                    <select class="status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

// View Order Modal
function openOrderModal(orderId) {
    const orders = getAdminOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('admin-order-modal');
    const content = document.getElementById('admin-order-content');

    if (content) {
        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h3 style="font-size: 18px; margin-bottom: 4px;">Order #${order.id}</h3>
                <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
                <span style="font-size: 13px; color: #64748b; margin-left: 10px;">Placed on ${new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
                <h4 style="margin-bottom: 8px; color: #0f172a;">Customer & Delivery Details</h4>
                <p><strong>Name:</strong> ${order.customer.name}</p>
                <p><strong>Email:</strong> ${order.customer.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}</p>
                <p><strong>Scheduled Slot:</strong> ${order.deliverySlot.date} | ${order.deliverySlot.timeSlot}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            </div>

            <h4 style="margin-bottom: 8px; font-size: 14px;">Items Ordered</h4>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 16px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead style="background: #f1f5f9;">
                        <tr>
                            <th style="padding: 8px 12px; text-align: left;">Item</th>
                            <th style="padding: 8px 12px; text-align: center;">Qty</th>
                            <th style="padding: 8px 12px; text-align: right;">Price</th>
                            <th style="padding: 8px 12px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #f1f5f9;">
                                <td style="padding: 8px 12px;">${item.name} (${item.unit || 'pc'})</td>
                                <td style="padding: 8px 12px; text-align: center;">${item.qty}</td>
                                <td style="padding: 8px 12px; text-align: right;">$${item.price.toFixed(2)}</td>
                                <td style="padding: 8px 12px; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="text-align: right; font-size: 13px; line-height: 1.8;">
                <div>Subtotal: <strong>$${order.pricing.subtotal}</strong></div>
                <div>Tax (5%): <strong>$${order.pricing.tax}</strong></div>
                <div>Delivery Fee: <strong>${order.pricing.deliveryFee === '0.00' ? 'FREE' : '$' + order.pricing.deliveryFee}</strong></div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">Grand Total: $${order.pricing.grandTotal}</div>
            </div>
        `;
    }

    if (modal) modal.classList.add('active');
}

function closeAdminModal() {
    const modal = document.getElementById('admin-order-modal');
    if (modal) modal.classList.remove('active');
}

// Tab Switching
let currentAdminTab = 'inventory'; // 'inventory' or 'orders'
let inventorySearchQuery = '';
let inventoryCategoryFilter = 'all';
let inventoryStatusFilter = 'all';

function switchAdminTab(tab) {
    currentAdminTab = tab;
    const viewInv = document.getElementById('view-inventory');
    const viewOrd = document.getElementById('view-orders');
    const tabInv = document.getElementById('tab-nav-inventory');
    const tabOrd = document.getElementById('tab-nav-orders');

    if (tab === 'inventory') {
        if (viewInv) viewInv.style.display = 'block';
        if (viewOrd) viewOrd.style.display = 'none';
        if (tabInv) tabInv.classList.add('active');
        if (tabOrd) tabOrd.classList.remove('active');
        renderInventoryDashboard();
    } else {
        if (viewInv) viewInv.style.display = 'none';
        if (viewOrd) viewOrd.style.display = 'block';
        if (tabInv) tabInv.classList.remove('active');
        if (tabOrd) tabOrd.classList.add('active');
        renderAdminDashboard();
    }
}

// ==========================================================
// Multi-Godown Inventory Management Functions
// ==========================================================

function renderInventoryDashboard() {
    if (typeof INITIAL_PRODUCTS === 'undefined') return;

    const stockMap = getStockDatabase();
    const hubs = (typeof GODOWN_LOCATIONS !== 'undefined') ? GODOWN_LOCATIONS : [
        { id: "hub-central", name: "Central Godown (Hub A - Downtown)", code: "HUB-A", short: "Central", color: "#10b981" },
        { id: "hub-west", name: "Westside Fulfillment (Hub B - Suburbs)", code: "HUB-B", short: "Westside", color: "#3b82f6" },
        { id: "hub-airport", name: "Airport Logistics Hub (Hub C - Metro)", code: "HUB-C", short: "Airport", color: "#8b5cf6" }
    ];

    // 1. Calculate Aggregates
    let totalValuation = 0;
    let totalUnits = 0;
    let lowStockCount = 0;
    let hubTotals = { "hub-central": 0, "hub-west": 0, "hub-airport": 0 };

    INITIAL_PRODUCTS.forEach(p => {
        const hCentral = (stockMap[p.id] && stockMap[p.id]["hub-central"] !== undefined) ? stockMap[p.id]["hub-central"] : 0;
        const hWest = (stockMap[p.id] && stockMap[p.id]["hub-west"] !== undefined) ? stockMap[p.id]["hub-west"] : 0;
        const hAirport = (stockMap[p.id] && stockMap[p.id]["hub-airport"] !== undefined) ? stockMap[p.id]["hub-airport"] : 0;
        const pTotal = hCentral + hWest + hAirport;

        totalUnits += pTotal;
        totalValuation += (pTotal * p.price);
        hubTotals["hub-central"] += hCentral;
        hubTotals["hub-west"] += hWest;
        hubTotals["hub-airport"] += hAirport;

        if (pTotal <= 5) lowStockCount++;
    });

    // Update Top Metric DOM Elements
    const valEl = document.getElementById('inv-metric-value');
    const skusEl = document.getElementById('inv-metric-skus');
    const unitsEl = document.getElementById('inv-metric-total-units');
    const alertsEl = document.getElementById('inv-metric-alerts');

    if (valEl) valEl.textContent = `$${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (skusEl) skusEl.textContent = `${INITIAL_PRODUCTS.length} SKUs`;
    if (unitsEl) unitsEl.textContent = `${totalUnits.toLocaleString()} Units`;
    if (alertsEl) alertsEl.textContent = `${lowStockCount} Items`;

    // 2. Render Godown Hubs Summary Cards
    const hubsSummaryEl = document.getElementById('godown-hubs-summary');
    if (hubsSummaryEl) {
        hubsSummaryEl.innerHTML = hubs.map(hub => {
            const unitsInHub = hubTotals[hub.id] || 0;
            const percentage = totalUnits > 0 ? Math.round((unitsInHub / totalUnits) * 100) : 0;

            return `
                <div class="hub-card" style="border-left: 4px solid ${hub.color};">
                    <div class="hub-card-header">
                        <div>
                            <span class="hub-code-badge" style="background:${hub.color};">${hub.code}</span>
                            <strong style="margin-left: 6px; font-size: 14px;">${hub.short}</strong>
                        </div>
                        <span style="font-size: 11px; color: #64748b;">${percentage}% Capacity</span>
                    </div>
                    <div style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 6px 0;">
                        ${unitsInHub.toLocaleString()} <span style="font-size: 13px; font-weight: 500; color: #64748b;">Units</span>
                    </div>
                    <div class="hub-stats">
                        <span style="font-size: 12px; color: #64748b;">${hub.name}</span>
                        <span style="font-weight: 700; color: ${hub.color};">Active</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 3. Filter & Render Inventory Table
    const filteredProducts = INITIAL_PRODUCTS.filter(p => {
        const matchesCat = (inventoryCategoryFilter === 'all' || p.category === inventoryCategoryFilter);
        const matchesSearch = p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
                              p.id.toLowerCase().includes(inventorySearchQuery.toLowerCase());

        const hCentral = (stockMap[p.id] && stockMap[p.id]["hub-central"] !== undefined) ? stockMap[p.id]["hub-central"] : 0;
        const hWest = (stockMap[p.id] && stockMap[p.id]["hub-west"] !== undefined) ? stockMap[p.id]["hub-west"] : 0;
        const hAirport = (stockMap[p.id] && stockMap[p.id]["hub-airport"] !== undefined) ? stockMap[p.id]["hub-airport"] : 0;
        const pTotal = hCentral + hWest + hAirport;

        let matchesStatus = true;
        if (inventoryStatusFilter === 'in-stock') matchesStatus = (pTotal > 5);
        else if (inventoryStatusFilter === 'low-stock') matchesStatus = (pTotal > 0 && pTotal <= 5);
        else if (inventoryStatusFilter === 'out-of-stock') matchesStatus = (pTotal === 0);

        return matchesCat && matchesSearch && matchesStatus;
    });

    const countEl = document.getElementById('inv-filtered-count');
    if (countEl) countEl.textContent = `Showing ${filteredProducts.length} of ${INITIAL_PRODUCTS.length} Products`;

    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    if (filteredProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #94a3b8;">
                    No products found matching the current search or filter criteria.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredProducts.map(p => {
        const hCentral = (stockMap[p.id] && stockMap[p.id]["hub-central"] !== undefined) ? stockMap[p.id]["hub-central"] : 0;
        const hWest = (stockMap[p.id] && stockMap[p.id]["hub-west"] !== undefined) ? stockMap[p.id]["hub-west"] : 0;
        const hAirport = (stockMap[p.id] && stockMap[p.id]["hub-airport"] !== undefined) ? stockMap[p.id]["hub-airport"] : 0;
        const pTotal = hCentral + hWest + hAirport;

        let statusBadge = '<span class="status-badge delivered">In Stock</span>';
        if (pTotal === 0) {
            statusBadge = '<span class="status-badge cancelled">Out of Stock</span>';
        } else if (pTotal <= 5) {
            statusBadge = '<span class="status-badge pending">Low Stock</span>';
        }

        const itemValuation = (pTotal * p.price).toFixed(2);

        return `
            <tr>
                <td>
                    <div class="product-cell">
                        <img src="${p.image}" alt="${p.name}" class="product-thumb">
                        <div>
                            <div class="product-meta-name">${p.name}</div>
                            <div class="product-meta-sku">${p.id} &bull; ${p.unit}</div>
                        </div>
                    </div>
                </td>
                <td><span style="font-size: 12px; color: #64748b;">${p.categoryName}</span></td>
                <td><strong>$${p.price.toFixed(2)}</strong></td>

                <!-- Hub A (Central) Stock Control -->
                <td>
                    <div class="stock-adjust-cell">
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-central', -1)">-</button>
                        <span class="hub-stock-val" style="color:#059669;">${hCentral}</span>
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-central', 1)">+</button>
                    </div>
                </td>

                <!-- Hub B (Westside) Stock Control -->
                <td>
                    <div class="stock-adjust-cell">
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-west', -1)">-</button>
                        <span class="hub-stock-val" style="color:#2563eb;">${hWest}</span>
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-west', 1)">+</button>
                    </div>
                </td>

                <!-- Hub C (Airport) Stock Control -->
                <td>
                    <div class="stock-adjust-cell">
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-airport', -1)">-</button>
                        <span class="hub-stock-val" style="color:#7c3aed;">${hAirport}</span>
                        <button class="btn-stock-adjust" onclick="adjustHubStock('${p.id}', 'hub-airport', 1)">+</button>
                    </div>
                </td>

                <!-- Total Stock -->
                <td><strong style="font-size: 15px;">${pTotal}</strong></td>
                <td>${statusBadge}</td>
                <td><strong>$${itemValuation}</strong></td>
            </tr>
        `;
    }).join('');
}

// Adjust Stock for a specific Hub and product
function adjustHubStock(productId, hubId, delta) {
    const stockMap = getStockDatabase();
    if (!stockMap[productId] || typeof stockMap[productId] === 'number') {
        stockMap[productId] = { "hub-central": 0, "hub-west": 0, "hub-airport": 0 };
    }
    const current = stockMap[productId][hubId] || 0;
    const updated = Math.max(0, current + delta);
    stockMap[productId][hubId] = updated;

    localStorage.setItem('freshgo_godown_stock', JSON.stringify(stockMap));
    renderInventoryDashboard();
}

// Batch Restock all low or out-of-stock items (+10 each hub)
function batchRestockLowItems() {
    const stockMap = getStockDatabase();
    let restockedCount = 0;

    INITIAL_PRODUCTS.forEach(p => {
        if (!stockMap[p.id] || typeof stockMap[p.id] === 'number') {
            stockMap[p.id] = { "hub-central": 10, "hub-west": 10, "hub-airport": 10 };
            restockedCount++;
        } else {
            const total = (stockMap[p.id]["hub-central"] || 0) + (stockMap[p.id]["hub-west"] || 0) + (stockMap[p.id]["hub-airport"] || 0);
            if (total <= 5) {
                stockMap[p.id]["hub-central"] = (stockMap[p.id]["hub-central"] || 0) + 10;
                stockMap[p.id]["hub-west"] = (stockMap[p.id]["hub-west"] || 0) + 8;
                stockMap[p.id]["hub-airport"] = (stockMap[p.id]["hub-airport"] || 0) + 6;
                restockedCount++;
            }
        }
    });

    localStorage.setItem('freshgo_godown_stock', JSON.stringify(stockMap));
    alert(`⚡ Successfully restocked ${restockedCount} low-inventory products across all 3 godowns!`);
    renderInventoryDashboard();
}

// Reset Stock to Defaults
function resetAllStockDefaults() {
    if (confirm('Are you sure you want to reset inventory stock for all 56 products to initial defaults?')) {
        localStorage.removeItem('freshgo_godown_stock');
        renderInventoryDashboard();
    }
}

// Setup Inventory Event Listeners
function setupInventoryEvents() {
    const searchInput = document.getElementById('inv-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            inventorySearchQuery = e.target.value.trim();
            renderInventoryDashboard();
        });
    }

    const catSelect = document.getElementById('inv-category-select');
    if (catSelect) {
        catSelect.addEventListener('change', (e) => {
            inventoryCategoryFilter = e.target.value;
            renderInventoryDashboard();
        });
    }

    const statusSelect = document.getElementById('inv-status-select');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            inventoryStatusFilter = e.target.value;
            renderInventoryDashboard();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupInventoryEvents();
    if (checkAdminAuthentication()) {
        renderInventoryDashboard();
        renderAdminDashboard();
    }
});
