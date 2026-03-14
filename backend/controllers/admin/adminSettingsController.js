const Settings = require('../../models/admin/Settings');

exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = await Settings.create({});
        }
        
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Fetch Settings Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { platformName, supportEmail, supportPhone, minPayoutThreshold, maintenanceMode } = req.body;

        let settings = await Settings.findOne();

        if (settings) {
            settings.platformName = platformName;
            settings.supportEmail = supportEmail;
            settings.supportPhone = supportPhone;
            settings.minPayoutThreshold = minPayoutThreshold;
            settings.maintenanceMode = maintenanceMode;
            await settings.save();
        } else {
            settings = await Settings.create({
                platformName, 
                supportEmail, 
                supportPhone, 
                minPayoutThreshold, 
                maintenanceMode
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Platform settings updated successfully', 
            data: settings 
        });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};