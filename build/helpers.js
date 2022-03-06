var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { url } from "./config/config.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield mongoose.connect(url).catch(err => error(err));
        return database;
    });
}
function getDate() {
    const now = new Date(Date.now());
    const formatted = ('0' + now.getDate()).slice(-2) + '-' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '-' + now.getFullYear();
    return formatted;
}
function log(message) {
    console.log(chalk.bgGreen.black(message));
}
function error(message) {
    console.log(chalk.bgRed.black(message));
}
export { __filename, __dirname, connect, getDate, log, error };
