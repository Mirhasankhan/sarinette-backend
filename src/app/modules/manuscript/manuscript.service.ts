import { Request } from "express";
import prisma from "../../../shared/prisma";
import { uploadInSpace } from "../../../shared/UploadHelper";
import { ManuscriptCategory } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { getManuscriptAnalytics } from "../../../shared/Analytics";
import axios from "axios";
import pdfParse from "pdf-parse";
const gTTS = require("gtts") as any;

const createManuscriptInfoDB = async (id: string, req: Request) => {
  const payload = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const processFiles = async (files: Express.Multer.File[], folder: string) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `courses/class/${folder}`))
    );
  };

  const extractTextFromPDF = async (fileUrl: string) => {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const pdfData = await pdfParse(response.data);
    return pdfData.text.slice(0, 5000);
  };

  const textToAudio = async (text: string) => {
    return new Promise<Buffer>((resolve, reject) => {
      const gtts = new gTTS(text, "en");
      const audioBuffer: Buffer[] = [];

      gtts
        .stream()
        .on("data", (chunk: any) => audioBuffer.push(chunk))
        .on("end", () => resolve(Buffer.concat(audioBuffer)))
        .on("error", (err: any) => reject(err));
    });
  };

  const [documentUrls, profileUrls] = await Promise.all([
    processFiles(files?.documentUrl, "documentUrl"),
    processFiles(files?.profileUrl, "profileUrl"),
  ]);

  let audioUrl = null;
  if (documentUrls?.[0]) {
    const extractedText = await extractTextFromPDF(documentUrls[0]);
    const audioBuffer = await textToAudio(extractedText);
  
    const audioFile = {
      fieldname: "audioFile",
      originalname: `audio_${Date.now()}.mp3`,
      encoding: "7bit",
      mimetype: "audio/mpeg",
      buffer: audioBuffer,
      size: audioBuffer.length,
      destination: "uploads/temp",
      filename: `audio_${Date.now()}.mp3`,
      path: `uploads/temp/audio_${Date.now()}.mp3`,
    } as unknown as Express.Multer.File;

    audioUrl = await uploadInSpace(audioFile, "audioUrl");
  }

  const result = await prisma.manuscript.create({
    data: {
      ...payload,
      documentUrl: documentUrls?.[0],
      audioUrl: audioUrl,
      profileUrl: profileUrls?.[0],
      userId: id,
    },
  });

  return result;
};

// const createManuscriptInfoDB = async (id: string, req: Request) => {
//   const payload = req.body;
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//   const processImages = async (
//     files: Express.Multer.File[],
//     folder: string
//   ) => {
//     if (!files || files.length === 0) return null;
//     return Promise.all(
//       files.map((file) => uploadInSpace(file, `courses/class/${folder}`))
//     );
//   };

//   const [documentUrl, profileUrl] = await Promise.all([
//     processImages(files?.documentUrl, "documentUrl"),
//     processImages(files?.profileUrl, "profileUrl"),
//   ]);

//   const result = await prisma.manuscript.create({
//     data: {
//       ...payload,
//       documentUrl: documentUrl?.[0],
//       profileUrl: profileUrl?.[0],
//       userId: id,
//     },
//   });
//   return result;
// };

const handleRecentSearch = async (searchTerm: string) => {
  const existingSearch = await prisma.recentSearch.findFirst({
    where: {
      searchTerm: {
        equals: searchTerm,
        mode: "insensitive",
      },
    },
  });

  if (existingSearch) {
    return;
  }

  await prisma.recentSearch.create({
    data: {
      searchTerm: searchTerm,
    },
  });
};

const getManuscriptsFromDB = async (
  search?: string,
  category?: string,
  email?: string
) => {
  if (search) {
    await handleRecentSearch(search);
  }

  const manuscripts = await prisma.manuscript.findMany({
    where: {
      title: search
        ? {
            contains: search,
            mode: "insensitive",
          }
        : undefined,
      category: category ? (category as ManuscriptCategory) : undefined,
      user: email ? { email: email } : undefined,
    },
  });

  if (manuscripts.length === 0) {
    throw new ApiError(404, "Manuscripts not found!");
  }

  return manuscripts;
};

const getSingleManuscript = async (id: string) => {
  const manuscript = await prisma.manuscript.findUnique({
    where: {
      id: id,
    },
  });
  if (!manuscript) {
    throw new ApiError(404, "Manuscript not found!");
  }
  return manuscript;
};

const deleteRecentSearch = async (id: string) => {
  const existingSearch = await prisma.recentSearch.findUnique({
    where: {
      id: id,
    },
  });
  if (!existingSearch) {
    throw new ApiError(404, "Search Not found!");
  }
  await prisma.recentSearch.delete({
    where: {
      id: id,
    },
  });
};

const deleteAllSearch = async () => {
  const existingSearch = await prisma.recentSearch.findMany();
  if (existingSearch.length < 1) {
    throw new ApiError(404, "No search found to delete!");
  }
  const result = await prisma.recentSearch.deleteMany();
  return result;
};

const getManuscriptsAnalytics = async (req: Request) => {
  const file = req.file;

  const processDocument = async (file: Express.Multer.File, folder: string) => {
    if (!file) return null;
    return uploadInSpace(file, `courses/class/${folder}`);
  };

  const document = file ? await processDocument(file, "document") : null;
  const analytics = await getManuscriptAnalytics(document as string);

  return analytics;
};

export const manuscriptService = {
  createManuscriptInfoDB,
  getManuscriptsFromDB,
  deleteRecentSearch,
  deleteAllSearch,
  getSingleManuscript,
  getManuscriptsAnalytics,
};
