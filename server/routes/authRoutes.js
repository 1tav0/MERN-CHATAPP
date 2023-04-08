const {Router} = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
//to add routes and controllers to server
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/verifyuser',authController.verifyuser); //to verify the user with the jwt token

module.exports = router;