const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Imports
const errorHandler = require("./middleware/errorHandler");

// Database
const pool = require("./db");

const app = express();

// Cors whitelist
const whitelist = [
  //
  "http://localhost:3000",
  process.env.FRONT_END_URL,
];

const corsOptions = {
  origin: (origin, callback) => {
    /* 
    -1 means does not exist, but here we are checking !== so in context 
     we aare makign sure the domain exists in the whitelist 
     */
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Domain not in the whitelist. Not allowed by CORS origin."));
    }
  },
  optionSuccessStatus: 200,
  credentials: true,
};
// console.log("Cors Option:", corsOptions);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Heroku configs
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("This is the P.E.R.N stack application!");
});

if (process.env.NODE_ENV === "production") {
  // serve static content
  app.use(express.static(path.join(__dirname, "client/build")));
}

// Import auth routes
const authRoutes = require("./routes/authRoutes");
// const homepageRoutes = require("./routes/homepage");
// const userRoutes = require("./routes/userRoutes");

// console.log("PostgresSQL Connection Status:", pool);

// Register and Login Routes.
app.use("/auth", authRoutes);

// Homepage
// app.use("/homepage", homepageRoutes);

// User
// app.use("/user", userRoutes);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build/index.html"));
// });

/* Error catcher */
app.all("*", (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  res.status(404).send(`<h1>Page you are looking for (${fullUrl}) does <em>not</em> exist.</h1>`);
});

// Server Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}.`);
});
