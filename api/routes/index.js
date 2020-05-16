var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var passport = require("passport");
var initializePassport = require("./passport-config");

const connectionString =
  "postgressql://postgres:postgres@localhost:5433/TrackerData";

var knex = require("knex")({
  client: "pg",
  connection: connectionString,
  debug: true,
});

initializePassport(passport, knex);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/api/report", (req, res, next) => {
  console.log("INCOMING.....");

  let obj = Object.assign(req.body, {
    user_id: req.user,
    date_stamp: new Date(),
  });

  console.log(obj);
  knex("report")
    .insert(obj)
    .then((result) => {
      console.log("success"), res.json({ success: true, message: "ok" }); // respond back to request
    });
  //  .catch(
  //   console.log("something went horribly wrong"),
  //   res.status(500)
  //  )
});

router.get("/api/dashboard", (req, res, next) => {
  console.log(req.user);
  knex("report")
    .where({ user_id: req.user })
    .andWhere({ date_stamp: new Date() })
    .then((rows) => {
      console.log("something went right have a look", rows[0]);
      res.json({ success: true, message: "ok", rows: rows[0] }); // respond back to request
    })
    .catch(() => {
      res.send("hey")
    })
});

router.get("/api/authentication", (req, res, next) => {
  console.log("Cookie assigned: ", req.cookies);
  console.log(req.user);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    let test;
    knex("user")
      .where({ id: req.user })
      .then((rows) => {
        test = Object.assign(
          { Auth: req.isAuthenticated(), message: "logged in" },
          rows[0]
        );
        res.json({ Auth: req.isAuthenticated(), message: "logged in" });
      });
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

router.post("/api/register", async (req, res, next) => {
  let obj = req.body;
  let email = obj.email;
  let pass = obj.pass;
  let gender = obj.gender;
  let birthdate = obj.birthdate;
  console.log("email:", email);
  console.log("password:", pass);
  console.log("gender", gender);
  console.log("birthday", birthdate);

  console.log("***REGISTERING***")
  const rows = await knex("user").where({
    email: email,
  })
  try{
    if (rows.length > 0) {
      console.log("sending it!");
      res.status(404);
      res.send("Account already exists");
    }
  }catch{
    console.log("HEY HEY HEY")
  }
    const hash = await bcrypt.hash(pass, 10);
    console.log("the encrypted password", hash);
    const user = await knex("user")
      .insert({
        email: email,
        password: hash,
        gender: gender,
        birthdate: birthdate,
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
    //res.redirect("/api/authentication");
  });

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
