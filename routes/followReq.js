var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow } = require('../models');

/* GET users listing. */
router.get('/followReq', function(req, res, next) {
  //token_values=nJwt.verify(req.headers.authorization,'nodebird', 'HS256');
  //follower=token_values.body.id;
  //following=req.body.following;
  var follower=3;
  var following=4;
  Follow.create({
    followerId:follower,
    followingId:following,
  });
  res.send('good');
});

module.exports = router;
