// Database
const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users ");
    console.log("(getAllUsers) All users:", allUsers.rows);
    res.status(200).send(allUsers.rows);
  } catch (error) {
    console.log("error at user controller", error);
  }
};

module.exports = {
  getAllUsers,
};
