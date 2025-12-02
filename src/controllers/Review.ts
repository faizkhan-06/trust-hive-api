import { Request, Response } from "express";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
} from "../../libs/Response";
import { getRepo } from "../../utils";
import User from "../models/User";
import Business from "../models/Business";
import Review from "../models/Review";

const CreateReview = async (req: Request, res: Response) => {
  try {
    const businessRepo = getRepo("Business");
    const reviewRepo = getRepo("Review");

    const { rating, review_text, slug, reviewer_name } = req.body;

    if (rating === undefined || !review_text || !slug)
      return badRequest(res, "Please provide rating, review text and slug");

    const business = (await businessRepo.findOne({
      where: {
        slug: slug,
        is_active: true,
        is_deleted: false,
      },
    })) as Business;

    if (!business) {
      return notFound(res, "Business does not found");
    }

    const newReview = new Review();

    newReview.rating = rating;
    newReview.review_text = review_text;
    newReview.business_id = business.id;
    newReview.reviewer_name = reviewer_name;

    const data = (await reviewRepo.save(newReview)) as Review;

    return okResponse(res, data, "Review created.");
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

const GetAllReviews = async (req: Request, res: Response) => {
  try {
    const reviewRepo = getRepo("Review");
    const businessRepo = getRepo("Business");
    const { businessSlug } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const business = (await businessRepo.findOne({
      where: {
        slug: businessSlug,
        is_active: true,
        is_deleted: false,
      },
    })) as Business;

    if (!business) return notFound(res, "Invalid Business.");

    const [reviews, total] = await reviewRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: "DESC" },
      where: {
        business_id: business.id,
      },
    });

    return okResponse(
      res,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        reviews,
      },
      "All reviews fetched"
    );
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

export { CreateReview, GetAllReviews };
