var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow,User } = require('../models');
const Sequelize = require('sequelize');
const {like} = Sequelize.Op


// follower: 팔로잉을 하는 사람
// followering 팔로잉을 당하는사람


/* following */
router.post('/followReq',async function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var follower=token_values.body.id;
  var followingNickName=req.body.nickname;
  var following;

  await User.findAll({
    where:{
      nickname:followingNickName      
    },
    attributes:['id']
  })
  .then(result=>{
    following=result[0].id;
  });//nickname에 맞는 ID를 찾아옴

  Follow.create({
    followerId:follower,
    followingId:following,
  })
  .then(result=>{
    res.json({
      code:200,
      message : "following sueccess"
    })
  })
  .catch(err=>{
    res.json({
      code:500,
      message : err
    })
  });//follow 테이블을 생성함
});



/* unfollow */
router.post('/unFollowing',async function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var follower=token_values.body.id;
  var followingNickName=req.body.nickname;
  var following;

  await User.findAll({
    where:{
      nickname:followingNickName      
    },
    attributes:['id']
  })
  .then(result=>{
    following=result[0].id;
  })//nickname에 맞는 ID를 찾아옴

  Follow.destroy({where:{
    followerId:follower,
    followingId:following
  }})
  .then(result=>{
    res.json({
      code:200,
      message:'unFollow success'
    })
  })
  .catch(err=>{
    res.json({
      code:200,
      message:err
    })
  });
});


/*  nickname을 포함하는 유저 검색   */
router.post('/search', function(req, res, next) {
  var nick=req.body.nickname;
  User.findAll({
    where:{nickname:{
      [like]:'%'+nick+'%'
    }},
    attributes:['nickname']
  })
  .then(result=>{
    //console.log(result.nickname);
    var inform=result;
    res.json(inform);
  })//nick에 해당하는 nickname을 포함하고 있는 User들을 반환해줌.
});

module.exports = router;