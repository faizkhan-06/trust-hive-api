import { Request, Response } from "express";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
} from "../../libs/Response";
import { getRepo, uniqueSlug } from "../../utils";
import Business from "../models/Business";
import User from "../models/User";

const CreateBusiness = async (req: Request, res: Response) => {
  try {
    const businessRepo = getRepo("Business");
    const { name, type } = req.body;

    if (!name || !type) return badRequest(res, "Please provide name and type");

    const existing = (await businessRepo.findOne({
      where: {
        user_id: req.user.id,
        is_active: true,
        is_deleted: false,
      },
    })) as Business;

    if (existing) {
      return okResponse(res, existing, "Business already existeds");
    }

    const slug = uniqueSlug(name);

    const newBusiness = new Business();

    newBusiness.name = name;
    newBusiness.type = type;
    newBusiness.slug = slug;
    newBusiness.user_id = req.user.id;

    const data = (await businessRepo.save(newBusiness)) as Business;

    return okResponse(res, data, "Business created.");
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

const UpdateBusiness = async (req: Request, res: Response) => {
  try {
    const businessRepo = getRepo("Business");
    const { name, type } = req.body;
    const user = req.user as User;

    if (!name || !type)
      return badRequest(
        res,
        "The request must include both 'name' and 'type'.",
      );

    const business = await businessRepo.findOne({
      where: {
        user_id: user.id,
      },
    });

    if (!business) return notFound(res, "Business Not Found");

    await businessRepo.save({
      id: business.id,
      name: name,
      type: type,
    });

    const updatedBusiness = await businessRepo.findOne({
      where: {
        user_id: user.id,
      },
    });

    return okResponse(
      res,
      { user: { ...user, business: updatedBusiness } },
      "Business Updated.",
    );
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

export { CreateBusiness, UpdateBusiness };
