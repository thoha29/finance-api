const businessUnitRoute = require('express').Router();
const businessUnitController = require('../controllers/BusnessUnitController');

businessUnitRoute.get('/', businessUnitController.getBusinessUnitList);
businessUnitRoute.post('/', businessUnitController.createBusinessUnit);
businessUnitRoute.put('/:id', businessUnitController.updateBusinessUnit);
businessUnitRoute.delete('/:id', businessUnitController.deleteBusinessUnit);
businessUnitRoute.get('/:id', businessUnitController.getBusinessUnitById);

module.exports = businessUnitRoute;
