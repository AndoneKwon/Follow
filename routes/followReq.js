var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/followReq', function(req, res, next) {
  token_values=nJwt.verify(req.headers.authorization,'nodebird', 'HS256');
  follower=token_values.body.id;
  following=req.body.following;
  await User.create({
    follower,
    following,
  });
});

module.exports = router;
