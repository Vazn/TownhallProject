import { port, corsOptions } from "./config/config.js";
import { __dirname } from "./helpers.js";
import { router } from "./router.js";

import express from "express";
import session from "express-session";
import cors from "cors";

const app = express();
const store = new session.MemoryStore();

app.use(session({
   secret: "WTF IS THAT",
   cookie: { maxAge: 30000 },
   saveUninitialized: false,
   resave: false,
   store
}))
app.use(express.json());
app.use(express.urlencoded({ 
   extended: true 
}));

app.use(cors(corsOptions));

app.use("/public", express.static(__dirname + "/public"));
app.use("/", router);

app.listen(port, () => {
   console.log(`Server running on port ${port} ...`);
});