const tempTransactionRoute = require('express').Router();
const tempTransactionController = require('../controllers/TempTransactionController');
const tempController = require('../controllers/TempController');
const { authentication } = require('../middlewares/auth');

tempTransactionRoute.get('/', tempTransactionController.getTempTransaction);
// tempTransactionRoute.post('/', tempTransactionController.createTempTransaction);
tempTransactionRoute.post(
  '/',
  authentication,
  tempController.createTransactionAndJournals
);
tempTransactionRoute.put('/:id', tempController.updateTransactionJournal);
tempTransactionRoute.delete(
  '/:id',
  tempTransactionController.deleteTempTransaction
);
tempTransactionRoute.get('/:id', tempController.getTempTransactionById);
tempTransactionRoute.post('/approve', tempController.moveTempToTransaction);

module.exports = tempTransactionRoute;
