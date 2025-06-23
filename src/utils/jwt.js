import jwt from "jsonwebtoken";

import { JWT_REFRESH_SECRET, JWT_SECRET, RESET_PASSWORD_SECRET } from "../configs/enviroments.js";
const generateToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "30m" });
};
export const generateResetToken = (user) => {
  return jwt.sign({ id: user._id }, RESET_PASSWORD_SECRET, { expiresIn: "15m" });
};
const generateRefreshToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: "6d" });
};

export { generateToken, generateRefreshToken };
