const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, knex) {
  console.log("Initializing user...");
  //console.log(knex);
  const authenticateUser = async (email, password, done) => {
    console.log("Authenticating...");
    //This function is to check if the user is indeed the correct user.
    if (email === "") {
      //console.log("email is empty")
      return done(null, false, { message: "Email missing" });
    }

    email = email.toLowerCase();
    console.log("ABOUT TO KNEX");
    try {
      let user = await knex("users").where({ email: email });
      console.log("this is user", user)
      if (user.length > 0) {
        user = user[0];
        console.log("testing the pass", password)
        let checkPassword = await bcrypt.compareSync(password, user.password);
        console.log("THIS IS CHECK PASSWORD"+ checkPassword);
        if (checkPassword) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        } else {
            return done(null, false, { message: "No user with that email" }); //first parameter is the error, second is the user, third is message
        }
    } catch (err) {
      console.log(err);
      return done(null, false, { message: "Server Down" }); //first parameter is the error, second is the user, third is message
    }
  };
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "pass" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id)); // take a user and make an id for a session

  passport.deserializeUser((user, done) => {
    return done(null, user); // take the id created and remove session
  });
}

module.exports = initialize;
