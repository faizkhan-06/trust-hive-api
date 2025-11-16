import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IAuth } from '../types/index';
import User from '../src/models/User';

class Authenticator {
  static config: IAuth;

  static init(config: IAuth) {
    this.config = config;
  }

  static token(id: string,_expiresIn?:number) {
    //either adminID or userID or Login Entity ID
    const tokenConfig = this.config.token || {};
    if (!tokenConfig.secret) {
      throw "Secret for signing JWT not specified in Auth config (auth.js)";
    }
    const token = jwt.sign(
      { sub: id },
      tokenConfig.secret,
      {...tokenConfig.options,expiresIn : _expiresIn ?? tokenConfig.options.expiresIn }
    );
    return token;
  }

  static getUser(req: Request) {
    return req.user as User;
  }
}

export default Authenticator;