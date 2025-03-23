import express from "express";
import auth from "../../middlewares/auth";
import { revieController } from "./review.controller";

const router = express.Router();

router.post("/create", auth(), revieController.createReview);
router.get("/:id", revieController.getReviews);

export const reviewRoutes = router;
