var express = require('express');
var router = express.Router();
const connectionString = 'postgressql://postgres:postgres@localhost:5433/postgres'
const { Client } = require('pg');
const client = new Client({
  connectionString:connectionString
})

client.connect();




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//API Endpoints
router.post('/api/login', (req, res)=> {
  console.log('Received a body ', req.body);
  console.log("timing the app out....")
    
  let obj = req.body;
  let email = obj.email
  let pass = obj.pass;
  console.log("this is object", obj);
  console.log("this is email", email);

  console.log("the query is this:");
  console.log('SELECT * FROM account WHERE email= \'' + email + '\' AND password= \'' + pass+'\'');

  client.query('SELECT * FROM account WHERE email= \'' + email + '\' AND password= \'' + pass+'\'', (err, result) =>{
    if(err){
      console.log("what the fuck is going on here!?");
      console.log(err);
    }
    if(result.rowCount != 0){
      console.log(result.rows);
      find = true;
      res.status(200).json({status: "Success"});
    }else{
      console.log("it was an error");
      res.status(500).json({status: "Error"})
    }
    //console.log(err, res);
    client.end;
  })
});

module.exports = router;
