var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var passport = require("passport");
var initializePassport = require("./passport-config");
let pCode = "";
let province = "";

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

router.post("/api/search", (req, res, next) => {
  console.log("------------------/api/Search-----------------------");
  console.log(req.body);

  if (req.body.input.length > 3) {
    knex("report")
      .select("location")
      .where(knex.raw("UPPER(location) like upper('%"+req.body.input+"%')"))
      .andWhere({ active: true })
      .then((search_results) => {
        console.log(search_results);
        res.json({ results: search_results });
        res.end();
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    res.send("No results");
  }
});

router.post("/api/metadata", async (req, res, next) => {
  console.log("------------------/api/metadata-----------------------");
  console.log("this is the user:", req.user);

  console.log("request body", req.body.locationChange);

  if (req.user == "undefined") {
    console.error("user is not logged in");
    return next();
  }
  try {
    if (req.body.locationChange !== undefined) {
      pCode = await knex("report")
        .select("postal")
        .where({ location: req.body.locationChange })
        .limit(1);
      
      province = await knex("report")
      .select("province")
      .where({ location: req.body.locationChange })
      .limit(1);

    } else {
      pCode = await knex("report")
        .select("postal")
        .where({ user_id: req.user })
        .andWhere({ active: true });
      
      province = await knex("report")
        .select("province")
        .where({ user_id: req.user })
        .andWhere({ active: true });
    }

    pCode = pCode[0].postal;
    province = province[0].province;
    console.log("the Pcode", pCode);
    console.log("the provice", province);

    postalCode = "%" + pCode + "%";
    console.log("THIS IS THE POSTALCODE:", postalCode);

    var positiveCount = await knex("report")
      .count("user_id")
      .where({ status: "+" })
      .andWhere("postal", "like", postalCode)
      .andWhere({ active: true });
    positiveCount = positiveCount[0].count;
    console.log("THIS IS THE POSITIVES:", positiveCount);

    var negativeCount = await knex("report")
      .count("user_id")
      .where({ status: "-" })
      .andWhere("postal", "like", postalCode)
      .andWhere({ active: true });
    negativeCount = negativeCount[0].count;
    console.log("THIS IS THE NEGATIVES:", negativeCount);

    var recoveredCount = await knex("report")
      .count("user_id")
      .where({ status: "=" })
      .andWhere("postal", "like", postalCode)
      .andWhere({ active: true });
    recoveredCount = recoveredCount[0].count;
    console.log("THIS IS THE RECOVERED:", recoveredCount);

    var symptomCount = await knex("report")
      .count("user_id")
      .where({ status: "s" })
      .andWhere("postal", "like", postalCode)
      .andWhere({ active: true });
    symptomCount = symptomCount[0].count;
    console.log("THIS IS THE SYMPTOMATIC:", symptomCount);

    var coordinates = await knex("report")
      .where("postal", "like", postalCode)
      .andWhere({ active: true });

    console.log("these are the coordinates:", coordinates);

    res.json({
      positives: positiveCount,
      negatives: negativeCount,
      recoveries: recoveredCount,
      possibilities: symptomCount,
      locations: coordinates,
    });
  } catch (error) {
    if (!req.isAuthenticated()) {
      console.error("not logged in");
      return next();
    }
    console.error(error);
    console.error("Not logged information yet");
    return res.sendStatus(500);
  }
});

router.post("/api/report", async (req, res, next) => {
  console.log("------------------/api/report-----------------------");

  let obj = Object.assign(req.body, {
    user_id: req.user,
    date_stamp: new Date(),
    active: true,
  });

  try {
    console.log("Trying to check");
    await knex("report")
      .where({ user_id: req.user })
      .andWhere({ active: true })
      .update({ active: false });
  } catch {
    console.log("this is the first time...");
  }

  knex("report")
    .insert(obj)
    .then((result) => {
      console.log("success"), res.json({ success: true, message: "ok" }); // respond back to request
    });
});

router.get("/api/dashboard", async (req, res, next) => {
  console.log("------------------/api/dashboard-----------------------");
  console.log(req.user);
  console.log("this is the postal code:", pCode);
  //pCode = pCode.substring(0,3);
  console.log("this is the first three characters", pCode);
  const objectToSend = {};
  await knex("report")
    .where({ user_id: req.user })
    .andWhere({ date_stamp: new Date() })
    .then((rows) => {
      console.log("something went right have a look", rows[0]);
      Object.assign(objectToSend, { rows: rows[0] });
      if (rows[0] == undefined) {
        res.json({ rows: rows[0] });
      } else {
        var query =
          "SELECT pos_count, neg_count, symp_count, recov_count, postal, ST_AsGeoJSON(ST_Transform(canada_fsa.geom, 4326)) as geojson \
        FROM ( \
              SELECT postal \
            , COUNT(*) FILTER (WHERE status = '+') AS pos_count \
            , COUNT(*) FILTER (WHERE status = '-') AS neg_count \
            , COUNT(*) FILTER (WHERE status = 's') AS symp_count \
            , COUNT(*) FILTER (WHERE status = '=') AS recov_count \
          FROM report \
          WHERE report.active = true \
          GROUP BY postal \
    ) AS counts \
    right JOIN canada_fsa ON canada_fsa.cfsauid=counts.postal \
    WHERE canada_fsa.prname like '%"+province+"%' \
    order by st_distance(ST_Centroid(ST_Transform( \
    (SELECT geom FROM canada_fsa WHERE cfsauid = '" +
          pCode.toUpperCase() +
          "'), 4326)), ST_Centroid(ST_Transform(canada_fsa.geom, 4326))) asc limit 5";

        knex
          .raw(query)
          .then((results) => {
            Object.assign(objectToSend, { boundries: results.rows });
            res.json(objectToSend);
            //res.json(objectToSend);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch(() => {
      res.send("hey");
    });
});

router.get("/api/authentication", (req, res, next) => {
  console.log("------------------/api/authentication-----------------------");
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
  if (!req.isAuthenticated()) {
    res.send(true);
    console.log("100% logged out");
  }
});

router.post("/api/login", (req, res, next) => {
  console.log("------------------/api/login-----------------------");
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
  console.log("------------------/api/register-----------------------");
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

module.exports = router;
