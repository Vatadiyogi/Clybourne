// const axios = require('axios');
import Axios from "./src/utils/api"
// require('dotenv').config();

async function runInvoiceCron() {
  try {
    // console.log(`${new Date().toISOString()} - Running invoice cron job...`);
    
    const response = await Axios.get(`/api/plan/cron-send-invoice`);
    
    // console.log(`${new Date().toISOString()} - Cron job completed:`, response.data);
    
    return response.data;
  } catch (error) {
    // console.error(`${new Date().toISOString()} - Cron job failed:`, error.message);
    throw error;
  }
}

// If running directly
if (require.main === module) {
  runInvoiceCron().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = { runInvoiceCron };