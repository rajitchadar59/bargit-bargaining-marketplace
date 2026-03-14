const User = require('../../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({ id, role: 'customer' }, process.env.JWT_CUSTOMER_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let userExists = await User.findOne({ email: email.toLowerCase() });
        
        if (userExists) return res.status(400).json({ msg: "User or Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, email: email.toLowerCase(), password: hashedPassword });
        await user.save();

        res.status(201).json({ 
            token: generateToken(user._id), 
            role: 'customer', 
            user: { username: user.username , _id: user._id} 
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });
        


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        res.json({ 
            token: generateToken(user._id), 
            role: 'customer',
            user: { username: user.username , _id: user._id} 
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};