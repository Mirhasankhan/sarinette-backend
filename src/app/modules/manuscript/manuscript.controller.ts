import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { manuscriptService } from "./manuscript.service";
import sendResponse from "../../../shared/sendResponse";

const createManuscript = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await manuscriptService.createManuscriptInfoDB(id, req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Manuscript created successfully",
    data: result,
  });
});
const getManuscripts = catchAsync(async (req: Request, res: Response) => {
  const { search, category,email } = req.query;
  const result = await manuscriptService.getManuscriptsFromDB(
    search as string,
    category as string,
    email as string
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Manuscripts Retrieved successfully",
    data: result,
  });
});
const getManuscript = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await manuscriptService.getSingleManuscript(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Manuscript Retrieved successfully",
    data: result,
  });
});
const deleteSearch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await manuscriptService.deleteRecentSearch(id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Deleted From search list successfully",
    data: result,
  });
});
const deleteAllSearch = catchAsync(async (req: Request, res: Response) => {
  const result = await manuscriptService.deleteAllSearch();
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Search list cleared",
    data: result,
  });
});

const getManuscriptAnaltic = catchAsync(async (req: Request, res: Response) => {
  const result = await manuscriptService.getManuscriptsAnalytics(req);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Manuscripts Analtycs Got successfully",
    data: result,
  });
});

export const manuscriptController = {
  createManuscript,
  getManuscripts,
  deleteSearch,
  deleteAllSearch,
  getManuscript,
  getManuscriptAnaltic,
};
