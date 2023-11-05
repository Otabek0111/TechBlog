const sequelize = require('../config/connection');
const router = require('express').Router();
const withAuth = require('../utils/auth');
const { Post, User, Comment } = require('../models');

// GET all posts for homepage

router.get('/', (req, res) => {
    try {
        Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include:{
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true}));
            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// GET login page

router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('login');
});

// GET signup page

router.get('/signup', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// GET single post

router.get('/post/:id', (req, res) => {
    try {
        Post.findOne({
            where:{
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include:{
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            if(!dbPostData){
                res.status(404).json({message: 'No post found with this id'});
                return;
            }
            // serialize data before passing to template
            const post = dbPostData.get({ plain: true});
            res.render('single-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// get post and comments for dashboard

router.get('/dashboard', withAuth, (req, res) => {
    try {
        Post.findAll({
            where:{
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include:{
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true}));
            res.render('dashboard', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;
