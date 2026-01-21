// utils/countryUtils.js
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
// Simple mapping - just use what Highcharts provides
export const getCountryCode = (countryName) => {
    if (!countryName) return null;
    
    // Convert to lowercase for comparison
    const searchName = countryName.toLowerCase().trim();
    
    // Find the country in Highcharts data
    const country = worldMap.features.find(feature => 
        feature.properties.name.toLowerCase() === searchName
    );
    
    return country ? country.properties["hc-key"] : null;
};

// Create comprehensive country code to name mapping
export const countryCodeToName = (() => {
    const mapping = {};
    worldMap.features.forEach(feature => {
        const code = feature.properties["hc-key"];
        const name = feature.properties.name;
        if (code && name) {
            mapping[code.toLowerCase()] = name;
            mapping[code.toUpperCase()] = name;
        }
    });
    return mapping;
})();

// Function to get country name from code
export const getCountryName = (countryCode) => {
    if (!countryCode) return "";
    return countryCodeToName[countryCode.toLowerCase()] || countryCode;
};

// Function to get all countries for dropdown
export const getAllCountries = () => {
    return worldMap.features
        .map(feature => ({
            code: feature.properties["hc-key"],
            name: feature.properties.name
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};

