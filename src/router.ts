import express from "express";
import formidable from "formidable";
import argon from "argon2";

import { connect, log, error } from "./helpers.js";

const router = express.Router();
connect();

router.get("^/$|/index(.html)?", (request, response) => {
   response.render("index", {
      stylesheet: "home.css",
      script: /* Scripts here */"",
      title: "Mairie de Rouffiac d'Aude",
   });
});
router.get("/login(.html)?", (request, response) => {
   response.render("login", {
      stylesheet: "login.css",
      script: "login.js",
      title: "Connexion",
   });
});
router.get("/about(.html)?", (request, response) => {
   response.render("about", {
      stylesheet: "about.css",
      script: /* Scripts here */"",
      title: "A propos",
   });
});
router.get("/legal(.html)?", (request, response) => {
   response.render("legal", {
      stylesheet: "legal.css",
      script: /* Scripts here */"",
      title: "Mentions légales",
   });
});
router.get("/activities(.html)?", (request, response) => {
   response.render("activities", {
      stylesheet: "activities.css",
      script: /* Scripts here */"",
      title: "Mentions légales",
   });
});
router.get("/*", (request, response) => {
   response.status(404).render("404", {
      stylesheet: "404.css",
      script: /* Scripts here */"",
      title: "Erreur",
   });
});



router.post("/fetchTest", (request, response) => {
   response.json({
      attribut1: 1,
      attribut2: "blaaaa",
   });
});
router.post("/login", (request, response) => {
   const form = formidable();

   form.parse(request, async (err, fields, files) => {
      if (err) {
         error("Unable to parse form data !");
         response.status(400).json({ sucess: false });
      }
      const { email, password } = fields;

      error({ test: 1 });

      if (typeof email === "string" && typeof password === "string") {
         if (request.session.authenticated) response.json(request.session); 
         else {
            // if (await argon.verify("<big long hash>", password)) {

            //    request.session.authenticated = true;
            //    request.session.user = {
            //       email: email,
            //    }
            //    response.status(200).json(request.session);

            // } else response.status(403).json({ sucess: false });
         }
      } else {
         error("Form data are missing or wrong type !");
         response.status(400).json({ sucess: false });
      }
   });
});

export { router };

