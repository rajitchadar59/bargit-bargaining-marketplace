const Plan = require('../../models/admin/Plan');

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        console.error("Fetch Plans Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching plans' });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const planData = req.body;

        const updatedPlan = await Plan.findOneAndUpdate(
            { planId: planId }, 
            { $set: planData }, 
            { upsert: true, returnDocument: 'after' } 
        );

        res.status(200).json({ 
            success: true, 
            message: 'Plan updated successfully in Database', 
            data: updatedPlan 
        });
    } catch (error) {
        console.error("Update Plan Error:", error);
        res.status(500).json({ success: false, message: 'Server error updating plan' });
    }
};