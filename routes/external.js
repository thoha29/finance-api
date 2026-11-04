const externalRoute = require('express').Router();
const externalController = require('../controllers/ExternalController');

externalRoute.get('/', externalController.getExternalList);
externalRoute.post('/', externalController.create);
externalRoute.put('/:id', externalController.update);
externalRoute.delete('/:id', externalController.delete);
externalRoute.get('/:id', externalController.getExternalById);

module.exports = externalRoute;
