import Stripe from "stripe";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const stripe = new Stripe(config.stripe.stripe_secret as string);

const createPaymentIntent = async (
  userId: string,
  manuscriptId: string,
  amount: number
) => {
  return await prisma.$transaction(async (prisma) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const paymentRecord = await prisma.payment.create({
      data: {
        amount: amount,
        currency: "usd",
        stripeId: paymentIntent.id,
        userId: userId,
        manuscriptId: manuscriptId,
      },
    });

    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: { sold: { increment: 1 } },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentRecord,
    };
  });
};

const getPaymentsFromDB = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId: userId },
    include: {
      manuscript: {
        select: {
          title: true,
          category: true,
          profileUrl: true,        
          audioUrl: true,
          documentUrl: true,
        },
      },
    },
  });
  if (!payments) {
    throw new ApiError(404, "No Payments Found");
  }
  return payments;
};

export const payementServices = {
  createPaymentIntent,
  getPaymentsFromDB,
};
