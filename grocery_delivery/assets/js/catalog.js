/**
 * Module 2: Multi-Godown Catalog & Inventory Management
 * 56 Grocery items with distributed stock across 3 Fulfillment Hubs.
 */

const GODOWN_LOCATIONS = [
    { id: "hub-central", name: "Central Godown (Hub A - Downtown)", code: "HUB-A", short: "Central", color: "#10b981" },
    { id: "hub-west", name: "Westside Fulfillment (Hub B - Suburbs)", code: "HUB-B", short: "Westside", color: "#3b82f6" },
    { id: "hub-airport", name: "Airport Logistics Hub (Hub C - Metro)", code: "HUB-C", short: "Airport", color: "#8b5cf6" }
];

// 56 Multi-Location Grocery Products Inventory
const INITIAL_PRODUCTS = [
    // --- 1. FRUITS & VEGETABLES (prod-001 to prod-012) ---
    {
        id: "prod-001",
        name: "Fresh Organic Bananas",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.49,
        unit: "1 bunch (6 pcs)",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80",
        description: "Naturally ripened sweet organic bananas rich in potassium.",
        godowns: { "hub-central": 18, "hub-west": 12, "hub-airport": 10 }
    },
    {
        id: "prod-002",
        name: "Crisp Hass Avocados",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 4.50,
        unit: "3 Pack",
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=80",
        description: "Creamy, nutrient-rich ripe Hass avocados ready to eat.",
        godowns: { "hub-central": 12, "hub-west": 8, "hub-airport": 5 }
    },
    {
        id: "prod-003",
        name: "Honeycrisp Red Apples",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 3.99,
        unit: "1 kg (approx. 5 pcs)",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",
        description: "Crispy, juicy sweet Honeycrisp apples fresh from orchards.",
        godowns: { "hub-central": 20, "hub-west": 15, "hub-airport": 10 }
    },
    {
        id: "prod-004",
        name: "Sweet Valencia Oranges",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 4.29,
        unit: "1.5 kg Bag",
        image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=500&q=80",
        description: "Juicy, high-vitamin C Valencia citrus oranges.",
        godowns: { "hub-central": 14, "hub-west": 10, "hub-airport": 8 }
    },
    {
        id: "prod-005",
        name: "Fresh Organic Strawberries",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 4.99,
        unit: "400g Clamshell",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=500&q=80",
        description: "Sweet, sun-ripened red organic field strawberries.",
        godowns: { "hub-central": 9, "hub-west": 6, "hub-airport": 0 }
    },
    {
        id: "prod-006",
        name: "Baby Spinach Greens",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.99,
        unit: "250g Tub",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80",
        description: "Tender triple-washed organic young spinach leaves.",
        godowns: { "hub-central": 15, "hub-west": 10, "hub-airport": 6 }
    },
    {
        id: "prod-007",
        name: "Vine-Ripened Roma Tomatoes",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.49,
        unit: "1 kg",
        image: "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=500&q=80",
        description: "Firm, rich red Roma plum tomatoes for cooking and salads.",
        godowns: { "hub-central": 22, "hub-west": 14, "hub-airport": 12 }
    },
    {
        id: "prod-008",
        name: "Crisp Red Bell Peppers",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 3.49,
        unit: "3 Pack",
        image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=500&q=80",
        description: "Sweet, crunchy greenhouse-grown red bell peppers.",
        godowns: { "hub-central": 10, "hub-west": 8, "hub-airport": 4 }
    },
    {
        id: "prod-009",
        name: "English Seedless Cucumbers",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 1.89,
        unit: "2 pcs",
        image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=500&q=80",
        description: "Cool, crisp seedless long cucumbers wrapped fresh.",
        godowns: { "hub-central": 16, "hub-west": 12, "hub-airport": 9 }
    },
    {
        id: "prod-010",
        name: "Fresh Broccoli Crowns",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.75,
        unit: "500g Bunch",
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=500&q=80",
        description: "Dark green, nutrient-packed fresh broccoli florets.",
        godowns: { "hub-central": 11, "hub-west": 7, "hub-airport": 5 }
    },
    {
        id: "prod-011",
        name: "Organic Red Onions",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.19,
        unit: "1 kg Bag",
        image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80",
        description: "Pungent and flavorful organic red cooking onions.",
        godowns: { "hub-central": 25, "hub-west": 18, "hub-airport": 15 }
    },
    {
        id: "prod-012",
        name: "Juicy Seedless Lemons",
        category: "fruits-vegetables",
        categoryName: "Fruits & Veggies",
        price: 2.99,
        unit: "500g Bag (5-6 pcs)",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=500&q=80",
        description: "Zesty, vibrant yellow citrus lemons for drinks and dressing.",
        godowns: { "hub-central": 14, "hub-west": 10, "hub-airport": 8 }
    },
    // --- 2. DAIRY, EGGS & BAKERY (prod-013 to prod-022) ---
    {
        id: "prod-013",
        name: "Farm Fresh Whole Milk",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 3.89,
        unit: "1 Gallon (3.78 L)",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
        description: "Grade-A pasteurized whole vitamin D homogenized cow milk.",
        godowns: { "hub-central": 12, "hub-west": 8, "hub-airport": 6 }
    },
    {
        id: "prod-014",
        name: "Artisan Sourdough Bread",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 4.99,
        unit: "500g Loaf",
        image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=500&q=80",
        description: "Freshly baked artisan sourdough loaf with crispy golden crust.",
        godowns: { "hub-central": 8, "hub-west": 4, "hub-airport": 0 }
    },
    {
        id: "prod-015",
        name: "Free-Range Large Brown Eggs",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 4.49,
        unit: "12 Pack",
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=500&q=80",
        description: "Farm fresh pasture-raised Grade AA large brown eggs.",
        godowns: { "hub-central": 24, "hub-west": 18, "hub-airport": 12 }
    },
    {
        id: "prod-016",
        name: "Unsweetened Almond Milk",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 3.49,
        unit: "1 Quart (946 ml)",
        image: "https://images.unsplash.com/photo-1568651316499-de4e8f14dc89?auto=format&fit=crop&w=500&q=80",
        description: "Dairy-free creamy plant-based unsweetened almond milk.",
        godowns: { "hub-central": 14, "hub-west": 10, "hub-airport": 8 }
    },
    {
        id: "prod-017",
        name: "Greek Whole Milk Yogurt",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 5.29,
        unit: "907g Tub",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80",
        description: "Authentic thick strained Greek plain probiotic yogurt.",
        godowns: { "hub-central": 10, "hub-west": 6, "hub-airport": 4 }
    },
    {
        id: "prod-018",
        name: "Salted Sweet Cream Butter",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 3.99,
        unit: "454g (4 Sticks)",
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80",
        description: "Pure rich Grade AA creamy salted churned butter.",
        godowns: { "hub-central": 16, "hub-west": 12, "hub-airport": 10 }
    },
    {
        id: "prod-019",
        name: "Aged Sharp Cheddar Cheese",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 4.75,
        unit: "250g Block",
        image: "https://images.unsplash.com/photo-1618060932014-4deda4932554?auto=format&fit=crop&w=500&q=80",
        description: "Naturally aged sharp cheddar cheese block with bold flavor.",
        godowns: { "hub-central": 11, "hub-west": 7, "hub-airport": 5 }
    },
    {
        id: "prod-020",
        name: "Fresh Whole Milk Mozzarella",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 4.25,
        unit: "225g Ball",
        image: "https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=500&q=80",
        description: "Soft, delicate Italian style fresh mozzarella ball in brine.",
        godowns: { "hub-central": 8, "hub-west": 5, "hub-airport": 2 }
    },
    {
        id: "prod-021",
        name: "Butter Flaky Croissants",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 5.49,
        unit: "4 Pack",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
        description: "French bakery style golden layered buttery breakfast croissants.",
        godowns: { "hub-central": 7, "hub-west": 4, "hub-airport": 0 }
    },
    {
        id: "prod-022",
        name: "Organic Low-Fat Cottage Cheese",
        category: "dairy-bakery",
        categoryName: "Dairy & Bakery",
        price: 3.69,
        unit: "450g Tub",
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=500&q=80",
        description: "High-protein small curd low-fat organic cottage cheese.",
        godowns: { "hub-central": 13, "hub-west": 9, "hub-airport": 6 }
    },
    // --- 3. PANTRY & STAPLES (prod-023 to prod-032) ---
    {
        id: "prod-023",
        name: "Royal Aged Basmati Rice",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 14.99,
        unit: "5 kg Bag",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
        description: "Long-grain aromatic aged Himalayan Basmati rice.",
        godowns: { "hub-central": 15, "hub-west": 10, "hub-airport": 8 }
    },
    {
        id: "prod-024",
        name: "Extra Virgin Olive Oil",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 12.49,
        unit: "750 ml Glass Bottle",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
        description: "Cold-pressed authentic Mediterranean extra virgin olive oil.",
        godowns: { "hub-central": 9, "hub-west": 6, "hub-airport": 4 }
    },
    {
        id: "prod-025",
        name: "Organic White Quinoa",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 5.99,
        unit: "1 kg Pouch",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
        description: "Pre-washed protein-rich organic Peruvian white quinoa.",
        godowns: { "hub-central": 14, "hub-west": 8, "hub-airport": 6 }
    },
    {
        id: "prod-026",
        name: "Italian Bronze Spaghetti",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 2.29,
        unit: "500g Pack",
        image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=500&q=80",
        description: "Authentic 100% durum wheat semolina Italian spaghetti pasta.",
        godowns: { "hub-central": 30, "hub-west": 20, "hub-airport": 15 }
    },
    {
        id: "prod-027",
        name: "Organic Whole Wheat Flour",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 6.49,
        unit: "2 kg Bag",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
        description: "Stone-ground 100% organic unbleached whole wheat baking flour.",
        godowns: { "hub-central": 12, "hub-west": 9, "hub-airport": 5 }
    },
    {
        id: "prod-028",
        name: "Marinara Tomato Basil Sauce",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 3.79,
        unit: "680g Jar",
        image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=500&q=80",
        description: "Slow-simmered Italian plum tomato sauce with sweet basil & garlic.",
        godowns: { "hub-central": 16, "hub-west": 11, "hub-airport": 7 }
    },
    {
        id: "prod-029",
        name: "Organic Rolled Old Fashioned Oats",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 4.89,
        unit: "1 kg Tub",
        image: "https://images.unsplash.com/photo-1517093708454-e692484f7bdf?auto=format&fit=crop&w=500&q=80",
        description: "Whole grain gluten-free breakfast rolled oats for oatmeal & baking.",
        godowns: { "hub-central": 18, "hub-west": 14, "hub-airport": 10 }
    },
    {
        id: "prod-030",
        name: "Organic Black Beans",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 1.49,
        unit: "425g Can",
        image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=500&q=80",
        description: "Ready-to-eat organic cooked tender black beans with sea salt.",
        godowns: { "hub-central": 35, "hub-west": 25, "hub-airport": 20 }
    },
    {
        id: "prod-031",
        name: "Himalayan Coarse Pink Salt",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 3.25,
        unit: "500g Grinder",
        image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=500&q=80",
        description: "Pure natural unrefined mineral-rich Himalayan pink crystal salt.",
        godowns: { "hub-central": 20, "hub-west": 15, "hub-airport": 10 }
    },
    {
        id: "prod-032",
        name: "Pure Raw Wildflower Honey",
        category: "pantry-staples",
        categoryName: "Pantry & Staples",
        price: 7.99,
        unit: "500g Jar",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80",
        description: "100% raw unpasteurized natural golden wildflower honey.",
        godowns: { "hub-central": 10, "hub-west": 6, "hub-airport": 4 }
    },
    // --- 4. BEVERAGES & SNACKS (prod-033 to prod-042) ---
    {
        id: "prod-033",
        name: "Nitro Cold Brew Coffee",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 3.49,
        unit: "330 ml Can",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80",
        description: "Smooth nitrogen-infused black arabica cold brew coffee.",
        godowns: { "hub-central": 25, "hub-west": 18, "hub-airport": 12 }
    },
    {
        id: "prod-034",
        name: "Dark Chocolate Almond Granola",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 6.75,
        unit: "400g Pouch",
        image: "https://images.unsplash.com/photo-1517093708454-e692484f7bdf?auto=format&fit=crop&w=500&q=80",
        description: "Oven-roasted rolled oats with almonds & 70% dark chocolate.",
        godowns: { "hub-central": 14, "hub-west": 10, "hub-airport": 6 }
    },
    {
        id: "prod-035",
        name: "Japanese Organic Green Tea",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 4.99,
        unit: "25 Tea Bags Box",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
        description: "Antioxidant-rich Japanese Sencha steamed green tea bags.",
        godowns: { "hub-central": 16, "hub-west": 12, "hub-airport": 8 }
    },
    {
        id: "prod-036",
        name: "Sparkling Mineral Water",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 2.19,
        unit: "750 ml Glass Bottle",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=500&q=80",
        description: "Naturally carbonated crisp Alpine spring mineral water.",
        godowns: { "hub-central": 28, "hub-west": 20, "hub-airport": 15 }
    },
    {
        id: "prod-037",
        name: "Roasted Salted Whole Cashews",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 8.49,
        unit: "350g Resealable Bag",
        image: "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?auto=format&fit=crop&w=500&q=80",
        description: "Jumbo premium whole roasted cashews with light sea salt.",
        godowns: { "hub-central": 12, "hub-west": 8, "hub-airport": 5 }
    },
    {
        id: "prod-038",
        name: "Artisan Sea Salt Kettle Chips",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 3.29,
        unit: "200g Bag",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
        description: "Batch-cooked thick cut crispy potato chips with sea salt.",
        godowns: { "hub-central": 22, "hub-west": 16, "hub-airport": 10 }
    },
    {
        id: "prod-039",
        name: "Fresh Pressed Orange Juice",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 4.49,
        unit: "1 L Bottle",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80",
        description: "100% pure squeezed Florida orange juice with pulp.",
        godowns: { "hub-central": 10, "hub-west": 7, "hub-airport": 4 }
    },
    {
        id: "prod-040",
        name: "Pure Young Coconut Water",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 2.89,
        unit: "500 ml Tetra",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
        description: "Naturally hydrating pure coconut water packed with electrolytes.",
        godowns: { "hub-central": 20, "hub-west": 15, "hub-airport": 10 }
    },
    {
        id: "prod-041",
        name: "Dark Chocolate Peanut Protein Bars",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 9.99,
        unit: "5 Pack Box",
        image: "https://images.unsplash.com/photo-1622484216805-4f3316bcf125?auto=format&fit=crop&w=500&q=80",
        description: "20g protein plant-based peanut butter energy snack bars.",
        godowns: { "hub-central": 15, "hub-west": 11, "hub-airport": 7 }
    },
    {
        id: "prod-042",
        name: "Chamomile Blossom Herbal Tea",
        category: "beverages-snacks",
        categoryName: "Beverages & Snacks",
        price: 4.25,
        unit: "20 Bags Box",
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=500&q=80",
        description: "Caffeine-free soothing pure Egyptian chamomile herbal tea.",
        godowns: { "hub-central": 18, "hub-west": 12, "hub-airport": 8 }
    },
    // --- 5. MEAT, POULTRY & SEAFOOD (prod-043 to prod-050) ---
    {
        id: "prod-043",
        name: "Fresh Atlantic Salmon Fillet",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 13.99,
        unit: "500g Fillet",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80",
        description: "Wild-caught skin-on fresh Norwegian Atlantic salmon fillet.",
        godowns: { "hub-central": 10, "hub-west": 6, "hub-airport": 4 }
    },
    {
        id: "prod-044",
        name: "Organic Boneless Chicken Breasts",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 9.49,
        unit: "1 kg Pack",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80",
        description: "Air-chilled skinless antibiotic-free organic chicken breasts.",
        godowns: { "hub-central": 15, "hub-west": 10, "hub-airport": 8 }
    },
    {
        id: "prod-045",
        name: "Grass-Fed Lean Ground Beef (85/15)",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 8.99,
        unit: "500g Brick",
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=500&q=80",
        description: "100% pasture-raised grass-fed lean ground beef.",
        godowns: { "hub-central": 12, "hub-west": 8, "hub-airport": 5 }
    },
    {
        id: "prod-046",
        name: "Jumbo Raw Tiger Prawns",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 15.49,
        unit: "400g Pouch (16-20 count)",
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=500&q=80",
        description: "Peeled & deveined tail-on sweet jumbo ocean tiger prawns.",
        godowns: { "hub-central": 8, "hub-west": 5, "hub-airport": 3 }
    },
    {
        id: "prod-047",
        name: "Applewood Smoked Turkey Bacon",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 4.99,
        unit: "340g Pack",
        image: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=500&q=80",
        description: "Naturally cured hardwood applewood smoked lean turkey bacon.",
        godowns: { "hub-central": 14, "hub-west": 9, "hub-airport": 6 }
    },
    {
        id: "prod-048",
        name: "Cold Smoked Norwegian Salmon Slices",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 8.79,
        unit: "150g Pack",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80",
        description: "Traditional oak-smoked thinly sliced Norwegian salmon.",
        godowns: { "hub-central": 9, "hub-west": 5, "hub-airport": 2 }
    },
    {
        id: "prod-049",
        name: "Prime Center-Cut Pork Chops",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 7.99,
        unit: "600g (2 Thick Chops)",
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=500&q=80",
        description: "Bone-in tender premium center-cut juicy pork loin chops.",
        godowns: { "hub-central": 11, "hub-west": 7, "hub-airport": 4 }
    },
    {
        id: "prod-050",
        name: "Free-Range Chicken Drumsticks",
        category: "meat-seafood",
        categoryName: "Meat & Seafood",
        price: 5.49,
        unit: "800g (approx. 6 pcs)",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80",
        description: "Plump, juicy free-range bone-in chicken drumsticks.",
        godowns: { "hub-central": 16, "hub-west": 11, "hub-airport": 7 }
    },
    // --- 6. HOUSEHOLD & PERSONAL CARE (prod-051 to prod-056) ---
    {
        id: "prod-051",
        name: "Plant-Based Citrus Dish Soap",
        category: "home-care",
        categoryName: "Home & Care",
        price: 3.99,
        unit: "739 ml Bottle",
        image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80",
        description: "Biodegradable grease-cutting natural lemon dishwashing liquid.",
        godowns: { "hub-central": 22, "hub-west": 16, "hub-airport": 12 }
    },
    {
        id: "prod-052",
        name: "Eco-Friendly Concentrated Laundry Detergent",
        category: "home-care",
        categoryName: "Home & Care",
        price: 11.99,
        unit: "1.5 L (64 Loads)",
        image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=500&q=80",
        description: "Hypoallergenic lavender organic liquid laundry detergent.",
        godowns: { "hub-central": 14, "hub-west": 10, "hub-airport": 8 }
    },
    {
        id: "prod-053",
        name: "Hydrating Aloe Vera Hand Sanitizer Gel",
        category: "home-care",
        categoryName: "Home & Care",
        price: 2.99,
        unit: "250 ml Pump Bottle",
        image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=500&q=80",
        description: "70% alcohol antibacterial hand sanitizer with soothing aloe.",
        godowns: { "hub-central": 30, "hub-west": 20, "hub-airport": 18 }
    },
    {
        id: "prod-054",
        name: "100% Bamboo Paper Towels",
        category: "home-care",
        categoryName: "Home & Care",
        price: 6.49,
        unit: "3 Double Rolls Pack",
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80",
        description: "Tree-free ultra-absorbent 2-ply sustainable bamboo towels.",
        godowns: { "hub-central": 18, "hub-west": 14, "hub-airport": 9 }
    },
    {
        id: "prod-055",
        name: "Natural Herbal Mint Body Wash",
        category: "home-care",
        categoryName: "Home & Care",
        price: 5.75,
        unit: "500 ml Bottle",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
        description: "Refreshing eucalyptus and peppermint moisturizing body wash.",
        godowns: { "hub-central": 15, "hub-west": 10, "hub-airport": 6 }
    },
    {
        id: "prod-056",
        name: "Whitening Coconut Oil Toothpaste",
        category: "home-care",
        categoryName: "Home & Care",
        price: 4.25,
        unit: "120g Tube",
        image: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=500&q=80",
        description: "Fluoride-free natural coconut oil and baking soda whitening paste.",
        godowns: { "hub-central": 20, "hub-west": 15, "hub-airport": 12 }
    }
];

// Initialize or load current Stock from localStorage (Multi-Godown Support)
function getStockDatabase() {
    const savedStock = localStorage.getItem('freshgo_godown_stock');
    if (!savedStock) {
        const stockMap = {};
        INITIAL_PRODUCTS.forEach(p => {
            stockMap[p.id] = {
                "hub-central": p.godowns["hub-central"] || 0,
                "hub-west": p.godowns["hub-west"] || 0,
                "hub-airport": p.godowns["hub-airport"] || 0
            };
        });
        localStorage.setItem('freshgo_godown_stock', JSON.stringify(stockMap));
        return stockMap;
    }
    try {
        const parsed = JSON.parse(savedStock);
        INITIAL_PRODUCTS.forEach(p => {
            if (!parsed[p.id] || typeof parsed[p.id] === 'number') {
                const legacyVal = typeof parsed[p.id] === 'number' ? parsed[p.id] : 10;
                parsed[p.id] = {
                    "hub-central": Math.floor(legacyVal * 0.5),
                    "hub-west": Math.floor(legacyVal * 0.3),
                    "hub-airport": Math.floor(legacyVal * 0.2)
                };
            }
        });
        return parsed;
    } catch (e) {
        return {};
    }
}

// Compute total stock across all godowns
function getProductStock(productId) {
    const stockMap = getStockDatabase();
    const pStock = stockMap[productId];
    if (!pStock) return 0;
    if (typeof pStock === 'number') return pStock;
    return (pStock["hub-central"] || 0) + (pStock["hub-west"] || 0) + (pStock["hub-airport"] || 0);
}

// Retrieve stock at a specific godown location
function getGodownLocationStock(productId, godownId) {
    const stockMap = getStockDatabase();
    const pStock = stockMap[productId];
    if (!pStock) return 0;
    if (typeof pStock === 'number') return Math.floor(pStock / 3);
    return pStock[godownId] !== undefined ? pStock[godownId] : 0;
}

// Update specific godown location stock
function updateGodownLocationStock(productId, godownId, newQty) {
    const stockMap = getStockDatabase();
    if (!stockMap[productId] || typeof stockMap[productId] === 'number') {
        stockMap[productId] = { "hub-central": 0, "hub-west": 0, "hub-airport": 0 };
    }
    stockMap[productId][godownId] = Math.max(0, parseInt(newQty) || 0);
    localStorage.setItem('freshgo_godown_stock', JSON.stringify(stockMap));
}

// Update Godown Stock with order deduction distribution
function updateGodownStock(productId, newStock) {
    const stockMap = getStockDatabase();
    if (!stockMap[productId] || typeof stockMap[productId] === 'number') {
        stockMap[productId] = { "hub-central": 0, "hub-west": 0, "hub-airport": 0 };
    }
    const currentTotal = getProductStock(productId);
    const delta = newStock - currentTotal;

    if (delta < 0) {
        let needToDeduct = Math.abs(delta);
        const hubs = ["hub-central", "hub-west", "hub-airport"];
        for (const hub of hubs) {
            const avail = stockMap[productId][hub] || 0;
            const take = Math.min(avail, needToDeduct);
            stockMap[productId][hub] = avail - take;
            needToDeduct -= take;
            if (needToDeduct <= 0) break;
        }
    } else {
        stockMap[productId]["hub-central"] = (stockMap[productId]["hub-central"] || 0) + delta;
    }
    localStorage.setItem('freshgo_godown_stock', JSON.stringify(stockMap));
}

// Current Filter state
let currentCategory = 'all';
let currentSearchQuery = '';

// Render Products Grid
function renderCatalog() {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('product-count');
    if (!grid) return;

    const stockMap = getStockDatabase();
    const cart = (typeof getCart === 'function') ? getCart() : [];

    // Filter by category and search
    const filtered = INITIAL_PRODUCTS.filter(product => {
        const matchesCategory = (currentCategory === 'all' || product.category === currentCategory);
        const matchesSearch = product.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                              product.description.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} products`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <h3>No grocery items found</h3>
                <p>Try refining your search term or select a different category.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const currentStock = stockMap[product.id] !== undefined ? stockMap[product.id] : product.stock;

        // Find how many of this item is currently inside the user's cart
        const cartItem = cart.find(item => item.id === product.id);
        const inCartQty = cartItem ? cartItem.qty : 0;
        const availableStock = currentStock - inCartQty;

        // Stock Badge Logic
        let badgeHtml = '';
        let isDisabled = false;
        let buttonText = 'Add to Cart';

        if (currentStock <= 0 || availableStock <= 0) {
            badgeHtml = `<span class="stock-badge out-of-stock">Out of Stock</span>`;
            isDisabled = true;
            buttonText = currentStock <= 0 ? 'Out of Stock' : 'Max in Cart';
        } else if (currentStock <= 3) {
            badgeHtml = `<span class="stock-badge low-stock">Only ${currentStock} Left</span>`;
        } else {
            badgeHtml = `<span class="stock-badge in-stock">In Stock (${currentStock})</span>`;
        }

        return `
            <div class="product-card" id="card-${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <span class="category-tag">${product.categoryName}</span>
                    ${badgeHtml}
                </div>
                <div class="product-body">
                    <div class="product-unit">${product.unit}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">$${product.price.toFixed(2)} <span>/ unit</span></div>
                        <button
                            class="btn-add-cart"
                            ${isDisabled ? 'disabled' : ''}
                            onclick="handleAddToCart('${product.id}')"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Category filter and search bindings
function setupCatalogEvents() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderCatalog();
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.trim();
            renderCatalog();
        });
    }
}

// Helper to find product metadata
function getProductById(id) {
    return INITIAL_PRODUCTS.find(p => p.id === id);
}
