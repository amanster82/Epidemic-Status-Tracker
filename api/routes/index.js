var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var passport = require("passport");
var initializePassport = require("./passport-config");

const connectionString =
  "postgressql://postgres:postgres@localhost:5433/postgres";

var knex = require("knex")({
  client: "pg",
  connection: connectionString,
  debug: true,
});

// const { Client } = require('pg');
// const client = new Client({
//   connectionString:connectionString
// })

// client.connect();
//const getUserById = "hey";
initializePassport(passport, knex);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/authentication", (req, res, next) => {
  console.log("Cookie assigned: ", req.cookies);
  console.log(req.user);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.send("logged in");
  } else {
    res.send("not logged in");
  }
});

router.post("/api/login", (req, res, next) => {
  return passport.authenticate(
    "local",
    { session: true },
    (err, passportUser, info) => {
      console.log(
        "HEEEEEEEEEEEEEEEEEEEEEEEEEEEY Bitch",
        err,
        passportUser,
        info
      );
      if (err) {
        return next(err);
      }
      if (passportUser) {
        // SUCCCESS
        console.log("%%%%%%%%%%%%%%%%%%%%%%%");
        //console.log(res.json({ user: passportUser }))
        //Create a session
        req.login(passportUser.id, function (err) {
          if (err) {
            return next(err);
          }
          //res.status(200);
          console.log("user created", passportUser.id);
          //res.send(passportUser.id);
        });
        return res.json({ user: passportUser, hey: "WTF IS GOING ON?" });
      }

      return res.status(400).send(info);
    }
  )(req, res, next);
});

// router.post('/api/login', (req, res) => {

//   let obj = req.body;
//   let email = obj.email
//   let pass = obj.pass;

//   console.log("  in table now...");
// knex('account')
// .where({
//   email:  email,
//   password: pass
// })
// .then(rows => {
//   if(rows.length > 0){
//     res.status(200).json({status: "Success"});
//   } else{
//     res.status(500).json({status: "Error"})
//   }
// })
// });

// router.post("/api/register", (req, res) => {
//   let obj = req.body;
//   let email = obj.email;
//   let pass = obj.pass;

//   console.log("email:", email);
//   console.log("password:", pass);

//   knex("account")
//     .where({
//       email: email,
//     })
//     .then((rows) => {
//       if (rows.length > 0) {
//         console.log("sending it!");
//         res.status(404);
//         res.send("Account already exists");
//         //res.sendStatus(404);
//       } else {
//         bcrypt.hash(pass, 10).then(function (hash) {
//           console.log("the encrypted password", hash);
//           knex("account")
//             .insert({
//               email: email,
//               password: hash,
//             })
//             .then(() => {
//               res.status(200);
//               res.send("Account created!");
//             });
//         });
//       }
//     });
// });

router.post("/api/register", async (req, res, next) => {
  let obj = req.body;
  let email = obj.email;
  let pass = obj.pass;
  console.log("email:", email);
  console.log("password:", pass);
  const rows = await knex("account").where({
    email: email,
  });
  if (rows.length > 0) {
    console.log("sending it!");
    res.status(404);
    res.send("Account already exists");
  } else {
    const hash = await bcrypt.hash(pass, 10);
    console.log("the encrypted password", hash);
    const user = await knex("account")
      .insert({
        email: email,
        password: hash,
      })
      .returning("id");

    console.log("is this the id", user);

    //Create a session
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200);
      console.log("user created", user);
      res.send(user);
      res.redirect("/api/authentication");
    });
  }

  console.log(req.user);
  console.log(req.isAuthenticated());
});

passport.serializeUser((user, done) => {
  console.log("tryin to serialize the user:" + user);
  done(null, user);
}); // take a user and make an id for a session

passport.deserializeUser((user, done) => {
  console.log("hey there???", user);
  return done(null, user); // take the id created and remove session
});

// //API Endpoints
// router.post('/api/login', (req, res)=> {
//   console.log('Received a body ', req.body);
//   console.log("timing the app out....")

//   let obj = req.body;
//   let email = obj.email
//   let pass = obj.pass;
//   console.log("this is object", obj);
//   console.log("this is email", email);

//   console.log("the query is this:");
//   console.log('SELECT * FROM account WHERE email= \'' + email + '\' AND password= \'' + pass+'\'');

//   client.query('SELECT * FROM account WHERE email= \'' + email + '\' AND password= \'' + pass+'\'', (err, result) =>{
//     if(err){
//       console.log("what the fuck is going on here!?");
//       console.log(err);
//     }
//     if(result.rowCount != 0){
//       console.log(result.rows);
//       find = true;
//       res.status(200).json({status: "Success"});
//     }else{
//       console.log("it was an error");
//       res.status(500).json({status: "Error"})
//     }
//     //console.log(err, res);
//     client.end;
//   })
// });

module.exports = router;
