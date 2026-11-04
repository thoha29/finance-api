const projectCostRoute = require('express').Router();
const projectCostController = require('../controllers/ProjectCostController');

projectCostRoute.get('/', projectCostController.getProjectCostList);
projectCostRoute.post('/', projectCostController.createProjectCost);
projectCostRoute.put('/:id', projectCostController.updateProjectCost);
projectCostRoute.delete('/:id', projectCostController.deleteProjectCost);
projectCostRoute.get('/:id', projectCostController.getProjectCostById);

module.exports = projectCostRoute;
