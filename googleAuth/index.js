require("dotenv").config();

const express = require("express");
// const bodyParser = require("body-parser")
const app = express();
const session = require("express-session");
const cookie = require("cookie-parser");
// app.use(bodyParser());
app.set("view engine", "ejs");
app.use(cookie());
app.use(express.static("views"))
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("pages/success",{
        user: userProfile,
    });
});
app.get("/login", function (req, res) {
  res.render("pages/auth");
});

app.post("/submitform", (req, res) => {
    console.log(req.body.email)
})

const port = process.env.PORT || 5007;
app.listen(port, () => console.log("App listening on port " + port));

// index.js

/*  PASSPORT SETUP  */

const passport = require("passport");
var userProfile = {};

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", (req, res) => {

    if(Object.keys(userProfile).length > 0){
        console.log(userProfile.photos[0].value)

    }
  res.render("pages/success", {
    user: userProfile,
  });

});


app.get("/Delhi_article", (req, res) => {
    res.render("pages/article1", {
        user: userProfile,
    });
});

app.get("/Pondicherry_article", (req, res) => {
    res.render("pages/article2", {
        user: userProfile,
    });
});



app.get("/Leh_Ladakh_article", (req, res) => {
    res.render("pages/article3", {
        user: userProfile,
    });
});

app.get("/Delhi_info", (req, res) => {
    console.log(userProfile)
    res.render("pages/delhi_info", {
        user: userProfile,
    });

});

app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "574458922892-jial3elaoo70v5a3eqpde9hs9f6bkedp.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
        // console.log(profile)
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
