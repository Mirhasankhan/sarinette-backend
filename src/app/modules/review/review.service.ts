import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createReviewIntoDB = async (payload: {
  manuscriptId: string;
  rating: number;
  comment?: string;
}) => {
  const manuscript = await prisma.manuscript.findUnique({
    where: { id: payload.manuscriptId },
  });

  if (!manuscript) {
    throw new Error("Manuscript not found");
  }

  const review = await prisma.review.create({
    data: {
      ...payload,
    },
  });

  return { review };
};

const getAllReviews = async (id?: string) => {
  const filter = id ? { manuscriptId: id } : {};
  const reviews = await prisma.review.findMany({
    where: filter,
  });

  if (reviews.length === 0) {
    throw new ApiError(404, "Reviews not found!");
  }

  return {
    reviews
  };
};

export default getAllReviews;

export const reviewService = {
  createReviewIntoDB,
  getAllReviews,
};
