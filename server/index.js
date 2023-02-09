const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Imports
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");

// Import auth routes
const userRoutes = require("./routes/user.routes");

/* Init App */
const app = express();

/* Middleware */
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// PORT config
const PORT = process.env.PORT || 5000;

// To show something to the user
app.get("/", (req, res) => {
  res.send("This is the P.E.R.N stack application!");
});

// Heroku production app
if (process.env.NODE_ENV === "production") {
  // serve static content
  app.use(express.static(path.join(__dirname, "client/build")));
}

/* Routes */
app.use("/auth", userRoutes);

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
