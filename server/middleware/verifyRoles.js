const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];
    console.log("Allowed roles:", rolesArray); // Roles required to move on
    console.log("User's roles:", req.roles); // Roles from the verify JWT

    const result = req.roles.map((role) => rolesArray.includes(role)).find((val) => val === true);
    if (!result) {
      // It means not one true was found. Thus user does not have the right roles.
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = verifyRoles;
