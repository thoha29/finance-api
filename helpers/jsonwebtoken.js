const jwt = require('jsonwebtoken');
const secretCode = process.env.SECRET_CODE || 'bebas';

const tokenGenerator = (data) => {
  const { id, user_name, name, business_code, level } = data;
  return jwt.sign(
    {
      id,
      user_name,
      name,
      business_code,
      level,
    },
    secretCode
  );
};

const tokenVerifier = (data) => {
  return jwt.verify(data, secretCode);
};
module.exports = { tokenGenerator, tokenVerifier };
