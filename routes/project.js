const projectRoute = require('express').Router();
const projectController = require('../controllers/ProjectController');

projectRoute.get('/', projectController.getProjectList);
projectRoute.post('/', projectController.createProject);
projectRoute.put('/:id', projectController.updateProject);
projectRoute.delete('/:id', projectController.deleteProject);
projectRoute.get('/:id', projectController.getProjectById);

module.exports = projectRoute;
