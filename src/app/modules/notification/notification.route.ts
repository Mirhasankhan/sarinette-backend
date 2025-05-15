import express from "express";

import { notificationController } from "./notification.controller";
const router = express.Router();

// router.post(
//   "/create",
//   auth(),
//   fileUploader.uploadMultiple,
//   parseBodyData,
//   manuscriptController.createManuscript
// );

router.get("/", notificationController.getNotifications);

export const notificationRoute = router;
