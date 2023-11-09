const {User, Post, Comment} = require('../models');
const router = require('express').Router();

router.get('/', async(req, res) => {
    try{
        if(!req.session.loggedIn){
            res.redirect('/dashboard');
            return;
        }
        const dashDbData = await Post.findAll({
            where: {
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
        });

        const posts = dashDbData.map(post => post.get({plain: true}));

        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn
        })

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }

    })

    router.get('/edit/:id', async(req, res) => {
        try{
            if(!req.session.loggedIn){
                res.redirect('/dashboard');
                return;
            }
            const dashDbData = await Post.findOne({
                where: {
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
            });
    
            const posts = dashDbData.map(post => post.get({plain: true}));
    
            res.render('dashboard', {
                posts,
                loggedIn: req.session.loggedIn
            })
    
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    
        })

        


