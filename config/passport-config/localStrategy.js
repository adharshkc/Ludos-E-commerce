const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { User } = require("../../models/user");

passport.use(
  "local",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "user not found" });

        if (await user.matchPassword(password)) return done(null, user);
        return done(null, false, { message: "incorrect password" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, { email: user.email });
});

passport.deserializeUser(async function (email, done) {
  try {
    // const userId = sessionUser.id
    console.log(email)
    const user = await User.findById(email);
    // console.log(user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
