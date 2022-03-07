import mongoose from "mongoose";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDate() {
   const now = new Date(Date.now());
   const formatted = 
   ('0'+ now.getDate()).slice(-2) + '-' +
   ('0'+ (now.getMonth()+1)).slice(-2) + '-' +  now.getFullYear();

   return formatted;
}
function log(message :any) {
   console.log(chalk.bgGreen.black(message));
}
function error(message :any) {
   console.log(chalk.bgRed.black(message));
}

export { __filename, __dirname, getDate, log, error};

