import { Response } from "express";

const okResponse = (res: Response, data: any, message: string) => {
  return res.status(200).json({success: true, data, message});
}

const badRequest = (res: Response, message: string) => {
  return res.status(400).json({success: false, message}); 
}

const unauthorizedAccess = (res: Response, message: string) => {
  return res.status(401).json({success: false, message});
}

const serverError = (res: Response, message: any) => {
  return res.status(500).json({success: false, message});
}

const notFound = (res: Response, message: string) => {
  return res.status(404).json({success: false, message});
}
export {
  okResponse,
  badRequest,
  unauthorizedAccess,
  serverError,
  notFound
}