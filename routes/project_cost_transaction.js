const projectCostTransactionRoute = require('express').Router();
const projectCostTransactionController = require('../controllers/ProjectCostTransactionController');

projectCostTransactionRoute.get(
  '/',
  projectCostTransactionController.getTransaction
);
projectCostTransactionRoute.post(
  '/',
  projectCostTransactionController.createTransactionAndJournals
);
projectCostTransactionRoute.put(
  '/:id',
  projectCostTransactionController.updateTransactionAndJournals
);
projectCostTransactionRoute.delete(
  '/:id',
  projectCostTransactionController.deleteTransaction
);
projectCostTransactionRoute.get(
  '/:id',
  projectCostTransactionController.getTransactionById
);
// projectCostTransactionRoute.post(
//   '/',
//   projectCostTransactionController.createProjectCostTransaction
// );
// projectCostTransactionRoute.put(
//   '/:id',
//   projectCostTransactionController.updateProjectCostTransaction
// );

module.exports = projectCostTransactionRoute;
