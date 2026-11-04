const transactionRoute = require('express').Router();
const transactionController = require('../controllers/DailyTransactionController');
// const tempController = require('../controllers/TempController');
const { authentication } = require('../middlewares/auth');

transactionRoute.get('/', transactionController.getTransaction);

transactionRoute.post(
  '/',
  authentication,
  transactionController.createTransactionAndJournals
);
transactionRoute.put('/:id', transactionController.updateTransactionJournal);
transactionRoute.delete('/:id', transactionController.deleteDailyTransaction);
transactionRoute.get('/:id', transactionController.getDailyTransactionById);
// transactionRoute.get('/approve/:id', tempController.moveTempToTransaction);

module.exports = transactionRoute;
