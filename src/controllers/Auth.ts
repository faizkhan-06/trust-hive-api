import { Request, Response } from "express";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
  unauthorizedAccess,
} from "../../libs/Response";
import { getRepo } from "../../utils";
import bcrypt from "bcrypt";
import User from "../models/User";
import Authenticator from "../../libs/Authenticator";

const Register = async (req: Request, res: Response) => {
  try {
    const userRepo = getRepo("User");

    const { email, password } = req.body;

    if (!email || !password)
      return badRequest(res, "Email and Password both are required !");

    const emailCount = await userRepo.count({
      where: {
        email: email,
      },
    });

    if (emailCount > 0)
      return badRequest(res, "Email already existed. Please try to login.");

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User();

    newUser.email = email;
    newUser.password = hashedPassword;

    const user = await userRepo.save(newUser);

    const token = Authenticator.token(user.id);

    return okResponse(res, { user: user, token: token }, "User Registered");
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const userRepo = getRepo("User");
    const { email, password } = req.body;

    if (!email || !password)
      return badRequest(res, "Email and Password both are required !");

    const existingUser = (await userRepo.findOne({
      where: {
        email: email,
      },
    })) as User;

    if (!existingUser) return notFound(res, "User not found!");

    const isPasswordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatched)
      return unauthorizedAccess(res, "Incorrect password");

    const token = Authenticator.token(existingUser.id);

    return okResponse(
      res,
      { user: existingUser, token: token },
      "User Logged In"
    );
  } catch (error) {
    console.error(error);

    return serverError(res, error);
  }
};

export { Register, Login };
