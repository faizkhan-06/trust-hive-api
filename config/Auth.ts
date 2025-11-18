import { IAuth } from "../types/index";

const auth: IAuth = {
  token: {
    secret: process.env.JWT_SECRET,
    options: {
      expiresIn: 86400 * 15 // specified number of seconds - 86400 - 24 hours seconds, expires in 15 days
    }
  }
};
export default auth;