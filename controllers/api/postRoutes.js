const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where:{
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            // include the Comment model here:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include:{
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

// POST /api/users

router.post('/', (req, res) => {
    // expects {username: 'Lernantino', password: 'password1234'}
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUserData =>{
        req.session.save(() =>{
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

// PUT /api/users/1

router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'Lernantino', password: 'password1234'}
    // if req.body has exact key/value pairs to match the model, you can just use 'req.body' instead
    User.update(req.body, {
        individualHooks: true,
        where:{
            id: req.params.id
        }
    })
    .then(dbUserData =>{
        if(!dbUserData[0]){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

// DELETE /api/users/1

router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

module.exports = router;
