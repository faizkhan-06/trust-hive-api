import { Request, Response } from "express";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
  unauthorizedAccess,
} from "../../libs/Response";
import { getRepo, uniqueSlug } from "../../utils";
import bcrypt from "bcrypt";
import User from "../models/User";
import Authenticator from "../../libs/Authenticator";
import Business from "../models/Business";

const Register = async (req: Request, res: Response) => {
  try {
    const businessRepo = getRepo("Business");
    const userRepo = getRepo("User");

    const { email, password, business_name, business_type } = req.body;

    if (!email || !password || !business_name || !business_type)
      return badRequest(res, "All fields are required.");

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

    const slug = uniqueSlug(business_name);

    const newBusiness = new Business();

    newBusiness.name = business_name;
    newBusiness.type = business_type;
    newBusiness.slug = slug;
    newBusiness.user_id = user.id;

    const businessData = (await businessRepo.save(newBusiness)) as Business;

    const token = Authenticator.token(user.id);

    return okResponse(res, { user: {...user, business: businessData}, token: token}, "User Registered");
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
      relations: {
        business: true
      }
    })) as User;

    if (!existingUser) return notFound(res, "Invalid email or password.");

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
