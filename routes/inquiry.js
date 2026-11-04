const inquiryRoute = require('express').Router();
const inquiryController = require('../controllers/InquiryController');

inquiryRoute.get('/', inquiryController.getInquiry);

module.exports = inquiryRoute;
