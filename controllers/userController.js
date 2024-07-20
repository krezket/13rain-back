const router = require('express').Router();
const { User, Page, Comments, Follow } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
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
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({
            msg: "error",
            err
        });
    }
});

// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
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
                    attributes: { exclude: ['password', 'bio'] },
                    include: [
                        {
                            model: Page,
                            as: 'pages',
                        }
                    ]
                }
            ],
        });

        if (!userData) {
            return res.status(404).json({ msg: "no such user" });
        }

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "womp womp", err });
    }
});

// GET PROFILE BY USERNAME
router.get("/profile/:username", async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.params.username },
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
                    attributes: { exclude: ['password', 'bio'] },
                    include: [
                        {
                            model: Page,
                            as: 'pages',
                        }
                    ]
                }
            ],
        });

        if (!userData) {
            return res.status(404).json({ msg: "bruh" });
        }

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "womp womp", err });
    }
});

// Create a user
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const newUser = await User.create(req.body);
        const token = jwt.sign(
            {
                username: newUser.username,
                userId: newUser.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );
        res.json({
            token,
            user: newUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "error creating user",
            err
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const userData = await User.findOne({ where: { username: req.body.username } });
        if (!userData) {
            console.log("USERNAME NOT FOUND");
            return res.status(403).json({ msg: "invalid login" });
        } else if (!bcrypt.compareSync(req.body.password, userData.password)) {
            return res.status(401).json({ msg: "invalid login" });
        } else {
            const token = jwt.sign(
                {
                    username: userData.username,
                    userId: userData.id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );
            res.json({
                token,
                user: userData
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "error logging in",
            err
        });
    }
});

// Verify Token
router.get("/auth/verifytoken", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const foundUser = await User.findByPk(data.userId, {
            include: [
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
        });
        res.json(foundUser);
    } catch (err) {
        console.log(err);
        res.status(403).json({ msg: "bad token", err });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }

        await User.update(userData, { where: { id: userId } });

        res.json({ msg: "User updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "error", err });
    }
});

// Add a friend
router.put('/addfriend/:id', async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.follow_id;

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

// Remove a friend
router.put('/removefriend/:id', async (req, res) => {
    const userId = req.params.id;
    const friendId = req.body.follow_id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const friend = await User.findByPk(friendId);
        if (!friend) {
            return res.status(404).json({ msg: "Friend not found" });
        }

        // Remove friend from user's following list
        await user.removeFollowing(friend);

        // Remove user from friend's followers list
        await friend.removeFollower(user);

        res.json({ msg: "Friend removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Delete a user
router.delete('/id', async (req, res) => {
    try {
        await User.destroy({
            where: {id: req.params.id}
        });
        res.status(200).json({
            msg: "Deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "error deleting user",
            err
        });
    }
});

module.exports = router;