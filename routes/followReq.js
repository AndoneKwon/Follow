var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow,User } = require('../models');
const Sequelize = require('sequelize');
const {like} = Sequelize.Op
var dotenv = require('dotenv').config();

var isEmpty = function(value){ 
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){ 
    return true 
  }else{ 
    return false 
  } 
};

// follower: 팔로잉을 하는 사람
// followering 팔로잉을 당하는사람


/* following */
router.post('/following',async function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var follower=token_values.body.id;
  var followingNickName=req.body.nickname;
  var following;
  var findResult;
  var isFollowed;

  await User.findAll({
    where:{
      nickname:followingNickName      
    },
    attributes:['id']
  })
  .then(result=>{
    following=result[0].id;
  });//nickname에 맞는 ID를 찾아옴

  await Follow.findAll({
    where:{
      followerId:follower,
      followingId:following
    },
    paranoid:false//deleteAt 무시
  })
  .then(result=>{
    console.log(result);
    findResult=result;
  })
  .catch(err=>{
    console.log(err);
    res.json({
      code:500,
      message:"오류가 발생하였습니다."
    })
  })//이전에 팔로우 했는지 검사

  /* 닉네임에 해당하는 id 불러옴 */
  if(isEmpty(findResult)){
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
      console.log(err);
      res.json({
        code:500,
        message:"오류가 발생하였습니다."
      })
    });
  }else{
    /* 테이블이 존재하고 deleteAt 존재하면 삭제 */
    if(findResult[0].deletedAt!=''){
      await Follow.restore({
        where:{
          followerId:follower,
          followingId:following
        }
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
          message : "Server Error"
        })
      })
    }else{ /* 이전에 팔로우 한상태 */
      res.json({
        code:412,
        message:"이미 팔로우 하였습니다."
      })
    }
  }
});



/* unfollow */
router.post('/unFollowing',async function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var follower=token_values.body.id;
  var followingNickName=req.body.nickname;

  /* 닉네임에 해당하는 id 불러옴 */
  await User.findAll({
    where:{
      nickname:followingNickName      
    },
  })
  .then(result=>{
    following=result[0].id;
  })

  /* 팔로우 했는지 안했는지 여부 체크 */
  await Follow.findAll({
    where:{
      followerId:follower,
      followingId:following
    }
  })
  .then(result=>{
    findResult=result;
  })
  .catch(err=>{
    console.log(err);
    res.json({
      code:500,
      message:"오류가 발생하였습니다."
    })
  })
  
  if(isEmpty(findResult)){
    res.json({
      code:412,
      message:"팔로우 하지않았습니다."
    })
  }


 /* deletedAt 컬럼에 시간표시*/
  await Follow.destroy({where:{
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
    console.log(err);
    res.json({
      code:500,
      message:"오류가 발생하였습니다."
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