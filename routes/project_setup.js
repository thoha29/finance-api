const projectSetupRoute = require('express').Router();
const projectCostTransactionController = require('../controllers/ProjectCostTransactionController');

projectSetupRoute.get('/', projectCostTransactionController.getTransaction);
projectSetupRoute.post(
  '/',
  projectCostTransactionController.createProjectCostTransaction
);
projectSetupRoute.put(
  '/:id',
  projectCostTransactionController.updateProjectCostTransaction
);
projectSetupRoute.delete(
  '/:id',
  projectCostTransactionController.deleteTransaction
);
projectSetupRoute.get(
  '/:id',
  projectCostTransactionController.getTransactionById
);

module.exports = projectSetupRoute;
