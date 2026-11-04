const newTransactionRoute = require('express').Router();
const newTransactionController = require('../controllers/NewTransactionController');

newTransactionRoute.get('/', newTransactionController.getNewTransaction);

newTransactionRoute.post('/', newTransactionController.createNewTransaction);
newTransactionRoute.put('/:id', newTransactionController.updateNewTransaction);
newTransactionRoute.delete(
  '/:id',
  newTransactionController.deleteNewTransaction
);
newTransactionRoute.get('/:id', newTransactionController.getNewTransactionById);

module.exports = newTransactionRoute;
