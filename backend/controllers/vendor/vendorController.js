const Vendor = require('../../models/vendor/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Plan = require('../../models/admin/Plan');
const getCoordinates = require('../../utils/geocode'); 

const generateToken = (id) => {
    return jwt.sign({ id, role: 'vendor' }, process.env.JWT_VENDOR_SECRET || 'secret', { expiresIn: '30d' });
};

exports.registerVendor = async (req, res) => {
    try {
        const { companyName, ownerName, email, password, phoneNumber, category, businessType, city } = req.body;

        const existingVendor = await Vendor.findOne({
            $or: [{ email: email.toLowerCase() }, { companyName: companyName }]
        });

        if (existingVendor) {
            const field = existingVendor.email === email.toLowerCase() ? 'Email' : 'Company Name';
            return res.status(400).json({ message: `${field} is already registered` });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const freePlan = await Plan.findOne({ planId: 'free' });
        const initialLimit = freePlan ? freePlan.productLimit : 5;
        const initialFee = freePlan ? freePlan.platformFee : 0;

       
        let locationData = null;
        if (city) {
            const coords = await getCoordinates(city); 
            if (coords) {
                locationData = {
                    type: "Point",
                    coordinates: coords 
                };
            }
        }

        const vendor = await Vendor.create({
            companyName,
            ownerName,
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber,
            category,
            businessType,
            shopAddress: { 
                city: city,
                location: locationData 
            },
            subscription: {
                planId: 'free',
                planName: 'Free Tier',
                status: 'active',
                startDate: Date.now(),
                productLimit: initialLimit,
                platformFee: initialFee
            }
        });

        res.status(201).json({
            _id: vendor._id,
            companyName: vendor.companyName,
            role: 'vendor',
            token: generateToken(vendor._id)
        });

    } catch (error) {
        console.error("Vendor Register Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ email: email.toLowerCase() });

        if (vendor && (await bcrypt.compare(password, vendor.password))) {
            vendor.lastLogin = Date.now();
            await vendor.save();

            res.json({
                _id: vendor._id,
                companyName: vendor.companyName,
                role: 'vendor',
                token: generateToken(vendor._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Vendor Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};