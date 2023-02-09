// Database
const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users ");
    console.log("All users:", allUsers);
    res.status(200).send(allUsers);
  } catch (error) {
    console.log("error at user controller", error);
  }
};

module.export = {
  getAllUsers,
};
