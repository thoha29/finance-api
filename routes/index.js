const routes = require('express').Router();
const internalRoutes = require('./internal');
const externalRoutes = require('./external');
const accountCategoryRoutes = require('./account_category');
const businessUnitRoutes = require('./business_unit');
const projectRoutes = require('./project');
const userRoutes = require('./user');
const tempTransactionRoutes = require('./temp_transaction');
const menuDropdownRoute = require('./menu_dropdown');
const transactionRoutes = require('./transaction');
const projectTransactionRoutes = require('./project_transaction');
const journalRoutes = require('./journal');
const reportRoutes = require('./report');
const projectCostRoutes = require('./project_cost');
const projectCostTransactionRoutes = require('./project_cost_transaction');
////
const newTransactionRoutes = require('./new_transaction');
const inquiryRoutes = require('./inquiry');
const hoAdvance = require('./ho_advance');

// const internalController = require('../controllers/InternalController');

routes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Dashboard App API',
  });
});

routes.use('/internals', internalRoutes);
routes.use('/externals', externalRoutes);
routes.use('/account-categories', accountCategoryRoutes);
routes.use('/business-units', businessUnitRoutes);
routes.use('/projects', projectRoutes);
routes.use('/users', userRoutes);
routes.use('/temp-transactions', tempTransactionRoutes);
routes.use('/menu-dropdown', menuDropdownRoute);
routes.use('/transactions', transactionRoutes);
routes.use('/project-transactions', projectTransactionRoutes);
routes.use('/journals', journalRoutes);
routes.use('/reports', reportRoutes);
routes.use('/new-transactions', newTransactionRoutes);
routes.use('/projects-cost', projectCostRoutes);
routes.use('/projects-cost-transactions', projectCostTransactionRoutes);
// routes.use('/projects-setup');
routes.use('/inquiry', inquiryRoutes);
routes.use('/ho-advances', hoAdvance);

module.exports = routes;
