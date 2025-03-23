import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { payementServices } from "./payment.service";

const handleCreatePaymentIntent = async (req: Request, res: Response) => {
  const { amount,manuscriptId } = req.body;
  const userId = req.user.id;
  const paymentData = await payementServices.createPaymentIntent(
    userId,
    manuscriptId,
    amount
    
  );
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Successfull",
    data: paymentData,
  });
};
const getPayments = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const paymentsData = await payementServices.getPaymentsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payements Retrieved Successfully",
    data: paymentsData,
  });
};

export const paymentController = {
  handleCreatePaymentIntent,
  getPayments,
};
