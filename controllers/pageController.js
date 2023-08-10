const router = require('express').Router();
const { Page, User } = require('../models');

router.get('/', (req, res) => {
    Page.findAll({
        include: [
            {
                model: User,
                as: 'users',
            }
        ]
    })
    .then(pages => {
        res.json(pages)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error", err
        });
    });
});

router.get("/:id", (req, res) => {
    Page.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'users',
            },
        ],
    })
    .then(pageData => {
        if(!pageData) {
            return res.status(404).json({msg: "no such Page"})
        }

        res.json(pageData);
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg:"womp womp", err})
    });
});

router.get("/userpages/:id", (req, res) => {
    Page.findAll({where: {owner_id: req.params.id}})
    .then(userPages => {
        res.json(userPages)
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg:"womp womp", err})
    });
})

router.post('/', (req, res) => {
    console.log(req.body)
    Page.create(req.body)
    .then(newPage => {
        res.json(newPage)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error creating page", 
            err
        });
    });
});

module.exports = router;