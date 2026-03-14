const cron = require('node-cron');
const Vendor = require('../models/vendor/Vendor'); 

const startCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('⏳ [CRON] Checking for expired vendor subscriptions...');
        
        try {
            const now = new Date();

            const result = await Vendor.updateMany(
                {
                    'subscription.planId': { $ne: 'free' }, 
                    'subscription.endDate': { $lt: now },  
                    'subscription.status': 'active'        
                },
                {
                    $set: { 'subscription.status': 'expired' } 
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ [CRON SUCCESS]: ${result.modifiedCount} vendors ka plan 'expired' mark kar diya gaya.`);
            } else {
                console.log('✅ [CRON SUCCESS]: Koi naya expired plan nahi mila.');
            }

        } catch (error) {
            console.error('❌ [CRON ERROR]: Subscription update fail ho gaya.', error);
        }
    });
};

module.exports = startCronJobs;