import { Request, Response, NextFunction } from 'express';

//==========//===========>> TYPES EXTENSIONS <<=========//============//

interface CustomRequest extends Request {
   data ? :any[];
}
interface CustomResponse extends Response {
   data? :any[];
}

declare module "express-session" {
   interface SessionData {
      authenticated :boolean
   }
}