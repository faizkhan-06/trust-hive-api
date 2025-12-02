import { NextFunction, Request, Response } from "express";
import { serverError } from "../../libs/Response";
import auth from "../../config/Auth";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { getRepo } from "../../utils";


export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];
  let decodedToken: JwtPayload | string;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token: string | null = authorization
      ? authorization.split(" ")[1]
      : null;
    if (!token) {
      decodedToken = {};
    }
    try {
      if (token) {
        decodedToken = jwt.verify(token, auth.token.secret ?? "");
        // console.log("MIDDLE WARE: ", decodedToken);
        if (decodedToken && decodedToken.sub) {

          const userRepo = getRepo("User");

          const user: User = await userRepo.findOne({
            where: {
              id: decodedToken.sub,
              is_active: 1,
              is_deleted: 0
            },
            relations: {
              business: true
            }
          }) as User;

          if (!user){
            return res
              .status(401)
              .json({ success: false, message: "Cannot Find User" });
          }
          req.user = user;
          return next();
        }
      }
      throw "NOT A VALID JWT TOKEN";
    } catch (err: any) {
      const error = err as JsonWebTokenError;
      if (error && error.name === "TokenExpiredError") {
        return res.json({
          success: false,
          message: "Token has expired at " + err.expiredAt,
        });
      } else {
        return res.json({ success: false, message: "Invalid token" });
      }
    }
  } else {
    return res.json({ success: false, message: "Unauthorized access!" });
  }
};
