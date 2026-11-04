const journalRoute = require('express').Router();
const journalController = require('../controllers/JournalController');

journalRoute.get('/', journalController.getJournal);
// journalRoute.post('/', internalController.create);
// journalRoute.put('/:id', internalController.update);
// journalRoute.delete('/:id', internalController.delete);
// journalRoute.get('/:id', internalController.getInternalById);

module.exports = journalRoute;
