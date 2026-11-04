const menuDropdownRoute = require('express').Router();
const menuDropdownController = require('../controllers/MenuDropdownController');

menuDropdownRoute.get(
  '/account-dropdown',
  menuDropdownController.getAccountCategoryDropdown
);
menuDropdownRoute.get(
  '/business-unit-dropdown',
  menuDropdownController.getBusinessUnitDropdown
);
menuDropdownRoute.get(
  '/project-dropdown',
  menuDropdownController.getProjectsDropdown
);
menuDropdownRoute.get(
  '/external-dropdown',
  menuDropdownController.getExternalDropdown
);
menuDropdownRoute.get(
  '/internal-dropdown',
  menuDropdownController.getInternalDropdown
);
menuDropdownRoute.get(
  '/project-cost-dropdown',
  menuDropdownController.getProjectCostDropdown
);

module.exports = menuDropdownRoute;
