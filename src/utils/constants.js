const constants = {
  niftyFutureDailyTicker: 'https://www.nseindia.com/api/liveEquity-derivatives?index=nse50_fut', // create real time chart for nifty
  spotNifty: 'https://www.nseindia.com/api/marketStatus',
  stockFuture: 'https://www.nseindia.com/api/option-chain-equities?symbol=SBIN',
  dowFutDataUrl:
    'https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=%40DJ.1&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1',
  SGXNifty:
    'https://priceapi.moneycontrol.com/technicalCompanyData/globalMarket/getGlobalIndicesListingData?view=overview&deviceType=W',
  stochasticDataURL: 'https://www.nseindia.com/api/marketStatus',
  niftyOIURL: 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY', //'https://www.nseindia.com/api/option-chain-equities?symbol=HINDUNILVR', //'https://www.nseindia.com/api/option-chain-indices?symbol=SBIN',
};

module.exports = { constants };

// const niftyFutureDailyTicker =
//   'https://www.nseindia.com/api/liveEquity-derivatives?index=nse50_fut'; // create real time chart for nifty
// const spotNifty = 'https://www.nseindia.com/api/marketStatus';
// //const dataURL =
//   'https://www.nseindia.com/api/option-chain-equities?symbol=ZEEL';
// const dowFutDataUrl =
//   'https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=%40DJ.1&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1';
// const SGXNifty =
//   'https://priceapi.moneycontrol.com/technicalCompanyData/globalMarket/getGlobalIndicesListingData?view=overview&deviceType=W';
// const stochasticDataURL = 'https://www.nseindia.com/api/marketStatus';

// const dataURL =
//   'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY'; //'https://www.kotaksecurities.com/TSTerminal/Derivatives/MasterData/GetWidgetsDataPackage';
