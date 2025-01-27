const express = require('express');

const dataController = require('../../controllers/data.controller');
const router = express.Router();

router.get('/:date', dataController.getDataForDate);

module.exports = router;