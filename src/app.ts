import { port } from "./config.js";
import { __dirname } from "./helpers.js";

import express from "express";
import path from "path";

const app = express();

app.use("/public", express.static(__dirname + '/public'));

app.get("^/$|/acceuil(.html)?", (request, response) => {
    response.sendFile("./views/index.html", { root : "./" });
});
app.get("/login(.html)?", (request, response) => {
    response.sendFile("./views/login.html", { root : "./" });
});


// app.get("/*", (request, response) => {
//     response.status(404).sendFile("./views/404.html", { root : "./" });
// });


app.listen(port, () => {
    console.log(`Server running on port ${port} ...`);
});