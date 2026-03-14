const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor/Vendor");
const User = require("../models/User");
const Admin = require("../models/admin/Admin"); 

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedPayload = jwt.decode(token);
    if (!decodedPayload) return res.status(401).json({ message: "Invalid Token Format" });


    let secret;
    if (decodedPayload.role === 'vendor') {
        secret = process.env.JWT_VENDOR_SECRET;
    } else if (decodedPayload.role === 'admin') {
        secret = process.env.JWT_SECRET; 
    } else {
        secret = process.env.JWT_CUSTOMER_SECRET;
    }

    const decoded = jwt.verify(token, secret);

    
    let account;
    if (decoded.role === 'vendor') {
        account = await Vendor.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
        account = await Admin.findById(decoded.id).select('-password');
    } else {
        account = await User.findById(decoded.id).select('-password');
    }

    if (!account) return res.status(401).json({ message: "Account not found" });

    req.user = account; 
    req.userId = account._id.toString();
    req.role = decoded.role; 
    
    
    if (decoded.role === 'admin') {
        req.adminRole = account.role; 
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = authMiddleware;