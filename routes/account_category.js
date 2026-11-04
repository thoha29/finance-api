const accountCategoryRoute = require('express').Router();
const accountCategoryController = require('../controllers/AccountCategoryController');

accountCategoryRoute.get('/', accountCategoryController.getAccountCategoryList);
accountCategoryRoute.post('/', accountCategoryController.createAccountCategory);
accountCategoryRoute.put(
  '/:id',
  accountCategoryController.updateAccountCategory
);
accountCategoryRoute.delete(
  '/:id',
  accountCategoryController.deleteAccountCategory
);
accountCategoryRoute.get(
  '/:id',
  accountCategoryController.getAccountCategoryById
);

module.exports = accountCategoryRoute;
