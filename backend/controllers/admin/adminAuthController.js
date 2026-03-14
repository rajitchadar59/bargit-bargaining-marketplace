const Admin = require('../../models/admin/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const generateToken = (id, role) => {
    return jwt.sign({ id, role: 'admin', adminRole: role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const admin = await Admin.findOne({ email });

        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        admin.lastLogin = Date.now();
        await admin.save();

        res.status(200).json({
            success: true,
            token: generateToken(admin._id, admin.role),
            data: { 
                name: admin.name, 
                role: admin.role 
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};