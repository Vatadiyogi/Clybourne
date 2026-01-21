const axios = require('axios');
const fs = require('fs');

const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countryData = response.data;
    
    const countryNames = countryData.map(country => country.name.common);
    
    // Creating an object with country names array
    const countriesObject = {
      countries: countryNames
    };

    // Convert the object to JSON string
    const jsonData = JSON.stringify(countriesObject, null, 2);

    // Write JSON data to a file named 'countries.json'
    fs.writeFileSync('countries.json', jsonData);

    console.log('Countries data has been saved to countries.json file.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchCountries();
