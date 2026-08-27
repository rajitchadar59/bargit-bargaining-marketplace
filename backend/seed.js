const axios = require('axios');
const FormData = require('form-data');

// Aapka Vendor Token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOTBhMTgxMDM1Njg0MTc1NTRiN2VhMiIsInJvbGUiOiJ2ZW5kb3IiLCJpYXQiOjE3ODc4NjM0MjUsImV4cCI6MTc5MDQ1NTQyNX0.Bwoi7vWgwmdjN_942Ixs2MrjOB8xtUEnKifRxjC5dfI";
const API_URL = "http://localhost:5000/api/vendors/products/add"; 

const products = [
  // =================== MOBILES ===================
  // FIXED PRICE (5)
  { name: "iPhone 15 Pro Max", description: "Titanium design, A17 Pro chip.", category: "Mobiles", mrp: 159900, isBargainable: 'false', minBargainPrice: 159900, stock: 10, tags: JSON.stringify(["apple", "iphone"]), specifications: JSON.stringify([{ key: "Storage", value: "256GB" }]), imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80" },
  { name: "Samsung Galaxy S24 Ultra", description: "Galaxy AI, 200MP camera.", category: "Mobiles", mrp: 129999, isBargainable: 'false', minBargainPrice: 129999, stock: 15, tags: JSON.stringify(["samsung", "android"]), specifications: JSON.stringify([{ key: "RAM", value: "12GB" }]), imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80" },
  { name: "Google Pixel 8 Pro", description: "Advanced AI photography.", category: "Mobiles", mrp: 106999, isBargainable: 'false', minBargainPrice: 106999, stock: 8, tags: JSON.stringify(["google", "pixel"]), specifications: JSON.stringify([{ key: "Camera", value: "50MP" }]), imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=800&q=80" },
  { name: "OnePlus 12", description: "Snapdragon 8 Gen 3, Hasselblad Camera.", category: "Mobiles", mrp: 64999, isBargainable: 'false', minBargainPrice: 64999, stock: 20, tags: JSON.stringify(["oneplus", "fast"]), specifications: JSON.stringify([{ key: "Battery", value: "5400mAh" }]), imageUrl: "https://images.unsplash.com/photo-1678911820864-e4c567cf70ce?w=800&q=80" },
  { name: "Nothing Phone (2)", description: "Glyph interface, transparent back.", category: "Mobiles", mrp: 44999, isBargainable: 'false', minBargainPrice: 44999, stock: 12, tags: JSON.stringify(["nothing", "unique"]), specifications: JSON.stringify([{ key: "Display", value: "OLED" }]), imageUrl: "https://images.unsplash.com/photo-1688647573177-849514e8b3de?w=800&q=80" },
  // BARGAINABLE (5)
  { name: "Refurbished iPhone 13", description: "Mint condition, 100% battery.", category: "Mobiles", mrp: 45000, isBargainable: 'true', minBargainPrice: 38000, stock: 5, tags: JSON.stringify(["apple", "used"]), specifications: JSON.stringify([{ key: "Condition", value: "Like New" }]), imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80" },
  { name: "Used Samsung S22", description: "Slight scratches, works perfectly.", category: "Mobiles", mrp: 35000, isBargainable: 'true', minBargainPrice: 28000, stock: 3, tags: JSON.stringify(["samsung", "used"]), specifications: JSON.stringify([{ key: "Warranty", value: "None" }]), imageUrl: "https://images.unsplash.com/photo-1644982647708-0b2cc3d910b7?w=800&q=80" },
  { name: "Redmi Note 13 Pro (Open Box)", category: "Mobiles", description: "Seal broken, unused.", mrp: 22000, isBargainable: 'true', minBargainPrice: 19500, stock: 2, tags: JSON.stringify(["redmi", "budget"]), specifications: JSON.stringify([{ key: "Storage", value: "128GB" }]), imageUrl: "https://images.unsplash.com/photo-1678911820864-e4c567cf70ce?w=800&q=80" },
  { name: "Poco X6 Neo", description: "Great for budget gaming.", category: "Mobiles", mrp: 18000, isBargainable: 'true', minBargainPrice: 15500, stock: 7, tags: JSON.stringify(["poco", "gaming"]), specifications: JSON.stringify([{ key: "Refresh Rate", value: "120Hz" }]), imageUrl: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80" },
  { name: "Realme 12 Pro", description: "Good camera, premium leather back.", category: "Mobiles", mrp: 26000, isBargainable: 'true', minBargainPrice: 23000, stock: 4, tags: JSON.stringify(["realme", "camera"]), specifications: JSON.stringify([{ key: "Design", value: "Vegan Leather" }]), imageUrl: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=800&q=80" },

  // =================== LAPTOPS ===================
  // FIXED PRICE (5)
  { name: "MacBook Pro M3 Max", description: "Top tier performance for professionals.", category: "Laptops", mrp: 319900, isBargainable: 'false', minBargainPrice: 319900, stock: 3, tags: JSON.stringify(["apple", "macbook"]), specifications: JSON.stringify([{ key: "Chip", value: "M3 Max" }]), imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
  { name: "Dell XPS 15", description: "InfinityEdge display, premium build.", category: "Laptops", mrp: 185000, isBargainable: 'false', minBargainPrice: 185000, stock: 6, tags: JSON.stringify(["dell", "windows"]), specifications: JSON.stringify([{ key: "Display", value: "4K OLED" }]), imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" },
  { name: "Asus ROG Strix Scar", description: "Hardcore gaming laptop with RTX 4080.", category: "Laptops", mrp: 245000, isBargainable: 'false', minBargainPrice: 245000, stock: 5, tags: JSON.stringify(["asus", "gaming"]), specifications: JSON.stringify([{ key: "GPU", value: "RTX 4080" }]), imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" },
  { name: "HP Spectre x360", description: "Sleek 2-in-1 convertible.", category: "Laptops", mrp: 155000, isBargainable: 'false', minBargainPrice: 155000, stock: 8, tags: JSON.stringify(["hp", "touch"]), specifications: JSON.stringify([{ key: "Form", value: "Convertible" }]), imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80" },
  { name: "Lenovo ThinkPad X1", description: "Business class durable laptop.", category: "Laptops", mrp: 140000, isBargainable: 'false', minBargainPrice: 140000, stock: 10, tags: JSON.stringify(["lenovo", "business"]), specifications: JSON.stringify([{ key: "Keyboard", value: "Spill Resistant" }]), imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" },
  // BARGAINABLE (5)
  { name: "Used MacBook Air M1", description: "Minor dents, perfect working condition.", category: "Laptops", mrp: 55000, isBargainable: 'true', minBargainPrice: 48000, stock: 2, tags: JSON.stringify(["apple", "used"]), specifications: JSON.stringify([{ key: "Battery Cycle", value: "350" }]), imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" },
  { name: "Acer Swift 3 (Display Unit)", description: "Shop display unit, untouched.", category: "Laptops", mrp: 45000, isBargainable: 'true', minBargainPrice: 39000, stock: 1, tags: JSON.stringify(["acer", "budget"]), specifications: JSON.stringify([{ key: "Condition", value: "Display Model" }]), imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80" },
  { name: "Second-hand HP Pavilion", description: "Gaming laptop, 2 years old.", category: "Laptops", mrp: 35000, isBargainable: 'true', minBargainPrice: 28000, stock: 3, tags: JSON.stringify(["hp", "gaming", "used"]), specifications: JSON.stringify([{ key: "GPU", value: "GTX 1650" }]), imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" },
  { name: "Lenovo IdeaPad Slim 3", description: "Student laptop, slightly used.", category: "Laptops", mrp: 25000, isBargainable: 'true', minBargainPrice: 21000, stock: 5, tags: JSON.stringify(["lenovo", "student"]), specifications: JSON.stringify([{ key: "RAM", value: "8GB" }]), imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" },
  { name: "Asus VivoBook 15", description: "Great for office work, open box.", category: "Laptops", mrp: 38000, isBargainable: 'true', minBargainPrice: 33000, stock: 4, tags: JSON.stringify(["asus", "office"]), specifications: JSON.stringify([{ key: "Storage", value: "512GB SSD" }]), imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },

  // =================== FASHION ===================
  // FIXED PRICE (5)
  { name: "Designer Silk Saree", description: "Authentic Kanjeevaram silk.", category: "Fashion", mrp: 15500, isBargainable: 'false', minBargainPrice: 15500, stock: 10, tags: JSON.stringify(["saree", "ethnic"]), specifications: JSON.stringify([{ key: "Material", value: "Pure Silk" }]), imageUrl: "https://images.unsplash.com/photo-1610189013233-0c46bcda9434?w=800&q=80" },
  { name: "Raymond Formal Suit", description: "Premium tailored two-piece suit.", category: "Fashion", mrp: 12000, isBargainable: 'false', minBargainPrice: 12000, stock: 15, tags: JSON.stringify(["suit", "formal"]), specifications: JSON.stringify([{ key: "Color", value: "Navy Blue" }]), imageUrl: "https://images.unsplash.com/photo-1594938298596-1c0953a948ec?w=800&q=80" },
  { name: "Levi's 501 Original Jeans", description: "Classic straight fit denim.", category: "Fashion", mrp: 3499, isBargainable: 'false', minBargainPrice: 3499, stock: 30, tags: JSON.stringify(["jeans", "casual"]), specifications: JSON.stringify([{ key: "Fit", value: "Straight" }]), imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
  { name: "Zara Overcoat", description: "Winter essential wool overcoat.", category: "Fashion", mrp: 8990, isBargainable: 'false', minBargainPrice: 8990, stock: 12, tags: JSON.stringify(["winter", "coat"]), specifications: JSON.stringify([{ key: "Material", value: "Wool Blend" }]), imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80" },
  { name: "H&M Floral Dress", description: "Summer collection midi dress.", category: "Fashion", mrp: 2299, isBargainable: 'false', minBargainPrice: 2299, stock: 25, tags: JSON.stringify(["dress", "summer"]), specifications: JSON.stringify([{ key: "Length", value: "Midi" }]), imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80" },
  // BARGAINABLE (5)
  { name: "Local Boutique Kurti Set", description: "Hand-embroidered cotton kurti.", category: "Fashion", mrp: 1500, isBargainable: 'true', minBargainPrice: 1100, stock: 20, tags: JSON.stringify(["kurti", "ethnic"]), specifications: JSON.stringify([{ key: "Work", value: "Embroidery" }]), imageUrl: "https://images.unsplash.com/photo-1610189013233-0c46bcda9434?w=800&q=80" },
  { name: "Unbranded Denim Jacket", description: "Streetwear style oversized jacket.", category: "Fashion", mrp: 1800, isBargainable: 'true', minBargainPrice: 1300, stock: 15, tags: JSON.stringify(["jacket", "denim"]), specifications: JSON.stringify([{ key: "Fit", value: "Oversized" }]), imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
  { name: "Wholesale Graphic T-Shirts (Pack of 3)", description: "Cotton tees with funky prints.", category: "Fashion", mrp: 999, isBargainable: 'true', minBargainPrice: 750, stock: 40, tags: JSON.stringify(["tshirt", "casual"]), specifications: JSON.stringify([{ key: "Material", value: "100% Cotton" }]), imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { name: "Surplus Winter Sweater", description: "Warm knitted sweater, factory surplus.", category: "Fashion", mrp: 1200, isBargainable: 'true', minBargainPrice: 850, stock: 25, tags: JSON.stringify(["sweater", "winter"]), specifications: JSON.stringify([{ key: "Neck", value: "Turtleneck" }]), imageUrl: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80" },
  { name: "Custom Stitched Lehenga", description: "Ready to wear party lehenga.", category: "Fashion", mrp: 4500, isBargainable: 'true', minBargainPrice: 3200, stock: 5, tags: JSON.stringify(["lehenga", "wedding"]), specifications: JSON.stringify([{ key: "Size", value: "Free Size" }]), imageUrl: "https://images.unsplash.com/photo-1594938298596-1c0953a948ec?w=800&q=80" },

  // =================== WATCHES ===================
  // FIXED PRICE (5)
  { name: "Rolex Submariner", description: "Luxury diving watch.", category: "Watches", mrp: 950000, isBargainable: 'false', minBargainPrice: 950000, stock: 1, tags: JSON.stringify(["rolex", "luxury"]), specifications: JSON.stringify([{ key: "Movement", value: "Automatic" }]), imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80" },
  { name: "Seiko Prospex", description: "Professional diver's watch.", category: "Watches", mrp: 45000, isBargainable: 'false', minBargainPrice: 45000, stock: 5, tags: JSON.stringify(["seiko", "diver"]), specifications: JSON.stringify([{ key: "Water Resistance", value: "200m" }]), imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80" },
  { name: "Casio G-Shock", description: "Tough carbon core guard.", category: "Watches", mrp: 9999, isBargainable: 'false', minBargainPrice: 9999, stock: 15, tags: JSON.stringify(["casio", "tough"]), specifications: JSON.stringify([{ key: "Type", value: "Digital-Analog" }]), imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80" },
  { name: "Tissot PRX", description: "Retro integrated bracelet design.", category: "Watches", mrp: 35000, isBargainable: 'false', minBargainPrice: 35000, stock: 8, tags: JSON.stringify(["tissot", "retro"]), specifications: JSON.stringify([{ key: "Glass", value: "Sapphire" }]), imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80" },
  { name: "Apple Watch Series 9", description: "Advanced health tracking.", category: "Watches", mrp: 41900, isBargainable: 'false', minBargainPrice: 41900, stock: 20, tags: JSON.stringify(["apple", "smartwatch"]), specifications: JSON.stringify([{ key: "OS", value: "watchOS" }]), imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80" },
  // BARGAINABLE (5)
  { name: "Used Apple Watch SE", description: "1 year old, minor scratches on screen.", category: "Watches", mrp: 20000, isBargainable: 'true', minBargainPrice: 15000, stock: 3, tags: JSON.stringify(["apple", "used"]), specifications: JSON.stringify([{ key: "Battery Health", value: "88%" }]), imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80" },
  { name: "Vintage HMT Janata", description: "Rare hand-wound mechanical watch.", category: "Watches", mrp: 4000, isBargainable: 'true', minBargainPrice: 2500, stock: 2, tags: JSON.stringify(["vintage", "mechanical"]), specifications: JSON.stringify([{ key: "Movement", value: "Hand-wound" }]), imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80" },
  { name: "Local Smartwatch Replica", description: "Looks like premium watch, basic features.", category: "Watches", mrp: 1500, isBargainable: 'true', minBargainPrice: 900, stock: 30, tags: JSON.stringify(["replica", "cheap"]), specifications: JSON.stringify([{ key: "Compatibility", value: "Android/iOS" }]), imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80" },
  { name: "Unbranded Minimalist Watch", description: "Clean design for daily wear.", category: "Watches", mrp: 800, isBargainable: 'true', minBargainPrice: 500, stock: 50, tags: JSON.stringify(["minimal", "budget"]), specifications: JSON.stringify([{ key: "Strap", value: "PU Leather" }]), imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80" },
  { name: "Pre-owned Fossil Chronograph", description: "Needs battery replacement.", category: "Watches", mrp: 6000, isBargainable: 'true', minBargainPrice: 3500, stock: 1, tags: JSON.stringify(["fossil", "used"]), specifications: JSON.stringify([{ key: "Condition", value: "Needs Battery" }]), imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80" },

  // =================== AUDIO ===================
  // FIXED PRICE (5)
  { name: "Sony WH-1000XM5", description: "Industry leading noise cancellation.", category: "Audio", mrp: 29990, isBargainable: 'false', minBargainPrice: 29990, stock: 10, tags: JSON.stringify(["sony", "headphones"]), specifications: JSON.stringify([{ key: "Feature", value: "ANC" }]), imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" },
  { name: "Apple AirPods Pro 2", description: "MagSafe charging, superior sound.", category: "Audio", mrp: 24900, isBargainable: 'false', minBargainPrice: 24900, stock: 25, tags: JSON.stringify(["apple", "earbuds"]), specifications: JSON.stringify([{ key: "Chip", value: "H2" }]), imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aecb4d4554?w=800&q=80" },
  { name: "JBL Charge 5", description: "Waterproof portable bluetooth speaker.", category: "Audio", mrp: 14999, isBargainable: 'false', minBargainPrice: 14999, stock: 15, tags: JSON.stringify(["jbl", "speaker"]), specifications: JSON.stringify([{ key: "Battery", value: "20 Hours" }]), imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" },
  { name: "Marshall Acton II", description: "Classic vintage design home speaker.", category: "Audio", mrp: 24999, isBargainable: 'false', minBargainPrice: 24999, stock: 5, tags: JSON.stringify(["marshall", "homeaudio"]), specifications: JSON.stringify([{ key: "Connectivity", value: "Bluetooth 5.0" }]), imageUrl: "https://images.unsplash.com/photo-1545454675-a63b2c2eb9a1?w=800&q=80" },
  { name: "Bose SoundLink Flex", description: "Rugged outdoor speaker.", category: "Audio", mrp: 15900, isBargainable: 'false', minBargainPrice: 15900, stock: 12, tags: JSON.stringify(["bose", "portable"]), specifications: JSON.stringify([{ key: "Rating", value: "IP67" }]), imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" },
  // BARGAINABLE (5)
  { name: "Open Box Boat Airdopes", description: "Box opened, never used.", category: "Audio", mrp: 1500, isBargainable: 'true', minBargainPrice: 1000, stock: 8, tags: JSON.stringify(["boat", "budget"]), specifications: JSON.stringify([{ key: "Condition", value: "Open Box" }]), imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aecb4d4554?w=800&q=80" },
  { name: "Used Sony Headphones", description: "Earpads slightly worn out.", category: "Audio", mrp: 8000, isBargainable: 'true', minBargainPrice: 5500, stock: 2, tags: JSON.stringify(["sony", "used"]), specifications: JSON.stringify([{ key: "Issue", value: "Worn Earpads" }]), imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" },
  { name: "Local Brand DJ Speaker", description: "Extremely loud, good for small parties.", category: "Audio", mrp: 4500, isBargainable: 'true', minBargainPrice: 3200, stock: 4, tags: JSON.stringify(["speaker", "party"]), specifications: JSON.stringify([{ key: "Output", value: "100W" }]), imageUrl: "https://images.unsplash.com/photo-1545454675-a63b2c2eb9a1?w=800&q=80" },
  { name: "Wired Earphones Wholesale (Pack of 10)", description: "Basic wired earphones with mic.", category: "Audio", mrp: 1000, isBargainable: 'true', minBargainPrice: 700, stock: 50, tags: JSON.stringify(["wired", "wholesale"]), specifications: JSON.stringify([{ key: "Connector", value: "3.5mm" }]), imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aecb4d4554?w=800&q=80" },
  { name: "Second-hand Home Theater 5.1", description: "Old model but works great.", category: "Audio", mrp: 6500, isBargainable: 'true', minBargainPrice: 4800, stock: 1, tags: JSON.stringify(["hometheater", "used"]), specifications: JSON.stringify([{ key: "Channels", value: "5.1" }]), imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80" }
];

async function fetchImageBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (err) {
        console.error("Image load fail:", err.message);
        throw err;
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seedViaAPI = async () => {
    console.log("🚀 Starting API Seeding (5 Categories, 10 Items each)...");

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        try {
            console.log(`⏳ [${i + 1}/${products.length}] Uploading [${product.category}]: ${product.name}`);
            
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
            form.append('images', imageBuffer, { filename: `prod_${i}.jpg`, contentType: 'image/jpeg' });

            const response = await axios.post(API_URL, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${TOKEN}`
                }
            });

            console.log(`✅ Success: ${product.isBargainable === 'true' ? 'Bargainable' : 'Fixed'} Item Added`);
            await delay(3000); 

        } catch (error) {
            console.error(`❌ Failed:`, error.response?.data?.message || error.message);
        }
    }
    console.log("🎉 Seeding Complete! Aapke Categories tab aur Fixed/Bargain filters ab perfectly kaam karenge.");
};

seedViaAPI();