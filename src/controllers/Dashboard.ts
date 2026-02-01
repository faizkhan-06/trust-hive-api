import { Request, Response } from "express";
import { Between } from "typeorm";
import User from "../models/User";
import Review from "../models/Review";
import { getRepo } from "../../utils";
import { badRequest, okResponse, serverError } from "../../libs/Response";

const DashboardKpiAndCharts = async (req: Request, res: Response) => {
  try {
    const ReviewRepo = getRepo("Review");

    const { start_at, end_at } = req.query;
    const user = req.user as User;

    if (!user?.business?.id) {
      return badRequest(res, "Business not found.")
    }

    const businessId = user.business.id;

    // Date filter
    let dateFilter: any = {};
    if (start_at && end_at) {
      dateFilter = {
        created_at: Between(
          new Date(start_at as string),
          new Date(end_at as string)
        ),
      };
    }

    const baseWhere = {
      business_id: businessId,
      is_deleted: 0,
      ...dateFilter,
    };

    /* =======================
       KPI CALCULATIONS
    ======================== */

    const totalReviews = await ReviewRepo.count({
      where: baseWhere,
    });

    const activeReviews = await ReviewRepo.count({
      where: { ...baseWhere, is_active: 1 },
    });

    const averageData = await ReviewRepo.createQueryBuilder("review")
      .select("AVG(review.rating)", "avg")
      .where("review.business_id = :businessId", { businessId })
      .andWhere("review.is_deleted = 0")
      .andWhere(
        start_at && end_at
          ? "review.created_at BETWEEN :start AND :end"
          : "1=1",
        {
          start: start_at,
          end: end_at,
        }
      )
      .getRawOne();

    const averageRating = parseFloat(averageData?.avg || 0).toFixed(2);

    const activePercentage =
      totalReviews > 0
        ? ((activeReviews / totalReviews) * 100).toFixed(0)
        : 0;

    /* =======================
       REVIEWS OVER TIME (Monthly)
    ======================== */

    const reviewsOverTime = await ReviewRepo.createQueryBuilder("review")
      .select("DATE_FORMAT(review.created_at, '%Y-%m')", "month")
      .addSelect("COUNT(*)", "reviews")
      .where("review.business_id = :businessId", { businessId })
      .andWhere("review.is_deleted = 0")
      .andWhere(
        start_at && end_at
          ? "review.created_at BETWEEN :start AND :end"
          : "1=1",
        {
          start: start_at,
          end: end_at,
        }
      )
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();

      const monthlyReviews = await ReviewRepo.createQueryBuilder("review")
  .where("review.business_id = :businessId", { businessId })
  .andWhere("review.is_deleted = 0")
  .andWhere("MONTH(review.created_at) = MONTH(CURRENT_DATE())")
  .andWhere("YEAR(review.created_at) = YEAR(CURRENT_DATE())")
  .getCount();


    /* =======================
       RATING DISTRIBUTION
    ======================== */

    const ratingDistributionRaw = await ReviewRepo.createQueryBuilder("review")
      .select("review.rating", "rating")
      .addSelect("COUNT(*)", "count")
      .where("review.business_id = :businessId", { businessId })
      .andWhere("review.is_deleted = 0")
      .groupBy("review.rating")
      .orderBy("review.rating", "DESC")
      .getRawMany();

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
      const found = ratingDistributionRaw.find(
        (r: any) => Number(r.rating) === star
      );
      return {
        rating: `${star}★`,
        count: found ? Number(found.count) : 0,
      };
    });

    /* =======================
       RESPONSE
    ======================== */

    return okResponse(res, {
        totalReviews,
        averageRating,
        activePercentage,
        reviewsOverTime,
        ratingDistribution,
        monthlyReviews
      }, "Dashboard Kpi and Chart fetched.")
  } catch (error) {
    console.error(error);
    return serverError(res, error);
  }
};

export { DashboardKpiAndCharts };
