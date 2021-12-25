import * as bcrypt from 'bcrypt';

export const encryptPassword = (password: string): string => {
  const SALT = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, SALT);
};

export const comparePasswords = (rawPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(rawPassword, hashedPassword);
};
