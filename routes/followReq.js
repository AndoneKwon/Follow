var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow,User } = require('../models');
const Sequelize = require
const {like} = Sequelize.Op

/* GET users listing. */
router.get('/followReq', function(req, res, next) {
  //token_values=nJwt.verify(req.headers.authorization,'nodebird', 'HS256');
  //follower=token_values.body.id;
  //following=req.body.following;
  Follow.create({
    followerId:follower,
    followingId:following,
  });
  res.send('good');
});

router.post('/followSearch', function(req, res, next) {
  //token_values=nJwt.verify(req.headers.authorization,'nodebird', 'HS256');
  //follower=token_values.body.id;
  //following=req.body.following;
  Follow.findAll({
    where:{
      nickname:{
        like:"%"+res.body.nickname+"%"
      }
    }
  })
  .then(result=>{
    res.json(result)
  })
  .catch(err=>{
    console.log(err);
    res.send(err);
  })
});

module.exports = router;

router.get