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

router.get("/api/metadata", async (req, res, next) => {
  console.log("------------------/api/metadata-----------------------")
  console.log(req.user);
  if(req.user == "undefined"){
    console.error("user is not logged in");
    return next();
  }
try{
  var postalCode = await knex("report")
    .select("location")
    .where({ user_id: req.user })
    .andWhere({active: true});

 
    console.log("POSTALLLLLLLL>>>>>>>>" + postalCode);
    console.log(postalCode[0].location);

    postalCode = "%" + postalCode[0].location.substring(0, 3) + "%";
    console.log("THIS IS THE LOCATION:", postalCode);

    var positiveCount = await knex("report")
      .count("user_id")
      .where({ status: "+" })
      .andWhere("location", "like", postalCode)
      .andWhere({active: true})
    positiveCount = positiveCount[0].count;
    console.log("THIS IS THE POSITIVES:", positiveCount);

    var negativeCount = await knex("report")
      .count("user_id")
      .where({ status: "-" })
      .andWhere("location", "like", postalCode)
      .andWhere({active: true})
    negativeCount = negativeCount[0].count;
    console.log("THIS IS THE NEGATIVES:", negativeCount);

    var recoveredCount = await knex("report")
      .count("user_id")
      .where({ status: "=" })
      .andWhere("location", "like", postalCode)
      .andWhere({active: true})
    recoveredCount = recoveredCount[0].count;
    console.log("THIS IS THE RECOVERED:", recoveredCount);

    var symptomCount = await knex("report")
      .count("user_id")
      .where({ status: "s" })
      .andWhere("location", "like", postalCode)
      .andWhere({active: true})
    symptomCount = symptomCount[0].count;
    console.log("THIS IS THE SYMPTOMATIC:", symptomCount);

    var coordinates = await knex("report")
      .where("location", "like", postalCode)
      .andWhere({active: true})

    console.log("these are the coordinates:", coordinates);

    res.json({
      positives: positiveCount,
      negatives: negativeCount,
      recoveries: recoveredCount,
      possibilities: symptomCount,
      locations: coordinates,
    });
  }
  catch{
    if(!req.isAuthenticated()){
      console.error("not logged in");
      return next();
    }
    console.error("Not logged information yet")
    return res.sendStatus(500);
  }  
});

router.post("/api/report", async (req, res, next) => {
  console.log("------------------/api/report-----------------------")

  let obj = Object.assign(req.body, {
    user_id: req.user,
    date_stamp: new Date(),
    active: true,
  });

  const check = await knex("report").where({ user_id: req.user });
  try{
    console.log("Trying to check");
    await knex("report")
      .where({ user_id: req.user })
      .andWhere({ active: true })
      .update({ active: false });
  }
  catch{
    console.log("this is the first time...")
  }

  knex("report")
  .insert(obj)
  .then((result) => {
    console.log("success"), res.json({ success: true, message: "ok" }); // respond back to request
  });


});

router.get("/api/dashboard", (req, res, next) => {
  console.log("------------------/api/dashboard-----------------------")
  console.log(req.user);
  knex("report")
    .where({ user_id: req.user })
    .andWhere({ date_stamp: new Date() })
    .then((rows) => {
      console.log("something went right have a look", rows[0]);
      res.json({ rows: rows[0] }); // respond back to request
    })
    .catch(() => {
      res.send("hey");
    });
});

router.get("/api/authentication", (req, res, next) => {
  console.log("------------------/api/authentication-----------------------")
  console.log("Cookie assigned: ", req.cookies);
  console.log(req.user);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    knex("users")
      .where({ id: req.user })
      .then((rows) => {
        res.json({ Auth: req.isAuthenticated(), message: "logged in" });
      });
  } else {
    console.log("not logged in");
    return res.send("not logged in");
  }
});

router.get("/api/logout", (req, res, next) => {
  console.log("logging out...");
  req.logOut();
  req.session.destroy();
  console.log("successfully? Logged out?");
  if(!req.isAuthenticated()){
    res.send(true)
    console.log("100% logged out");
  }
});

router.post("/api/login", (req, res, next) => {
  console.log("------------------/api/login-----------------------")
  return passport.authenticate("local", { session: true },(err, passportUser, info) => {
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
  console.log("------------------/api/register-----------------------")
  let obj = req.body;
  let email = obj.email;
  let pass = obj.pass;
  let gender = obj.gender;
  let birthdate = obj.birthdate;
  console.log("email:", email);
  console.log("password:", pass);
  console.log("gender", gender);
  console.log("birthday", birthdate);

  console.log("***REGISTERING***");
  const rows = await knex("users").where({
    email: email,
  });
  try {
    if (rows.length > 0) {
      console.log("sending it!");
      res.status(404);
      res.send("Account already exists");
    }
  } catch {
    console.log("HEY HEY HEY");
  }
  const hash = await bcrypt.hash(pass, 10);
  console.log("the encrypted password", hash);
  const user = await knex("users")
    .insert({
      email: email,
      password: hash,
      gender: gender,
      birthdate: birthdate,
    })
    .returning("id");

  console.log("is this the id", user[0]);

  //Create a session
  req.login(user[0], function (err) {
    if (err) {
      return next(err);
    }
    res.status(200);
    console.log("user created", req.user);
    //res.send(req.user);
    //res.redirect("/api/authentication");
    res.send("Registration Complete");
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
