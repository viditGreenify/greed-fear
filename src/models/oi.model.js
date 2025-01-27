const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const oiSchema = mongoose.Schema(
  {
    symbol: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    totalOICall: { type: Number },
    totalOIPut: { type: Number },
    totalOIChangeCall: { type: Number },
    totalOIChangePut: { type: Number },
    sumOfChangeCallOI: { type: Number },
    sumOfChangePutOI: { type: Number },
    callTotalTradedVolume: { type: Number },
    putTotalTradedVolume: { type: Number },
  },
  {
    timestamps: true,
  }
);
oiSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });
// add plugin that converts mongoose to json
//oiSchema.plugin(toJSON);

/**
 * @typedef OIData
 */
const OIData = mongoose.model('OIData', oiSchema);

module.exports = OIData;
