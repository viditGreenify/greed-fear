const { getDataFromNSE } = require('../utils/fetchRequest');
const { constants } = require('../utils/constants');
const logger = require('../config/logger');

const { OIData } = require('../models');

const dataURL = constants.niftyOIURL;

const COLOR = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fgBlack: '\x1b[30m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m',

  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

function roundToNearest(num) {
  // Round to the nearest 50
  var roundedNum = Math.round(num / 50) * 50;

  // If the rounded number is more than 50 away from the original, round to the nearest 100 instead
  if (Math.abs(roundedNum - num) >= 50) {
    roundedNum = Math.round(num / 100) * 100;
  }
  console.log(roundedNum);
  return roundedNum;
}

const sortDataForRelevantExpiryDate = (data, expiryDate, currentStrikePrice) => {
  try {
    minStrikePrice = currentStrikePrice - 650;
    maxStrikePrice = currentStrikePrice + 650;
    const sortedArray = [];
    data.forEach((object) => {
      //console.log(object.strikePrice);
      if (object.expiryDate === expiryDate && object.strikePrice >= minStrikePrice && object.strikePrice <= maxStrikePrice) {
        /** Call and Put both objects are required */
        if (object.CE && object.PE) {
          sortedArray.push(object);
        }
      }
    });
    return sortedArray;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const calculations = (dataArray, type) => {
  try {
    let totalOI = 0;
    let totalOIChange = 0;
    let sumOfChangeCallOI = 0;
    let sumOfChangePutOI = 0;
    let callTotalTradedVolume = 0;
    let putTotalTradedVolume = 0;
    dataArray.forEach((object) => {
      const { lastPrice, openInterest, changeinOpenInterest, totalTradedVolume } = type === 'call' ? object.CE : object.PE;
      // console.log(`${type == 'call' ? 'call': 'put'}, ${totalTradedVolume}`);
      totalOI += Math.round(openInterest * lastPrice);
      totalOIChange += Math.round(changeinOpenInterest * lastPrice);

      if (type === 'call') {
        sumOfChangeCallOI += changeinOpenInterest;
        callTotalTradedVolume += totalTradedVolume;
      } else {
        sumOfChangePutOI += changeinOpenInterest;
        putTotalTradedVolume += totalTradedVolume;
      }
    });
    return { totalOI, totalOIChange, sumOfChangeCallOI, sumOfChangePutOI, callTotalTradedVolume, putTotalTradedVolume };
  } catch (error) {
    logger.error('calculations', error);
    throw error;
  }
};

const runScript = async () => {
  try {
    console.log('Running script');
    const { expiryDates = false, data, strikePrices, underlyingValue: currentStrikePrice } = await getDataFromNSE(dataURL);
    console.log('data fetched', expiryDates);
    if (!expiryDates) return;
    /** sort data for relevant expiry date, 0th element */

    /** check if its thursday closing */
    let today = new Date().getDay();
    if (today === 4 || today === 3) {
      today = 2;
    } else {
      today = 1;
    }
    today = 2;
    for (let index = 0; index < today; ++index) {
      // eslint-disable-next-line no-await-in-loop
      const completeDataForExpiryDate = sortDataForRelevantExpiryDate(
        data,
        expiryDates[index],
        roundToNearest(currentStrikePrice) // expiry date variable
      );
      console.log(
        `${COLOR.fgYellow} NIFTY Total data found is : ${
          completeDataForExpiryDate.length // total data found for expiry date also get todays date as variable
        } for expiry : ${expiryDates[index]} ${new Date()}${COLOR.reset}`
      );

      /** Call calculations */
      const {
        totalOI: totalOICall,
        totalOIChange: totalOIChangeCall,
        sumOfChangeCallOI,
        callTotalTradedVolume,
      } = calculations(completeDataForExpiryDate, 'call'); // both totalOICall and totalOIChangeCall are variables
      console.log(
        `${COLOR.fgGreen} Total --> OI CALL: ${totalOICall}, ${
          totalOIChangeCall < 0 ? COLOR.fgRed : COLOR.fgGreen
        }OI Change CALL: ${totalOIChangeCall}${COLOR.reset}`
      );

      /** Put calculations */
      const {
        totalOI: totalOIPut,
        totalOIChange: totalOIChangePut,
        sumOfChangePutOI,
        putTotalTradedVolume,
      } = calculations(completeDataForExpiryDate, 'put'); // both totalOIPut and totalOIChangePut are variables
      console.log(`${COLOR.fgGreen} Total --> OI PUT: ${totalOIPut}, OI Change PUT: ${totalOIChangePut}${COLOR.reset}`);

      if (totalOICall > totalOIPut) {
        console.log(`${COLOR.fgBlue} OI-CALL IS GREATER THEN OI-PUT BY: ${totalOICall - totalOIPut}${COLOR.reset}`);
      } else {
        console.log(`${COLOR.fgBlue} OI-PUT IS GREATER THEN OI-CALL BY: ${totalOIPut - totalOICall}${COLOR.reset}`);
      }
      if (totalOIChangeCall > totalOIChangePut) {
        console.log(
          `${COLOR.fgBlue} OI-CHANGE-CALL IS GREATER THEN CHANGE-PUT BY: ${totalOIChangeCall - totalOIChangePut}${
            COLOR.reset
          }`
        );
      } else {
        console.log(
          `${COLOR.fgBlue} OI-CHANGE-PUT IS GREATER THEN CHANGE-CALL BY: ${totalOIChangePut - totalOIChangeCall}${
            COLOR.reset
          }`
        );
      }

      console.log(
        `${COLOR.fgWhite} CALL OI CHANGE SUM: ${sumOfChangeCallOI} (${sumOfChangeCallOI * 105000}) ${COLOR.reset}, ${
          COLOR.fgWhite
        } PUT OI CHANGE SUM: ${sumOfChangePutOI} (${sumOfChangePutOI * 105000})${COLOR.reset}`
      );
      // console.log(`${separateUnits(sumOfChangeCallOI * 105000)} -------------- ${separateUnits(sumOfChangePutOI * 105000)}`);

      console.log(
        `${COLOR.fgYellow} CALL TOTAL TRADED VOLUME: ${callTotalTradedVolume} ${COLOR.reset}, ${COLOR.fgYellow} PUT TOTAL TRADED VOLUME: ${putTotalTradedVolume} ${COLOR.reset}`
      );

      /** Persist data */
      const oiObj = new OIData({
        symbol: 'NIFTY',
        expiryDate: new Date(expiryDates[index]),
        totalOICall,
        totalOIPut,
        totalOIChangeCall,
        totalOIChangePut,
        sumOfChangeCallOI,
        sumOfChangePutOI,
        callTotalTradedVolume,
        putTotalTradedVolume,
      });
      //oiObj.save();
      if (index === 0) global.io.emit('data', oiObj);
    }
    console.log(roundToNearest(currentStrikePrice));
  } catch (error) {
    console.error(error);
  }
};
// setInterval(() => {
//   runScript();
// }, 60 * 1000);

module.exports = { runScript };
