var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import session from "express-session";
import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
import cors from "cors";
import path from "path";
import hbs from "express-handlebars";
import { port, url, corsOptions } from "./config/config.js";
import { __dirname, error } from "./helpers.js";
import { router } from "./router.js";
const app = express();
const db = connect();
app.engine("hbs", hbs.engine({ extname: "hbs", defaultLayout: "main" }));
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(__dirname + "/public"));
app.use(cors(corsOptions));
app.use(session({
    name: "SessionID",
    secret: "Zfc15441%rza24\\razr[<",
    cookie: { maxAge: 604800000 },
    saveUninitialized: false,
    resave: true,
    store: MongoStore.create({
        collectionName: "sessions",
        clientPromise: db,
    })
}));
app.use(express.json());
app.use("/", router);
app.listen(port, () => {
    console.log(`Server running on port ${port} ...`);
});
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const database = yield mongoose.connect(url);
            return database.connection.getClient();
        }
        catch (e) {
            error(e);
        }
    });
}
