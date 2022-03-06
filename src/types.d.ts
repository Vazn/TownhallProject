import { Request, Response, NextFunction } from 'express';

//==========//===========>> TYPES EXTENSIONS <<=========//============//

interface CustomRequest extends Request {
   data ?:Object;
}
interface CustomResponse extends Response {
   data?:string;
}

declare module "express-session" {
   interface SessionData {
      authenticated :boolean
   }
}