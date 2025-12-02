import { Router } from "express";
import express from "express"
import { Login, Register } from "./controllers/Auth";
import userAuth from "./middlewares/user_auth";
import { okResponse } from "../libs/Response";
import { CreateBusiness } from "./controllers/Business";
import { CreateReview, GetAllReviews } from "./controllers/Review";

const ApiRouter = () => {
  const router = express.Router();

  // auth
  router.post("/register", Register);
  router.post("/login", Login);

  //business
  router.post("/business/create", userAuth, CreateBusiness);

  //review
  router.post("/review/create", CreateReview)
  router.get("/reviews/:businessSlug", GetAllReviews);

  return router;
}

export default ApiRouter;