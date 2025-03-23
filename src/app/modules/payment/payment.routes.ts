import express from "express";
import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post(
  "/create-payment-intent",
  auth(),
  paymentController.handleCreatePaymentIntent
);
router.get("/payments", auth(), paymentController.getPayments);

export const paymentRoute = router;
