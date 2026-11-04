const projectTransactionRoute = require('express').Router();
const projectTransactionController = require('../controllers/ProjectTransactionController');
const { authentication } = require('../middlewares/auth');

projectTransactionRoute.get(
  '/',
  projectTransactionController.getProjectTransaction
);

projectTransactionRoute.post(
  '/',
  authentication,
  projectTransactionController.createTransactionAndJournals
);
projectTransactionRoute.put(
  '/:id',
  projectTransactionController.updateTransactionJournal
);
projectTransactionRoute.delete(
  '/:id',
  projectTransactionController.deleteProjectTransaction
);
projectTransactionRoute.get(
  '/:id',
  projectTransactionController.getProjectTransactionById
);

module.exports = projectTransactionRoute;
