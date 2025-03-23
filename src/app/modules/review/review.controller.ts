import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReviewIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review Provided Successfully",
    data: result,
  });
});

const getReviews = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { reviews } = await reviewService.getAllReviews(id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: {
      reviews,
    },
  });
});

export const revieController = {
  createReview,
  getReviews,
};
