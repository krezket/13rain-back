const router = require('express').Router();
const { Page, User, Comments } = require('../models');

router.get('/', (req, res) => {
    Comments.findAll({
        include: [
            {
                model: User,
                as: 'users',
            },
        ],
    })
    .then(comments => {
        res.json(comments)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error", err
        });
    });
});

router.post('/', (req, res) => {
    console.log(req.body)
    Comments.create(req.body)
    .then(newComment => {
        res.json(newComment)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error creating page", 
            err
        });
    });
});

router.delete('/:id', (req, res) => {
    Comments.destroy({
        where: {id: req.params.id}
    })
    .then(
        res.status(200).json({
            msg: "Deleted"
        })
    ).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error deleting user",
            err
        });
    });
});

module.exports = router;