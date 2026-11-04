const reportRoute = require('express').Router();
const reportController = require('../controllers/ReportController');
// const { authentication } = require('../middlewares/auth');

reportRoute.get('/', reportController.getReportCOA);

module.exports = reportRoute;
