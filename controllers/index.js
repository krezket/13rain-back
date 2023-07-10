const router = require('express').Router();

const userController = require('./userController')
const pageController = require('./pageController')

router.use('/users', userController);
router.use('/pages', pageController);

module.exports = router;