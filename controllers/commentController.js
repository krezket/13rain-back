const router = require('express').Router();
const { Page, User, Comments } = require('../models');

router.get('/', (req, res) => {
    Comments.findAll()
    .then(pages => {
        res.json(pages)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error", err
        });
    });
});

module.exports = router;