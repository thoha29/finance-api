const hoAdvance = require('express').Router();
const HoAdvanceController = require('../controllers/HoAdvanceController');

hoAdvance.put('/:pct_id', HoAdvanceController.updateHoAdvance);
hoAdvance.get('/:pct_id', HoAdvanceController.getHoAdvanceByPctId);

module.exports = hoAdvance;
