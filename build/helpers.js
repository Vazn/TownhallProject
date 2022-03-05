var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { url } from "./config/config.js";
import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import mongoose from "mongoose";
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield mongoose.connect(url).catch(err => error(err));
        return database;
    });
}
function log(message) {
    console.log(chalk.bgGreen.black(message));
}
function error(message) {
    console.log(chalk.bgRed.black(message));
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export { __filename, __dirname, connect, log, error };
