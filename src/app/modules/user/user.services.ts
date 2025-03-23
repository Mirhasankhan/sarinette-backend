import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { uploadInSpace } from "../../../shared/UploadHelper";

const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already exists!");
  }
  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  let publicName = `@${payload.userName.toLowerCase().replace(/\s+/g, "")}`;

  let existingPublicName = await prisma.user.findFirst({
    where: { publicName: publicName },
  });

  let counter = 1;
  while (existingPublicName) {
    publicName = `${publicName}${counter}`;
    existingPublicName = await prisma.user.findFirst({
      where: { publicName: publicName },
    });
    counter++;
  }

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      publicName: publicName,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, ...sanitizedUser } = user;

  return {
    accessToken,
    user: sanitizedUser,
  };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const getUsersIntoDB = async (id: string) => {
  const users = await prisma.user.findMany({
    where: {
      id: { not: id },
    },
  });

  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }

  const sanitizedUsers = users.map(
    ({ password, ...sanitizedUser }) => sanitizedUser
  );

  return sanitizedUsers;
};

//update user
const updateUserIntoDB = async (id: string, req: any) => {
  const userData = req.body;
  const file = req.file;

  const processImage = async (file: Express.Multer.File, folder: string) => {
    if (!file) return null;
    return uploadInSpace(file, `courses/class/${folder}`);
  };

  const profileImage = file ? await processImage(file, "profileImage") : null;

  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const existingUser = await getSingleUserIntoDB(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }

  if (userData.publicName) {
    const userWithSameUsername = await prisma.user.findFirst({
      where: {
        publicName: userData.publicName,
        id: { not: id },
      },
    });

    if (userWithSameUsername) {
      throw new ApiError(409, "User name already taken");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...userData,
      profileImage: profileImage,
    },
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};

//delete user
const deleteUserIntoDB = async (userId: string, loggedId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUserIntoDB(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return;
};

export const userService = {
  createUserIntoDB,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
