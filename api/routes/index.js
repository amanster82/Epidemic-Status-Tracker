var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//API Endpoints
router.post('/api/login', (req, res)=> {
  console.log('Received a body ', req.body);

  let obj = req.body;
  let alias = obj.alias
  let pass = obj.pass;

  console.log("this is object", obj);
  console.log("this is alias", alias);

  if(alias === "user" && pass=== "test1234"){
    res.sendStatus(200)
  }else{
    res.status(500).json({status: "Error"})
  }
});

module.exports = router;
