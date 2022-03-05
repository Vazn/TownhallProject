import { url } from "./config/config.js";

import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import mongoose from "mongoose";

async function connect() {
   const database = await mongoose.connect(url).catch(err => error(err));
   return database;
}
function log(message :any) {
   console.log(chalk.bgGreen.black(message));
}
function error(message :any) {
   console.log(chalk.bgRed.black(message));
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//== REMINDER: Extending express-session to allow custom attributes
declare module "express-session" {
   export interface SessionData {
      authenticated :boolean;
      email :string;
   }
}

export { __filename, __dirname, connect, log, error};

