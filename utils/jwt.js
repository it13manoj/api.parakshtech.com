const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const secret = process.env.SECRET_KEY || "pARAkshTechSchools";
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    secret,
    {
      expiresIn: "7d",
    }
  );
};

