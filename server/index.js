const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Database
const pool = require("./db");
// const path = require("path");

const app = express();

const corsOptions = {
  //   origin: [process.env.FRONT_END_URL],
  //   credentials: true,
  //   optionSuccessStatus: 200,
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

console.log("PostgresSQL Connection Status:", pool);

// Register and Login Routes.
app.use("/auth", authRoutes);

// Homepage
// app.use("/homepage", homepageRoutes);

// User
// app.use("/user", userRoutes);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build/index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}.`);
});
