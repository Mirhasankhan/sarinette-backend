import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { manuscriptRoute } from "../modules/manuscript/manuscript.route";
import { paymentRoute } from "../modules/payment/payment.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { notificationRoute } from "../modules/notification/notification.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/manuscript",
    route: manuscriptRoute,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
