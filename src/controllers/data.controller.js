const catchAsync = require("../utils/catchAsync");

const { OIData } = require('../models');

const getDataForDate = catchAsync(async (req, res, next) => {
    const { date = new Date() } = req.params;

    console.log(date);  
    const desiredStartTime = new Date(date);
    desiredStartTime.setHours(9, 5, 0, 0); // Set desired time to 9:05 AM
    console.log(desiredStartTime);

    const desiredEndTime = new Date(date);
    desiredEndTime.setHours(15, 40, 0, 0); // Set desired time to 3:40 PM
    console.log(desiredEndTime);

    const daysData = await OIData.find({ createdAt: { $gt: desiredStartTime, $lt: desiredEndTime } , expiryDate: {$gte: desiredStartTime} });
    //console.log(daysData);

    res.send(daysData);
});

module.exports = {
    getDataForDate,
}