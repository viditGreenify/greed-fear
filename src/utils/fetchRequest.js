const axios = require('axios');
const logger = require('../config/logger');

const getDataFromNSE = async (dataURL) => {
  try {
    const response = await axios.get(dataURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'application/json', // Assuming JSON response
        'Referer': 'https://www.nseindia.com/option-chain',
        'authority':'www.nseindia.com',
      }
    });
    return response.data.records; // Assuming 'records' is always present
  } catch (error) {
    logger.error('Error fetching data from NSE:', error);
    throw error; // Re-throw the error for further handling
  }

//   axios.get(dataURL, {
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
//     'Accept': 'application/json' // Assuming JSON response
//   }
// })
// .then(response => {
//   console.log(response.data);
//   return response.data.records
// })
// .catch(error => {
//     logger.error('Error fetching data from NSE:', error);
//     throw error; // Re-throw the error for further handling
// });
};

module.exports = { getDataFromNSE };
