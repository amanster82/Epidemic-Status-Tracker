const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, knex) {
  console.log("in side the passport");
  //console.log(knex);
  const authenticateUser = async (email, password, done) => {
    console.log("authenticating...")
    //This function is to check if the user is indeed the correct user.
    if(email === ''){
        //console.log("email is empty")
        return done(null, false, {message:"Email missing"});
    }
    console.log("ABOUT TO KNEX");
    knex("account")
      .where({
        email: email,
      })
      .then((rows) => {
          //console.log(rows);
        if (rows.length > 0) {
          const user = rows[0];
         // console.log("user.id", user.id);
          try {
            if (bcrypt.compareSync(password, user.password)) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          } catch (e) {
            return done(e);
          }
        } else {
          //console.log("no user with that email is running here")
          return done(null, false, { message: "No user with that email" }); //first parameter is the error, second is the user, third is message
        }
      });
  };
  passport.use(new LocalStrategy({ usernameField: "email", passwordField: "pass" }, authenticateUser));
  
  passport.serializeUser((user, done) => done(null,user.id)); // take a user and make an id for a session

  passport.deserializeUser((user, done) => {
        return done(null, user) // take the id created and remove session
  }); 
}

module.exports = initialize;
