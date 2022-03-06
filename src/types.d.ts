import { Request, Response, NextFunction } from 'express';

//==========//===========>> TYPES EXTENSIONS <<=========//============//

interface CustomRequest extends Request {
   results?:string;
}
interface CustomResponse extends Response {
   results?:string;
}

declare module "express-session" {
   interface SessionData {
      authenticated :boolean
   }
}