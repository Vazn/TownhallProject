import express from "express";
import argon from "argon2";
import mongoose from "mongoose";

import { log, error } from "./helpers.js";
import { User, Event } from "./models/index.js";


const router = express.Router();

//===========//=========>>  USER ROUTES <<===============//===========//

router.get("/getUsers", async (request, response) => {
   try {
      const users = await User.find();
      response.json(users);
   } catch (e) {
      response.json({ message : e });
   }
});
router.post("/registerUser", async (request, response) => {
   const user = new User({
      email: request.body.email,
      password: request.body.password,
   });
   
   try {
      const data :Object = await user.save();
      response.json(data);
   } catch (e) {
      response.json({ message: e });
   }
});
router.post("/login", async (request, response) => {
   const email :string = request.body.email.trim();
   const password :string = request.body.password.trim();

   if (email !== "" && password !== "") {

      if (request.session.authenticated) response.json({ success: false }); 
      else {
         const existingUser = await User.findOne({ email: email });
         // await argon.verify("<big long hash>", password)

         if (existingUser !== null && existingUser.password === password) {
            request.session.authenticated = true;
            request.session.email = email;
            request.session.save();

            response.status(301).json({ success: true });   
         } 
            else {
            response.status(403).json({ success: false });
         }
      }
   } else {
      error("Form data are missing or empty !");
      response.status(400).json({ success: false });
   }
});
router.get("/logout",  (request, response) => {
   request.session.destroy(() => {
      response.redirect("/");
   });
});
router.get("/logged",  (request, response) => {
   response.send(request.session);
});

//===========//========>> PAGES RENDERING <<============//===========//

router.get("^/$|/index(.html)?", renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/about(.html)?", renderTemplate("about", "A propos"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/activities(.html)?", renderTemplate("activities", "Acitivités"));
router.get("/admin(.html)?", authentify, renderTemplate("admin", "Administration"));
router.get("/*", renderTemplate("404", "Page introuvable"));

//== NOTE : Render any template, give the name, and any number of dynamic params
function renderTemplate(page :string, title :string) {
   return (req, res) => {
      res.render(`${page}`, {
         stylesheet: `${page}.css`,
         script: `${page}.js`,
         title: title,
         logged: req.session.authenticated
      });  
   }
}
function authentify(request, response, next) {
   if (request.session.authenticated) next();
   else response.status(403).end();
}

export { router };

