var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var passport = require("passport");
var initializePassport = require("./passport-config");
const scrapeCovid = require("./scarpers.js");
const { KnexTimeoutError } = require("knex");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
let pCode = "";
let province = "";
let covid19 = "";
const isProduction = process.env.NODE_ENV === "production";

console.log("is is prod???", isProduction);

// scrapeCovid('https://www.ctvnews.ca/health/coronavirus/tracking-every-case-of-covid-19-in-canada-1.4852102')
// .then((result)=>{
//   console.log(result);
//   covid19=result;
// })


// Should come with install of pg 

const connectionString =
  "postgressql://postgres:postgres@localhost:5433/TrackerData";
const parse = require("pg-connection-string").parse;

// Parse the environment variable into an object
const pgconfig = parse( (isProduction) ? process.env.DATABASE_URL : connectionString );
// Add SSL setting to default environment variable
// pgconfig.ssl = { rejectUnauthorized: false };
const knex = require("knex")({  
  client: "pg",  
  connection: pgconfig,
});




// var knex = require("knex")({
//   client: "pg",
//   connection: {
//     connectionString: isProduction
//       ? process.env.DATABASE_URL
//       : connectionString,
//     ssl: { rejectUnauthorized: false },
//   },
//   debug: true,
// });

initializePassport(passport, knex);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/verifiedUser", async (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>hello?");
  let user = await knex("users")
    .select("verified")
    .where({ id: req.user })
    .limit(1);

  console.log(user[0]);

  res.json({ verification: user[0].verified });
});

router.post("/api/codeCheck", async (req, res, next) => {
  console.log("----------------/api/codeCheck------------------");
  console.log(req.body);

  if (req.body.changeEmail !== undefined) {
    let newEmail = req.body.changeEmail.toLowerCase();
    const rows = await knex("users")
      .where({ email: newEmail })
      .whereNot("id", req.user);
    if (rows.length > 0) {
      console.log("sending it!");
      res.status(404).send("Email already in use");
    } else {
      console.log("is the email changing?");
      await knex("users")
        .where({ id: req.user })
        .update({ email: req.body.changeEmail });
      res.json({ email: req.body.changeEmail });
    }
  }

  try {
    let user = await knex("users")
      .select("code")
      .where({ id: req.user })
      .limit(1);

    console.log(user);
    if (user[0].code === req.body.code) {
      res.json({ verify: true });
    } else {
      res.json({ verify: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/sendCode", async (req, res, next) => {
  console.log("HEY BITCH");
  console.log(req.user);
  console.log(req.body);

  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    let r = Math.random().toString(36).substring(2, 8);

    const user_code = await knex("users")
      .where({ id: req.user })
      .update({ code: r });

    let user = await knex("users")
      .select("email", "code")
      .where({ id: req.user })
      .limit(1);

    console.log(user[0].email);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER, // generated ethereal user
        pass: process.env.GMAIL_PASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"COVID-19 Tracker 😷" <foo@example.com>', // sender address
      to: user[0].email, // list of receivers
      subject: "UNLOCK CODE", // Subject line
      text:
        "Please enter the following code: " +
        user[0].code +
        " to start viral tracking. We will never contact you for this code. Do not reveal it to anyone else.",
      html:
        "Please enter the following code: <b>" +
        user[0].code +
        "</b> to start viral tracking. We will never contact you for this code. Do not reveal it to anyone else.", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.json({ email: user[0].email });
  }

  main().catch((error) => {
    console.log("an error");
    console.log(error);
    res.sendStatus(500);
  });
});

router.post("/api/verify", async (req, res, next) => {
  console.log(req.body);
  console.log(process.env.TOKEN_SECRET);
  const verification = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  console.log("verified:");
  console.log(verification);

  const hash = await bcrypt.hash(req.body.pass, 10);

  try {
    let updateUser = await knex("users").where({ id: verification.id }).update({
      password: hash,
    });
    res.sendStatus(200);
  } catch {}
});

router.post("/api/updateStatus", async (req, res, next) => {
  console.log("-------------------/api/updateStatus/------------------");
  try {
    let updateStatus = await knex("report")
      .where({ user_id: req.user })
      .andWhere({ active: true })
      .update({
        status: req.body.status,
        symptoms: req.body.symptoms,
        risk: req.body.risk,
        postal: req.body.postal,
        date_stamp: new Date(),
        lat: req.body.lat,
        long: req.body.long,
        location: req.body.location,
        province: req.body.province,
      });

    return res.send(200);
  } catch (err) {
    console.log(err);
    return res.send(500);
  }
});

router.post("/api/settings", async (req, res, next) => {
  let newEmail = req.body.email.toLowerCase();
  let newBirth = req.body.birth;
  let newGender = req.body.gender;
  let newPass = req.body.pass;

  try {
    if (newPass.length !== 0) {
      const hash = await bcrypt.hash(newPass, 10);
      console.log("the encrypted password", hash);
      let updateUser = await knex("users").where({ id: req.user }).update({
        email: newEmail,
        birthdate: newBirth,
        gender: newGender,
        password: hash,
      });
    } else {
      const rows = await knex("users")
        .where({
          email: newEmail,
        })
        .whereNot("id", req.user);
      if (rows.length > 0) {
        console.log("sending it!");
        res.status(404).send("Email already in use");
      } else {
        let updateUser = await knex("users")
          .where({ id: req.user })
          .update({ email: newEmail, birthdate: newBirth, gender: newGender });
        return res.send(200);
      }
    }
  } catch (err) {
    console.log(err);
    return res.send(500);
  }
});

//PASSWORD RESET EMAIL
router.post("/api/email", async (req, res, next) => {
  try {
    let user = await knex("users")
      .where({ email: req.body.email.toLowerCase() })
      .limit(1);
    console.log("this is the user: ", user);
    if (user.length === 0) {
      console.log("No records found");
      return res.status(404).send("Account not registered.");
    } else {
      user = user[0];
      console.log("user:", user.id);
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      console.log("created a token.", token);
      // const verification = jwt.verify(token, "SECRET");
      // console.log("this is the verification:", verification);
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER, // generated ethereal user
            pass: process.env.GMAIL_PASS, // generated ethereal password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"COVID-19 Tracker 😷" <foo@example.com>', // sender address
          to: req.body.email, // list of receivers
          subject: "Password Reset", // Subject line
          text:
            "Please click the following link to reset your password: " +
            req.body.link +
            "/Forgot/" +
            token, // plain text body
          html:
            "<b>Please click the following link to reset your password: " +
            req.body.link +
            "/Forgot/" +
            token +
            "</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.sendStatus(200);
      }

      main().catch((error) => {
        console.log("an error");
        console.log(error);
        res.sendStatus(500);
      });
    }
  } catch (err) {
    console.log(err);
    console.log("No records found");
    //res.status(404);
    return res.status(500).send("Something went wrong.");
  }
});

router.post("/api/search", (req, res, next) => {
  console.log("------------------/api/Search-----------------------");
  console.log(req.body);

  if (req.body.input.length > 2) {
    knex("report")
      .distinct("location")
      .where(knex.raw("UPPER(location) like upper('%" + req.body.input + "%')"))
      .andWhere({ active: true })
      .limit(10)
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

    var userInfo = await knex("users").where({ id: req.user });

    console.log("this is the user info:", userInfo);

    var reportInfo = await knex("report")
      .where({ user_id: req.user })
      .andWhere({ active: true })
      .limit(1);

    res.json({
      positives: positiveCount,
      negatives: negativeCount,
      recoveries: recoveredCount,
      possibilities: symptomCount,
      locations: coordinates,
      user: userInfo[0],
      report: reportInfo[0],
      scrapedData: covid19,
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

router.post("/api/verifyPostalCode", async (req, res, next) => {
  console.log("------------------/api/verifyPostal-----------------------");
  let postal = req.body.postal.toUpperCase();
  console.log("THE POSSSSSSSSSSSSSSSSTAL: ", postal);
  try {
    let checkPostal = await knex("canada_fsa").where({ cfsauid: postal });
    if (checkPostal.length) {
      console.log("THE CODE IS THIS:", checkPostal[0].cfsauid);
      res.send(checkPostal[0].cfsauid);
    } else {
      console.log("NO POSTAL");
      res.send(false);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/api/report", async (req, res, next) => {
  console.log("------------------/api/report-----------------------");

  let user = await knex("users")
    .where({ id: req.user })
    .update({ verified: true })
    .limit(1);

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
  if (req.user === undefined) {
    res.send("Not Logged In.");
  }
  console.log("this is the postal code:", pCode);
  //pCode = pCode.substring(0,3);
  console.log("this is the first three characters", pCode);
  let currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  const objectToSend = {};
  await knex("report")
    .where({ user_id: req.user, active: true })
    .andWhere(knex.raw("DATE(date_stamp) = CURRENT_DATE"))
    .then((rows) => {
      console.log("something went right have a look", rows[0]);
      Object.assign(objectToSend, { rows: rows[0] });
      if (rows[0] == undefined) {
        console.log("Something is undefined");
        console.log(rows[0]);
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
    WHERE canada_fsa.prname like '%" +
          province +
          "%' \
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
  // scrapeCovid(
  //   "https://www.ctvnews.ca/health/coronavirus/tracking-every-case-of-covid-19-in-canada-1.4852102"
  // ).then((result) => {
  //   console.log(result);
  //   covid19 = result;
  // });

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
  let email = obj.email.toLowerCase();
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
