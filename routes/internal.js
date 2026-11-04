const internalRoute = require('express').Router();
const internalController = require('../controllers/InternalController');

internalRoute.get('/', internalController.getInternalList);
internalRoute.post('/', internalController.create);
internalRoute.put('/:id', internalController.update);
internalRoute.delete('/:id', internalController.delete);
internalRoute.get('/:id', internalController.getInternalById);

module.exports = internalRoute;
