import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
      "audio/mpeg",
      "video/x-matroska",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("File type not allowed") as unknown as null, false);
    }
    cb(null, true);
  },
});

// upload single image
const courseImage = upload.single("courseImage");
const profileImage = upload.single("profileImage");
const document = upload.single("document");
const audioUrl = upload.single("audioUrl");

// upload multiple image
const uploadMultiple = upload.fields([
  { name: "documentUrl", maxCount: 1 },
  { name: "profileUrl", maxCount: 1 },
  { name: "audioUrl", maxCount: 1 },
]);

export const fileUploader = {
  upload,
  courseImage,
  uploadMultiple,
  profileImage,
  document,
};
