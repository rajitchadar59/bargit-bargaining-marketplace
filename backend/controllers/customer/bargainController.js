const BargainSession = require('../../models/BargainSession');
const Product = require('../../models/vendor/Product');
const client = require("../../config/gemini"); 
const BargainBot = require("../../services/BargainBot"); 

const MAX_ATTEMPTS = 3;
const BARGAIN_TIME_LIMIT_MS = 5 * 60 * 1000; 
const PAYMENT_TIME_LIMIT_MS = 10 * 60 * 1000; 

exports.initBargain = async (req, res) => {
    try {
        const { productId, action } = req.body; 
        const customerId = req.user.id;

        const product = await Product.findById(productId);
        if (!product || !product.isBargainable) {
            return res.status(400).json({ success: false, message: "This product is not available for bargaining." });
        }

        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

        let sessionsToday = await BargainSession.find({
            customerId,
            productId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });

        for (let s of sessionsToday) {
            if (s.status === 'Active' && s.bargainExpiresAt && Date.now() > new Date(s.bargainExpiresAt).getTime()) {
                s.status = 'Expired';
                await s.save();
            } else if (s.status === 'Won' && s.expiresAt && Date.now() > new Date(s.expiresAt).getTime()) {
                s.status = 'Expired';
                await s.save();
            }
        }

        let latestSession = sessionsToday.length > 0 ? sessionsToday[0] : null;

        let usedAttempts = sessionsToday.filter(s => s.bargainExpiresAt !== null).length;

        if (action === 'retry') {
            if (usedAttempts >= MAX_ATTEMPTS) {
                return res.status(400).json({ success: false, message: `You have used all ${MAX_ATTEMPTS} attempts.`, isLimitReached: true });
            }
            if (latestSession && (latestSession.status === 'Active' || latestSession.status === 'Won')) {
                return res.status(400).json({ success: false, message: "You already have an ongoing deal." });
            }

            latestSession = new BargainSession({
                customerId, productId, vendorId: product.vendorId, status: 'Active', bargainExpiresAt: null,
                chatHistory: [{ sender: 'seller', text: `Hi! I see you're interested in the ${product.name} (₹${product.mrp}). You have 5 minutes to convince me once you reply. What's your offer?` }]
            });
            await latestSession.save();
            sessionsToday.unshift(latestSession);
        } 
        else {
            if (!latestSession) {
                latestSession = new BargainSession({
                    customerId, productId, vendorId: product.vendorId, status: 'Active', bargainExpiresAt: null,
                    chatHistory: [{ sender: 'seller', text: `Hi! I see you're interested in the ${product.name} (₹${product.mrp}). You have 5 minutes to convince me once you reply. What's your offer?` }]
                });
                await latestSession.save();
                sessionsToday.unshift(latestSession);
            }
        }

        usedAttempts = sessionsToday.filter(s => s.bargainExpiresAt !== null).length;

        res.status(200).json({
            success: true,
            data: {
                sessionId: latestSession._id,
                status: latestSession.status,
                agreedPrice: latestSession.agreedPrice,
                expiresAt: latestSession.expiresAt,
                bargainExpiresAt: latestSession.bargainExpiresAt, 
                attemptsLeft: MAX_ATTEMPTS - usedAttempts,
                maxAttempts: MAX_ATTEMPTS,
                chatHistory: latestSession.chatHistory, 
                productDetails: { name: product.name, mrp: product.mrp, image: product.images[0] }
            }
        });

    } catch (error) {
        console.error("Init Bargain Error:", error);
        res.status(500).json({ success: false, message: "Server error initializing bargain." });
    }
};

exports.getSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await BargainSession.findById(sessionId);

        if (!session) return res.status(404).json({ success: false, message: "Session not found." });

        if (session.status === 'Active' && session.bargainExpiresAt && Date.now() > new Date(session.bargainExpiresAt).getTime()) {
            session.status = 'Expired';
            await session.save();
        } else if (session.status === 'Won' && session.expiresAt && Date.now() > new Date(session.expiresAt).getTime()) {
            session.status = 'Expired';
            await session.save();
        }

        res.status(200).json({
            success: true,
            data: { status: session.status, agreedPrice: session.agreedPrice, expiresAt: session.expiresAt, bargainExpiresAt: session.bargainExpiresAt }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


exports.handleBargainChat = async (req, res) => {
    try {
        const { sessionId, userMessage } = req.body;
        const customerId = req.user.id;

        if (!userMessage) return res.status(400).json({ success: false, message: "Message cannot be empty." });

        const session = await BargainSession.findOne({ _id: sessionId, customerId });
        if (!session) return res.status(404).json({ success: false, message: "Session not found." });

        if (session.status === 'Active' && !session.bargainExpiresAt) {
            session.bargainExpiresAt = new Date(Date.now() + BARGAIN_TIME_LIMIT_MS);
        } else if (session.status === 'Active' && Date.now() > new Date(session.bargainExpiresAt).getTime()) {
            session.status = 'Expired';
            await session.save();
            return res.status(400).json({ success: false, message: "Bargain time limit is over.", status: 'Expired' });
        }

        if (session.status !== 'Active') return res.status(400).json({ success: false, message: `Deal is ${session.status}.` });

        const product = await Product.findById(session.productId);

        const finalizeDealAndRespond = async (aiData) => {
            session.chatHistory.push({ sender: 'seller', text: aiData.reply });

            if (aiData.isDealClosed && aiData.finalPrice >= product.minBargainPrice) {
                session.status = 'Won';
                session.agreedPrice = aiData.finalPrice;
                session.expiresAt = new Date(Date.now() + PAYMENT_TIME_LIMIT_MS); // 10 Min Payment Limit
            }
            await session.save();

            const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);
            let sessionsToday = await BargainSession.find({ customerId, productId: product._id, createdAt: { $gte: startOfDay, $lte: endOfDay } });
            let usedAttempts = sessionsToday.filter(s => s.bargainExpiresAt !== null).length;

            return res.status(200).json({
                success: true,
                data: { reply: aiData.reply, status: session.status, agreedPrice: session.agreedPrice, expiresAt: session.expiresAt, bargainExpiresAt: session.bargainExpiresAt, attemptsLeft: MAX_ATTEMPTS - usedAttempts }
            });
        };

        let historyText = session.chatHistory.map(msg => `${msg.sender === 'user' ? 'Buyer' : 'Seller'}: ${msg.text}`).join('\n');
        const systemPrompt = `Tum 'Bargit' app ke shopkeeper ho. Product: ${product.name}. MRP: ₹${product.mrp}. Absolute Minimum Price: ₹${product.minBargainPrice}.
Rules: 
1. Kabhi bhi minimum price mat batana.
2. Hinglish me baat karo.
3. Agar offer >= min price ho toh accept kar lo.
4. Agar kam ho toh reject karke counter-offer do.

TUMHARA JAWAB STRICTLY IS JSON FORMAT MEIN HONA CHAHIYE:
{"reply": "Tumhara message", "isDealClosed": true/false, "finalPrice": number_ya_null}

--- CHAT HISTORY ---
${historyText}

Buyer: ${userMessage}
Seller (Return ONLY valid JSON):`;

        try {
            const response = await client.models.generateContent({
                model: "gemini-2.5-flash", 
                contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
            });
            let rawText = response.text;
            if (typeof rawText === 'function') rawText = response.text();
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

            const aiData = JSON.parse(rawText);
            session.chatHistory.push({ sender: 'user', text: userMessage });
            return await finalizeDealAndRespond(aiData);
        } catch (geminiError) {
            session.chatHistory.push({ sender: 'user', text: userMessage });
            const botData = BargainBot.processOffer(userMessage, session.chatHistory, product.mrp, product.minBargainPrice);
            return await finalizeDealAndRespond(botData);
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};