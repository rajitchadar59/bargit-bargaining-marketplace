const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/customer/auth')
const vendorRoutes = require('./routes/vendor/vendorRoutes');
const authMiddleware = require('./midddleware/authMiddleware');
const adminRoutes = require('./routes/admin/adminRoutes');
const createAdmin = require('./config/createAdmin');
const startCronJobs = require('./utils/cronJobs');
const queryRoutes = require('./routes/help');

const app = express();

app.use(express.json());
app.use(cors()); 


mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
      console.log("MongoDB Connected Successfully");
      startCronJobs();
      createAdmin();
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1); 
    });



app.use('/api/admin', adminRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customer/auth', authRoutes);
app.use('/api/customer/bargain', require('./routes/customer/bargainRoutes'));
app.use('/api/customer/profile', require('./routes/customer/profileRoutes'));
app.use('/api/customer/orders', require('./routes/customer/orderRoutes'));
app.use('/api/customer/payments', require('./routes/customer/customerPaymentRoutes'));
app.use('/api/customer/cart', require('./routes/customer/cartRoutes'));

app.use('/api/customer', require('./routes/customer/customerProductRoutes'));
app.use('/api/help', queryRoutes);


app.get('/api/verify', authMiddleware, (req, res) => {
  try {

    const accountData = req.user.toObject();
    delete accountData.password;
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      user: accountData,
      role: req.role 
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
});

app.get('/', (req, res) => {
    res.send("Bargit Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});