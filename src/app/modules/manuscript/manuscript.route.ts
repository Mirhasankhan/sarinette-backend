import express from "express";
import auth from "../../middlewares/auth";
import { manuscriptController } from "./manuscript.controller";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { fileUploader } from "../../../helpers/fileUploadHelper";

const router = express.Router();

router.post(
  "/create",
  auth(),
  fileUploader.uploadMultiple,
  parseBodyData,
  manuscriptController.createManuscript
);
router.get(
  "/analytics",
  fileUploader.document,
  parseBodyData,
  manuscriptController.getManuscriptAnaltic
);
router.get("/", manuscriptController.getManuscripts);
router.get("/:id", manuscriptController.getManuscript);
router.delete("/search/:id", manuscriptController.deleteSearch);
router.delete("/deleteSearch", manuscriptController.deleteAllSearch);

export const manuscriptRoute = router;
