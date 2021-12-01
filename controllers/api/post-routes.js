const router = require('express').Router();
const { Post, User, Comment, Vote } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');


//get them all
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // update the `.findAll()` method's attributes to look like this
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            //include the comment model here: 
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
});


//get by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [ 
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create a new one 
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        //grabs session from the session page to get the user_id when new post from add-post.js
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});


//defined before the'/id:' otherwise it thinks is a valid parameter for id 
// PUT /api/posts/upvote
router.put('/upvote', withAuth, (req, res) => {
    // create the vote
    // custom static method created in models/Post.js
      // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        //spread operator taking keys from an old object and adding new key values pairs
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
          .then(updatedVoteData => res.json(updatedVoteData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    });
 
      //old code to test on insomnia
    // Post.upvote(req.body, { Vote })
    //     .then(updatedPostData => res.json(updatedPostData))
    //     .catch(err => {
    //         console.log(err);
    //         res.status(400).json(err);




//modify the title
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;