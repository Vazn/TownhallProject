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

router.get("^/$|/index(.html)?", (request, response) => {
   response.render("index", {
      stylesheet: "index.css",
      script: /* Scripts here */"",
      title: "Mairie de Rouffiac d'Aude",
      logged: request.session.authenticated
   });  
});
router.get("/login(.html)?", (request, response) => {
   response.render("login", {
      stylesheet: "login.css",
      script: "login.js",
      title: "Connexion",
      logged: request.session.authenticated
   });   
});
router.get("/about(.html)?", (request, response) => {
   response.render("about", {
      stylesheet: "about.css",
      script: /* Scripts here */"",
      title: "A propos",
      logged: request.session.authenticated
   });
});
router.get("/legal(.html)?", (request, response) => {
   response.render("legal", {
      stylesheet: "legal.css",
      script: /* Scripts here */"",
      title: "Mentions légales",
      logged: request.session.authenticated
   });
});
router.get("/activities(.html)?", (request, response) => {
   response.render("activities", {
      stylesheet: "activities.css",
      script: "activities.js",
      title: "Activités",
      logged: request.session.authenticated
   });
});
router.get("/admin(.html)?", (request, response) => {
   if (request.session.authenticated) {
      response.render("admin", {
         stylesheet: "admin.css",
         script: "admin.js",
         title: "Administation",
         logged: request.session.authenticated
      });  
   } else {
      response.status(403).end();
   }
});

router.get("/*", (request, response) => {
   response.status(404).render("404", {
      stylesheet: "404.css",
      script: /* Scripts here */"",
      title: "Page introuvable",
      logged: request.session.authenticated
   });
});

export { router };

