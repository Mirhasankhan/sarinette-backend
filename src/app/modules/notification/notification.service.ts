import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const getNotificationFromDb = async (email: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      user: { email: email },
    },
  });

  if (notifications.length < 1) {
    throw new ApiError(404, "Notification not found");
  }
  return notifications;
};
export const notificationServices = {
    getNotificationFromDb,
}
