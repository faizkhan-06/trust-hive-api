import { Router } from "express";
import express from "express"
import { ChangePassword, Login, Register } from "./controllers/Auth";
import userAuth from "./middlewares/user_auth";
import { okResponse } from "../libs/Response";
import { CreateBusiness, UpdateBusiness } from "./controllers/Business";
import { CreateReview, GetAllReviews } from "./controllers/Review";
import { DashboardKpiAndCharts } from "./controllers/Dashboard";

const ApiRouter = () => {
  const router = express.Router();

  // auth
  router.post("/register", Register);
  router.post("/login", Login);

  // user
  router.patch("/user/change-password", userAuth, ChangePassword);

  //business
  router.post("/business/create", userAuth, CreateBusiness);
  router.patch("/business", userAuth, UpdateBusiness);

  router.get("/dashboard", userAuth, DashboardKpiAndCharts)

  //review
  router.post("/review/create", CreateReview)
  router.get("/reviews/:businessSlug", GetAllReviews);

  return router;
}

export default ApiRouter;