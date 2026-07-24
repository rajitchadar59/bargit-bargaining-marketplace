const axios = require('axios');
const FormData = require('form-data');

// Tumhara Vendor Token (Wahi purana wala)
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjMzM2E5Mzk3NzdjMDk1YjViZGRkMCIsInJvbGUiOiJ2ZW5kb3IiLCJpYXQiOjE3ODQ4ODYxODUsImV4cCI6MTc4NzQ3ODE4NX0.3gNUujn3X-ZEg73NQJYUd6uH7Qrpjs_TnfBgBM1OGVw";

const API_URL = "http://localhost:5000/api/vendors/products/add"; 

// 20 New FIXED PRICE Products (2 per category) with Real Images
const products = [
  // --- MOBILES (FIXED PRICE) ---
  { name: "Google Pixel 8 Pro", description: "Advanced AI features, amazing camera.", category: "Mobiles", mrp: 106999, isBargainable: 'false', minBargainPrice: 106999, stock: 12, tags: JSON.stringify(["google", "pixel", "smartphone"]), specifications: JSON.stringify([{ key: "Storage", value: "256GB" }]), 
    imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80" },
  { name: "Nothing Phone (2)", description: "Unique Glyph Interface, transparent design.", category: "Mobiles", mrp: 44999, isBargainable: 'false', minBargainPrice: 44999, stock: 18, tags: JSON.stringify(["nothing", "android"]), specifications: JSON.stringify([{ key: "RAM", value: "12GB" }]), 
    imageUrl: "https://images.unsplash.com/photo-1688647573177-849514e8b3de?w=800&q=80" },

  // --- LAPTOPS (FIXED PRICE) ---
  { name: "HP Spectre x360", description: "Premium 2-in-1 convertible laptop.", category: "Laptops", mrp: 169999, isBargainable: 'false', minBargainPrice: 169999, stock: 5, tags: JSON.stringify(["hp", "laptop", "premium"]), specifications: JSON.stringify([{ key: "Screen", value: "OLED Touch" }]), 
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80" },
  { name: "ASUS ROG Strix G16", description: "High performance gaming laptop with RTX 4070.", category: "Laptops", mrp: 185000, isBargainable: 'false', minBargainPrice: 185000, stock: 7, tags: JSON.stringify(["asus", "gaming", "rog"]), specifications: JSON.stringify([{ key: "GPU", value: "RTX 4070" }]), 
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" },

  // --- FASHION (FIXED PRICE) ---
  { name: "Designer Silk Saree", description: "Authentic Kanjeevaram silk saree for weddings.", category: "Fashion", mrp: 15500, isBargainable: 'false', minBargainPrice: 15500, stock: 10, tags: JSON.stringify(["saree", "ethnic", "women"]), specifications: JSON.stringify([{ key: "Material", value: "Pure Silk" }]), 
    imageUrl: "https://images.unsplash.com/photo-1610189013233-0c46bcda9434?w=800&q=80" },
  { name: "Raymond Formal Suit", description: "Premium tailored two-piece suit.", category: "Fashion", mrp: 12000, isBargainable: 'false', minBargainPrice: 12000, stock: 15, tags: JSON.stringify(["suit", "formal", "men"]), specifications: JSON.stringify([{ key: "Color", value: "Navy Blue" }]), 
    imageUrl: "https://images.unsplash.com/photo-1594938298596-1c0953a948ec?w=800&q=80" },

  // --- SHOES (FIXED PRICE) ---
  { name: "Adidas Ultraboost Light", description: "Premium running shoes with max energy return.", category: "Shoes", mrp: 18999, isBargainable: 'false', minBargainPrice: 18999, stock: 20, tags: JSON.stringify(["adidas", "running", "shoes"]), specifications: JSON.stringify([{ key: "Cushioning", value: "Boost" }]), 
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80" },
  { name: "Puma Suede Classic X", description: "Iconic lifestyle sneakers.", category: "Shoes", mrp: 7999, isBargainable: 'false', minBargainPrice: 7999, stock: 35, tags: JSON.stringify(["puma", "sneakers", "casual"]), specifications: JSON.stringify([{ key: "Material", value: "Suede" }]), 
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80" },

  // --- WATCHES (FIXED PRICE) ---
  { name: "Seiko Prospex Diver's", description: "Professional automatic diving watch.", category: "Watches", mrp: 45000, isBargainable: 'false', minBargainPrice: 45000, stock: 8, tags: JSON.stringify(["seiko", "automatic", "diver"]), specifications: JSON.stringify([{ key: "Water Resistance", value: "200m" }]), 
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80" },
  { name: "Casio G-Shock Master", description: "Ultra-tough carbon core guard watch.", category: "Watches", mrp: 12995, isBargainable: 'false', minBargainPrice: 12995, stock: 25, tags: JSON.stringify(["casio", "gshock", "tough"]), specifications: JSON.stringify([{ key: "Type", value: "Digital-Analog" }]), 
    imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80" },

  // --- AUDIO (FIXED PRICE) ---
  { name: "Apple AirPods Pro (2nd Gen)", description: "Active noise cancellation, transparency mode.", category: "Audio", mrp: 24900, isBargainable: 'false', minBargainPrice: 24900, stock: 30, tags: JSON.stringify(["apple", "airpods", "tws"]), specifications: JSON.stringify([{ key: "Charging", value: "MagSafe / USB-C" }]), 
    imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aecb4d4554?w=800&q=80" },
  { name: "JBL Charge 5 Bluetooth Speaker", description: "Waterproof portable speaker with built-in powerbank.", category: "Audio", mrp: 14999, isBargainable: 'false', minBargainPrice: 14999, stock: 40, tags: JSON.stringify(["jbl", "speaker", "bluetooth"]), specifications: JSON.stringify([{ key: "Playtime", value: "20 Hours" }]), 
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" },

  // --- GROCERY (FIXED PRICE) ---
  { name: "Premium Kashmiri Saffron 1g", description: "100% pure Mongra saffron.", category: "Grocery", mrp: 550, isBargainable: 'false', minBargainPrice: 550, stock: 100, tags: JSON.stringify(["saffron", "spices", "premium"]), specifications: JSON.stringify([{ key: "Origin", value: "Kashmir" }]), 
    imageUrl: "https://images.unsplash.com/photo-1615486511484-92e172fc4ee0?w=800&q=80" },
  { name: "Himalayan Pink Salt 1kg", description: "Natural rock salt rich in minerals.", category: "Grocery", mrp: 199, isBargainable: 'false', minBargainPrice: 199, stock: 80, tags: JSON.stringify(["salt", "pinksalt", "cooking"]), specifications: JSON.stringify([{ key: "Type", value: "Rock Salt" }]), 
    imageUrl: "https://images.unsplash.com/photo-1628108503831-2fbff8f4989f?w=800&q=80" },

  // --- GYM (FIXED PRICE) ---
  { name: "Optimum Nutrition Whey Protein 2kg", description: "Gold standard 100% whey isolate.", category: "Gym", mrp: 7499, isBargainable: 'false', minBargainPrice: 7499, stock: 25, tags: JSON.stringify(["protein", "whey", "supplements"]), specifications: JSON.stringify([{ key: "Flavor", value: "Double Rich Chocolate" }]), 
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80" },
  { name: "Gymshark Seamless Leggings", description: "High-waisted workout leggings.", category: "Gym", mrp: 4500, isBargainable: 'false', minBargainPrice: 4500, stock: 35, tags: JSON.stringify(["gymwear", "leggings", "women"]), specifications: JSON.stringify([{ key: "Fit", value: "Compression" }]), 
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80" },

  // --- BOOKS (FIXED PRICE) ---
  { name: "Atomic Habits (Hardcover)", description: "Tiny changes, remarkable results by James Clear.", category: "Books", mrp: 799, isBargainable: 'false', minBargainPrice: 799, stock: 60, tags: JSON.stringify(["book", "selfhelp", "habits"]), specifications: JSON.stringify([{ key: "Author", value: "James Clear" }]), 
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80" },
  { name: "Sapiens: A Brief History of Humankind", description: "Groundbreaking book by Yuval Noah Harari.", category: "Books", mrp: 699, isBargainable: 'false', minBargainPrice: 699, stock: 50, tags: JSON.stringify(["book", "history", "nonfiction"]), specifications: JSON.stringify([{ key: "Pages", value: "464" }]), 
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80" },

  // --- DECOR (FIXED PRICE) ---
  { name: "Handwoven Jute Area Rug", description: "Eco-friendly natural jute rug (5x7 ft).", category: "Decor", mrp: 3500, isBargainable: 'false', minBargainPrice: 3500, stock: 20, tags: JSON.stringify(["rug", "jute", "homedecor"]), specifications: JSON.stringify([{ key: "Size", value: "5x7 ft" }]), 
    imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?w=800&q=80" },
  { name: "Minimalist Wall Clock", description: "Silent sweep wooden wall clock.", category: "Decor", mrp: 1499, isBargainable: 'false', minBargainPrice: 1499, stock: 45, tags: JSON.stringify(["clock", "wallart", "decor"]), specifications: JSON.stringify([{ key: "Material", value: "Wood" }]), 
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80" }
];

// Helper: Image download
async function fetchImageBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (err) {
        console.error("Image load fail:", err.message);
        throw err;
    }
}

// 3-Second Delay (Rate Limit Bypass)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seedViaAPI = async () => {
    console.log("🚀 Starting FIXED PRICE API Seeding...");

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        try {
            console.log(`⏳ [${i + 1}/${products.length}] Fetching real image: ${product.name}`);
            
            const imageBuffer = await fetchImageBuffer(product.imageUrl);

            const form = new FormData();
            form.append('name', product.name);
            form.append('description', product.description);
            form.append('category', product.category);
            form.append('mrp', product.mrp);
            form.append('isBargainable', product.isBargainable);
            form.append('minBargainPrice', product.minBargainPrice);
            form.append('stock', product.stock);
            form.append('tags', product.tags);
            form.append('specifications', product.specifications);
            
            form.append('images', imageBuffer, { filename: `product_${i}.jpg`, contentType: 'image/jpeg' });

            console.log(`📤 Uploading...`);
            const response = await axios.post(API_URL, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${TOKEN}`
                }
            });

            console.log(`✅ Success: ${response.data.message}`);

            // Unsplash safety delay
            await delay(3000);

        } catch (error) {
            console.error(`❌ Failed:`, error.response?.data?.message || error.message);
        }
    }
    console.log("🎉 Seeding Complete! Ab tumhara 'Fixed Price' filter test karne ke liye data ready hai.");
};

seedViaAPI();