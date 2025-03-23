import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploadHelper";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  // validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createUser
);
router.get("/", auth(), UserControllers.getUsers);
router.get("/:id", auth(), UserControllers.getSingleUser);
router.put(
  "/update",
  auth(),
  fileUploader.profileImage,
  parseBodyData,
  validateRequest(userValidation.userUpdateValidationSchema),
  UserControllers.updateUser
);
router.delete("/:id", UserControllers.deleteUser);

export const userRoutes = router;
