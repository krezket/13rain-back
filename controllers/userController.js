const router = require('express').Router();
const { User, Page, Comments, Follow } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get all users
router.get('/', (req, res) => {
    User.findAll({
        include: [
            {
                model: Page,
                as: 'pages',
            },
            {
                model: Comments,
                as: 'comments',
            },
            {
                model: User,
                as: 'followers',
                attributes: { exclude: ['password', 'bio'] }
            },
            {
                model: User,
                as: 'following',
                attributes: { exclude: ['password', 'bio'] }
            }
        ]
    })
    .then(users => {
        res.json(users)
    }).catch(err => {
        res.status(500).json({
            msg:"error", err
        });
    });
});

// Get user by ID
router.get("/:id", (req, res) => {
    User.findByPk(req.params.id, {
        include: [
            {
                model: Page,
                as: 'pages',
            },
            {
                model: User,
                as: 'followers',
                attributes: { exclude: ['password', 'bio'] }
            },
            {
                model: User,
                as: 'following',
                attributes: { exclude: ['password', 'bio'] }
            }
        ],
    })
    .then(userData => {
        if(!userData) {
            return res.status(404).json({msg: "no such user"})
        }

        res.json(userData);
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg:"womp womp", err})
    });
});

// GET PROFILE BY USERNAME
router.get("/profile/:username", (req, res) => {
    User.findOne({where: {username: req.params.username},
        include: [
            {
                model: Page,
                as: 'pages',
            },
            {
                model: User,
                as: 'followers',
                attributes: {exclude: ['password', 'bio']}
            },
            {
                model: User,
                as: 'following',
                attributes: {exclude: ['password', 'bio']}
            }
        ],
    })
    .then(userData => {
        if(!userData) {
            return res.status(404).json({msg: "bruh"})
        }

        res.json(userData);
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg:"womp womp", err})
    });
});

// Create a user
router.post('/', (req, res) => {
    console.log(req.body)
    User.create(req.body)
    .then(newUser => {
        const token = jwt.sign({
            username: newUser.username,
            userId: newUser.id
        },process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
        res.json({
            token,
            user: newUser
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error creating user", 
            err
        });
    });
});

// Login
router.post('/login', (req, res) => {
    console.log(req.body)
    User.findOne({where: {username: req.body.username}})
    .then(userData => {
        if(!userData) {
            console.log("USERNAME NOT FOUND")
            res.status(403).json({ msg: "invalid login" });
        } else if (!bcrypt.compareSync(req.body.password, userData.password)) {
            return res.status(401).json({msg:"invalid login"})
        } else {
            const token = jwt.sign({
                username:userData.username,
                userId:userData.id
            },process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            res.json({
                token,
                user:userData
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error logging in", 
            err
        });
    });
});

// Verify Token
router.get("/auth/verifytoken",(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET)
        User.findByPk(data.userId)
        .then(foundUser=>{
            res.json(foundUser)
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({msg:"bad token",err})
    }
});

// Update a user
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    const user = User.findByPk(userId)
    if(!user) {
        return res.status(404).json({msg: "user not found"});
    };
    User.update(userData, {where:{id:userId}})
    .then(users => {
        res.json(users)
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            msg:"error", err
        });
    });
});

// Add a friend
router.put('/addfriend/:id', async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.follow_id; // Assuming your request body contains the ID of the friend to add

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const friend = await User.findByPk(friendId);
        if (!friend) {
            return res.status(404).json({ msg: "Friend not found" });
        }

        // Add friend to user's following list
        await user.addFollowing(friend);

        // Add user to friend's followers list
        await friend.addFollower(user);

        res.json({ msg: "Friend added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// router.put('/addfriend/:id', (req, res) => {
//     const userId = req.params.id;
//     console.log(userId)   
//     const friendData = req.body;
//     console.log(friendData)

//     const user = User.findByPk(userId)
//     if(!user) {
//         return res.status(404).json({msg: "user not found"});
//     };
//     console.log(user)   
//     User.update(friendData, {where:{id:userId}})
//     .then(friend => {
//         res.json(friend)
//     }).catch(err => {
//         console.log(err)
//         res.status(500).json({
//             msg:"error", err
//         });
//     });
// });

// Delete a user
router.delete('/id', (req, res) => {
    User.destroy({
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