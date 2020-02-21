var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow} = require('../models');
const {User} = require('../models');

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

router.post('/search', function(req, res, next) {
  //token_values=nJwt.verify(req.headers.authorization,'nodebird', 'HS256');
  //follower=token_values.body.id;
  //following=req.body.following;
  console.log("open");
  var email='nova'
  User.findOne({where:{nickname:{[Op.like]:'%'+email+'%'}}
  })
  .then(result=>{
    res.json(JSON.stringify(result));
  })
});

module.exports = router;