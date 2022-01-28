const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/pregister',authController.pregister);
router.post('/balance',authController.balance);
router.post('/deposit',authController.deposit);
router.post('/withdraw',authController.withdraw);

module.exports = router;
