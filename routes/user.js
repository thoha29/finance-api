const userRoute = require('express').Router();
const userController = require('../controllers/UserController');

userRoute.get('/', userController.getUsersList);
userRoute.post('/', userController.createUser);
userRoute.post('/login', userController.loginUser);
userRoute.put('/:id', userController.updateUser);
userRoute.delete('/:id', userController.deleteUser);
userRoute.get('/:id', userController.getUserById);

module.exports = userRoute;
