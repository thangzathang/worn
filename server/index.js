const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Database
// const pool = require("./db");
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
// console.log(__dirname);

// Middle ware
// const authorization = require("./middleware/authorization");

// Import auth routes
const authRoutes = require("./routes/authRoutes");
// const homepageRoutes = require("./routes/homepage");
// const userRoutes = require("./routes/userRoutes");

// console.log("PostgresSQL Connection Status:", pool);

// PORT

// ROUTES

/* Movie */

/*
// 1. Create a movie.
app.post("/movies", async (req, res) => {
  // await
  try {
    // console.log("Received", req.body);
    const { movie_name, movie_description, movie_rating, movie_year, imageurl } = req.body;

    const newMovie = await pool.query(
      `
    INSERT INTO movies (movie_name, movie_description, movie_rating, movie_year, imageurl ) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [movie_name, movie_description, movie_rating, movie_year, imageurl]
    );

    res.json(newMovie.rows[0]);
  } catch (error) {
    console.log("Error at POST movie:", error);
  }
});
*/

/*
// 2. Get all movies.
app.get("/movies", async (req, res) => {
  try {
    const allMovies = await pool.query(
      //
      `
    SELECT 
      movies.movie_name, 
      movies.movie_rating, 
      movies.movie_year, 
      movies.movie_description, 
      movies.imageurl, 
      movies.movie_id, 
      users.user_name,
      users.user_id
    FROM movies 
    INNER JOIN users ON movies.user_id = users.user_id`
    );

    res.json(allMovies.rows);
  } catch (error) {
    console.log("Error at GET movies:", error);
  }
});
*/

/*
// 3. Get a [specific] movie.
app.get("/movies/:movie_id", async (req, res) => {
  try {
    const { movie_id } = req.params;

    // 1. This works
    // const movieData = await pool.query(
    //   `
    //   SELECT * FROM movies WHERE movie_id = ${movie_id};
    // `
    // );

    // 2. This works too
    const movieData = await pool.query(
      `
      SELECT * FROM movies WHERE movie_id = $1
    `,
      [movie_id]
    );

    res.json(movieData.rows[0]);
  } catch (error) {
    console.log("Error at GET a [specific] movie:", error);
  }
});
*/

/* Auth */

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
