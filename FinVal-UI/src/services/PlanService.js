import axios from 'axios';
import { apiURL } from '../config/Config';

export const fetchPlanData = async (token) => {
    // If data is not present, fetch from the API
    try {
      const response = await axios.get(apiURL + '/front/customer/plan', {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });
      const planData = response.data.data;
      return planData;
    } catch (error) {
      console.error('Error fetching plan data:', error);
      throw error; // Propagate the error if needed
  }
};
