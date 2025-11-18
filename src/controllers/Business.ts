import { Request, Response } from "express";
import { badRequest, okResponse, serverError } from "../../libs/Response";
import { getRepo, uniqueSlug } from "../../utils";
import Business from "../models/Business";


const CreateBusiness = async(req: Request, res: Response) => {
  try {

    const businessRepo = getRepo("Business");
    const {name, type} = req.body;

    if(!name || !type) return badRequest(res, "Please provide name and type");

    const existing = await businessRepo.findOne({
      where: {
        user_id: req.user.id,
        is_active: true,
        is_deleted: false
      }
    }) as Business;

    if(existing){
      return okResponse(res, existing, "Business already existeds");
    }

    const slug = uniqueSlug(name);

    const newBusiness = new Business();

    newBusiness.name = name;
    newBusiness.type = type;
    newBusiness.slug = slug;
    newBusiness.user_id = req.user.id;

    const data = await businessRepo.save(newBusiness) as Business;

    return okResponse(res, data, "Business created.");
    
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
}

export {
  CreateBusiness
}