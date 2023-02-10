// Cors whitelist
const allowedOrigins = [
  //
  "http://localhost:3000",
  process.env.FRONT_END_URL,
];

module.exports = allowedOrigins;
