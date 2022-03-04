import { port, corsOptions } from "./config/config.js";
import { __dirname, log, error } from "./helpers.js";
import { router } from "./router.js";

import express from "express";
import path from "path";
import session from "express-session";
import cors from "cors";
import hbs from "express-handlebars";

const app = express();
const store = new session.MemoryStore();

app.engine("hbs", hbs.engine({ extname: "hbs", defaultLayout: "main" }));
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(__dirname + "/public"));
app.use(cors(corsOptions));
app.use(session({
   secret: "Zfc15441%rza24\\razr[<",
   cookie: { maxAge: 30000 },
   saveUninitialized: false,
   resave: false,
   store
}));
app.use(express.json());

app.use("/", router);
app.listen(port, () => {
   console.log(`Server running on port ${port} ...`);
});