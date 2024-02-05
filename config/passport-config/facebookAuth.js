const passport = require("passport");
const { User } = require("../../models/user");
const facebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new facebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.FB_CB_URL,
    state: true
  },
 async function(accessToken, refreshToken, profile, done){
    const userEmail = profile.emails;
    const user = await User.findOne({email: userEmail})
    if(user){
        return done(null, user)
    }else{
        const defaultPassword = 'defaultPassword';
        const newUser = new User({
            // email: profile.i,
            name: profile.displayName,
            password: defaultPassword
        })
        newUser.save();
        return done(null, newUser)
    }
  }
  )
);
