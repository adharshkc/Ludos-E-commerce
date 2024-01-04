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
  done(null, { _id: user._id });
});

passport.deserializeUser(async function (_id, done) {
  try {
    // const userId = sessionUser.id
    const user = await User.findById(_id);
    // console.log(user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
