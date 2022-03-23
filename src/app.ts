import express from "express";
import session from "express-session";
import mongoose from 'mongoose';
import MongoStore from "connect-mongo";
import cors from "cors";
import path from "path";
import hbs from "express-handlebars";

import { port, url, corsOptions } from "./config/config.js";
import { __dirname, log, error } from "./helpers.js";
import { router } from "./router.js";

const app = express();
const client = connect();

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
      clientPromise: client
   })
}));
app.use(express.json());

app.use("/", router);

app.listen(port, () => {
   console.log(`Server running on port ${port} ...`);
});

async function connect() {
   try {
      const database = await mongoose.connect(url);
      return database.connection.getClient();
   } catch (e) {
      error(e);
   }
}