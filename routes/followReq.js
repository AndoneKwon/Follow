var express = require('express');
var router = express.Router();
var nJwt = require('njwt');
const { Follow,User } = require('../models');
const Sequelize = require('sequelize');
const {like} = Sequelize.Op
var dotenv = require('dotenv').config();
const axios=require('axios');

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
  var notiBody={};
  await User.findAll({
    where:{
      nickname:followingNickName      
    },
    attributes:['id']
  })
  .then(result=>{
    following=result[0].id;
  });//nickname에 맞는 ID를 찾아옴
  console.log(following);
  notiBody.send_user=token_values.body.nickname;
  notiBody.rec_user=following;
  await Follow.findAll({
    where:{
      followerId:follower,
      followingId:following
    },
    paranoid:false//deleteAt 무시
  })
  .then(result=>{
    //console.log(result);
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
    .then(async result=>{
      await axios.post("http://localhost:3006/noti/follow",notiBody);
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
      .then(async result=>{
        await axios.post("http://localhost:3006/noti/follow",notiBody);
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
  var notiBody={};
  var following;
  /* 닉네임에 해당하는 id 불러옴 */
  await User.findAll({
    where:{
      nickname:followingNickName      
    },
  })
  .then(result=>{
    following=result[0].id;
  })
  notiBody.send_user=follower;
  notiBody.req_user=following;
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
    axios("117.17.196.142:3006/noti/unfollow",notiBody);
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

router.get('/showFollowing', function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var myId = token_values.body.id;
  var nick=req.body.nickname;
  var nicknameList;
  Follow.findAll({
    where:{followerId:myId},
    attributes:['followingId']
  })
  .then(result=>{
    //console.log(result.nickname);
    var inform=[];
    //console.log()
    for(let i=0;i<Object.keys(result).length;i++){
      inform.push(result[i].followingId);
    }
    console.log(inform);
    User.findAll({
      where:{id:inform},
      attributes:['nickname']
    })
    .then(result=>{
      //console.log(result);
      res.json(result);
    })
  })//내가 팔로우 하고있는 유저
});

router.get('/showFollower', function(req, res, next) {
  var token_values=nJwt.verify(req.headers.authorization,process.env.JWT_SECRET, 'HS256');
  var myId = token_values.body.id;
  var nick=req.body.nickname;
  Follow.findAll({
    where:{followingId:myId},
    attributes:['followerId']
  })
  .then(result=>{
    //console.log(result.nickname);
    var inform=[];
    for(let i=0;i<Object.keys(result).length;i++){
      inform.push(result[i].followerId);
    }
    User.findAll({
      where:{id:inform},
      attributes:['nickname']
    })
    .then(result=>{
      //console.log(result);
      res.json(result);
    })
  })//내가 팔로우 하고있는 유저
});

module.exports = router;