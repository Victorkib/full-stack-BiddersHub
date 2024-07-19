import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};

export const compareString = async (token, hashedToken) => {
  const isMatch = await bcrypt.compare(token, hashedToken);
  return isMatch;
};

// JSON WEBTOKEN
export const createJWT = function (id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
};
