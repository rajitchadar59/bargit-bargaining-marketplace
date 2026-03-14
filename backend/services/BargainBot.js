

class BargainBot {
    
  
    
    static DICTIONARY = {
        greetingsWithoutOffer: [
            "Hello Sir! Boliye kis price pe done karein?",
            "Hi Bhai! Product toh aapne dekh liya, apna offer batao?",
            "Namaste! Boliye sir, kya budget socha hai aapne iske liye?",
            "Swagat hai sir! Direct apna price bataiye, dekhte hain kya ho sakta hai."
        ],
        noNumberFound: [
            "Sir baat toh theek hai, par numbers mein apna offer likhiye na.",
            "Bhaiya, price batao figures mein, tabhi toh deal aage badhegi.",
            "Main samajh raha hoon, par ek amount toh quote karo aap?",
            "Sir, final price numbers mein type kijiye please (e.g., 15000)."
        ],
        absurdlyLow: [ // 🌟 FIXED KEY NAME HERE
            "Bhaiya itne mein toh iska khoka (box) bhi nahi aata! Sahi rate lagao.",
            "Sir mazak kar rahe ho kya? Itna sasta toh factory wale bhi nahi dete.",
            "Arey sir, nuksan thodi karwana hai. Thoda practical offer dijiye.",
            "Bhai, itne kam mein toh impossible hai. Aap rate thoda theek lagao please.",
            "Sir free mein thodi baant rahe hain! Thoda market rate toh dekho."
        ],
        veryLow: [ 
            "Sir bahut kam bol rahe ho aap. Meri kharid bhi isse upar hai.",
            "Nahi bhai, is rate pe toh bilkul baat nahi banegi. Thoda badhao.",
            "Aapka rate sun ke toh chakkar aa gaya sir! Kuch margin toh chodo mere liye.",
            "Bhai itna discount nahi mil payega. Thoda aage badho aap price mein."
        ],
        justBelowMinPrice: [ 
            "Bhai bahut kareeb ho aap, par is rate pe allow nahi kar sakta main.",
            "Sir bas thoda sa aur badha lo, main abhi deal lock kar dunga.",
            "Nahi yaar, thoda sa piche reh gaye aap. Thoda sa upar karo, done karte hain.",
            "Arey sir, 100-200 ke peeche mat roko deal. Thoda badhao aur le jao."
        ],
        overMrp: [ 
            "Arey sir! Iska MRP hi kam hai, aap zyada kyun de rahe ho? MRP pe hi done karte hain.",
            "Bhai lagta hai aapne MRP nahi dekhi! Main aapko MRP pe hi de dunga, don't worry."
        ],
        exactMrp: [
            "Arey waah sir, bina bargain kiye man gaye! Chalo deal done at MRP.",
            "Thank you sir! Deal done at the exact price. Proceed to payment."
        ],
        acceptDeal: [
            "Chalo theek hai bhai, tumhare liye ye rate final. Deal done! 🤝",
            "Nuksan karwa rahe ho aaj mera, par theek hai pehle customer ho... Done!",
            "Chalo sir, na aapka na mera. Deal pakki at your price! 🎉",
            "Maan gaye sir aapki bargaining skills ko. Done! Please pay now.",
            "Theek hai bhai, pack karwa raha hoon. Proceed to checkout! 🛍️"
        ],
        repeatedLowOffer: [ 
            "Sir main bata chuka hoon, us rate pe nahi ho payega. Time waste mat kijiye.",
            "Bhai ek hi rate mat ratto, main apna last price de chuka hoon. Lena hai toh batao.",
            "Sir mere hath mein aur kam karna nahi hai. Aakhiri offer main de chuka hoon."
        ],
        finalPatienceLost: [ 
            "Sir ye mera absolute final hai. Isse niche main ek rupya kam nahi karunga. Take it or leave it.",
            "Dekho bhai, isse sasta poori market mein nahi milega. Final price de diya maine.",
            "Sir company policy allow nahi karti isse niche. Deal karni hai toh is rate pe kijiye."
        ]
    };

    // ==========================================
    // 2. ADVANCED TEXT PARSING (NLP LIGHT)
    // ==========================================
    
    static extractOffer(text) {
        if (!text) return null;
        let cleanText = text.toLowerCase().replace(/,/g, '');
        
        let kMatch = cleanText.match(/(\d+(\.\d+)?)\s*(k|thousand)/);
        if (kMatch) return Math.floor(parseFloat(kMatch[1]) * 1000);

        let lakhMatch = cleanText.match(/(\d+(\.\d+)?)\s*(lakh|lac|l)/);
        if (lakhMatch) return Math.floor(parseFloat(lakhMatch[1]) * 100000);

        let match = cleanText.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    }

    static isJustGreeting(text) {
        const greetings = ['hi', 'hello', 'hey', 'namaste', 'bhai', 'sir'];
        const words = text.toLowerCase().split(/\s+/);
        const hasGreeting = words.some(w => greetings.includes(w));
        const hasNumber = /\d/.test(text);
        return hasGreeting && !hasNumber;
    }

    // ==========================================
    // 3. HISTORY & BEHAVIOR ANALYSIS
    // ==========================================
    
    static getRound(history) {
        if (!history || !Array.isArray(history)) return 1;
        return history.filter(msg => msg.sender === 'user').length + 1;
    }

    static checkRepeatedOffer(history, currentOffer) {
        if (!history || history.length < 3) return false;
        let repeatCount = 0;
        for (let msg of history) {
            if (msg.sender === 'user') {
                const pastOffer = this.extractOffer(msg.text);
                if (pastOffer === currentOffer) {
                    repeatCount++;
                }
            }
        }
        return repeatCount >= 2; 
    }

    static roundToNearest50(num) {
        return Math.round(num / 50) * 50;
    }

    static getRandomReply(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // ==========================================
    // 4. THE CORE NEGOTIATION ENGINE
    // ==========================================
    
    static processOffer(userMessage, history, mrp, minPrice) {
        const userOffer = this.extractOffer(userMessage);
        const round = this.getRound(history);
        const margin = mrp - minPrice;

        // CASE 1: No Number Found
        if (!userOffer) {
            if (this.isJustGreeting(userMessage)) {
                return {
                    reply: this.getRandomReply(this.DICTIONARY.greetingsWithoutOffer),
                    isDealClosed: false,
                    finalPrice: null
                };
            }
            return {
                reply: this.getRandomReply(this.DICTIONARY.noNumberFound),
                isDealClosed: false,
                finalPrice: null
            };
        }

        // CASE 2: User Offers >= MRP
        if (userOffer > mrp) {
            return {
                reply: this.getRandomReply(this.DICTIONARY.overMrp),
                isDealClosed: true,
                finalPrice: mrp
            };
        }
        if (userOffer === mrp) {
            return {
                reply: this.getRandomReply(this.DICTIONARY.exactMrp),
                isDealClosed: true,
                finalPrice: mrp
            };
        }

        // CASE 3: Stubbornness Check
        if (userOffer < minPrice && this.checkRepeatedOffer(history, userOffer)) {
            return {
                reply: this.getRandomReply(this.DICTIONARY.repeatedLowOffer) + ` Mera last price ₹${minPrice} hai.`,
                isDealClosed: false,
                finalPrice: null
            };
        }

        // CASE 4: User Offers >= MinPrice (POTENTIAL DEAL!)
        if (userOffer >= minPrice) {
            if (round === 1 && userOffer < minPrice + (margin * 0.2)) {
                const greedyCounter = this.roundToNearest50(minPrice + (margin * 0.3));
                return {
                    reply: `Bhai ₹${userOffer} toh bohot tight ho jayega. Pehli deal hai, ₹${greedyCounter} mein kar dete hain. Deal?`,
                    isDealClosed: false,
                    finalPrice: null
                };
            }
            return {
                reply: this.getRandomReply(this.DICTIONARY.acceptDeal).replace("your price", `₹${userOffer}`),
                isDealClosed: true,
                finalPrice: userOffer
            };
        }

        // CASE 5: User Offers < MinPrice (HAGGLING MODE)
        if (userOffer < minPrice) {
            const offerRatio = userOffer / minPrice;

            // Subcase 5A: Absurdly Low Offer (< 50% of Min Price)
            if (offerRatio < 0.5) {
                const counter = this.roundToNearest50(mrp - (margin * 0.2)); 
                return {
                    // 🌟 FIXED THE TYPO HERE: absurdlyLow 🌟
                    reply: `${this.getRandomReply(this.DICTIONARY.absurdlyLow)} Sahi rate lagao sir, ₹${counter} tak kar dunga.`,
                    isDealClosed: false,
                    finalPrice: null
                };
            }

            // Subcase 5B: Very Low Offer (50% - 85% of Min Price)
            if (offerRatio >= 0.5 && offerRatio < 0.85) {
                let counter;
                if (round === 1) {
                    counter = this.roundToNearest50(mrp - (margin * 0.4)); 
                } else if (round === 2) {
                    counter = this.roundToNearest50(mrp - (margin * 0.6)); 
                } else {
                    counter = this.roundToNearest50(minPrice + (margin * 0.1)); 
                }

                return {
                    reply: `${this.getRandomReply(this.DICTIONARY.veryLow)} Chalo aapke liye ₹${counter} final laga deta hoon.`,
                    isDealClosed: false,
                    finalPrice: null
                };
            }

            // Subcase 5C: Just below Min Price (85% - 99% of Min Price)
            if (offerRatio >= 0.85 && offerRatio < 1.0) {
                if (round >= 3) {
                    return {
                        reply: `Sir aapse aur kya behas karni. Chalo ₹${minPrice} mein deal lock karte hain! Ye absolute lowest hai.`,
                        isDealClosed: false, 
                        finalPrice: null
                    };
                } else {
                    const counter = this.roundToNearest50(minPrice + (margin * 0.05)); 
                    return {
                        reply: `${this.getRandomReply(this.DICTIONARY.justBelowMinPrice)} ₹${counter} kar do aur order place karo.`,
                        isDealClosed: false,
                        finalPrice: null
                    };
                }
            }
        }

        // CASE 6: PATIENCE EXHAUSTED
        if (round >= 5) {
            return {
                reply: `${this.getRandomReply(this.DICTIONARY.finalPatienceLost)} Price is ₹${minPrice}. Let me know.`,
                isDealClosed: false,
                finalPrice: null
            };
        }

        // Fallback catch-all
        return {
            reply: `Sir, mera best price ₹${this.roundToNearest50(minPrice + (margin * 0.1))} banega. Batayein kya karna hai?`,
            isDealClosed: false,
            finalPrice: null
        };
    }
}

module.exports = BargainBot;