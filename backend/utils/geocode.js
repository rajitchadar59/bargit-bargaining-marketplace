const axios = require('axios');

const getCoordinates = async (addressText) => {
    try {
        const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN; 
        
        if (!mapboxToken) {
            console.error("Mapbox Token missing in .env file!");
            return null;
        }

        const encodedAddress = encodeURIComponent(addressText);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${mapboxToken}&limit=1`;

        const response = await axios.get(url);

        if (response.data.features && response.data.features.length > 0) {
            const coordinates = response.data.features[0].center; 
            return coordinates; 
        } else {
            console.log("No coordinates found for:", addressText);
            return null;
        }
    } catch (error) {
        console.error("Geocoding API Error:", error.response ? error.response.data : error.message);
        return null;
    }
};

module.exports = getCoordinates;