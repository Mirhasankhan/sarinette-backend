import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { notificationServices } from "./notification.service";
import sendResponse from "../../../shared/sendResponse";

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query;
  const result = await notificationServices.getNotificationFromDb(
    email as string
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Notifications Retrieved successfully",
    data: result,
  });
});

export const notificationController = {
    getNotifications
}
