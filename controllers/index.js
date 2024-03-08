const router = require('express').Router();

const userController = require('./userController')
const pageController = require('./pageController')
const commentController = require('./commentController')

router.use('/users', userController);
router.use('/pages', pageController);
router.use('/comments', commentController);

module.exports = router;