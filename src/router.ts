import { Request, Response, NextFunction } from 'express';
import express from "express";
import multer from "multer";
import argon from "argon2";

import { log, error } from "./helpers.js";
import { CustomResponse } from "./types.js";
import { User, Event } from "./models/index.js";


const router = express.Router();
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      if (file.mimetype.includes("image")) callback(null, "uploads/images");
      if (file.mimetype.includes("video")) callback(null, "uploads/videos");
      if (file.mimetype.includes("application")) callback(null, "uploads/documents");
   },
   filename: (req, file, callback) => {
      const { originalname } = file;

      callback(null, `${formattedDate()}-${originalname}`);
   }
});
const upload = multer({
   storage: storage,
});
//===========//==========>> ADMIN ROUTES <<=============//===========//

router.post("/createArticle", upload.any(), (req, res) => {
   console.log(req.body);
});

//===========//=========>>  USER ROUTES <<===============//===========//

router.get("/getUsers", async (req :Request, res :Response) => {
   try {
      const users = await User.find();
      res.json(users);
   } catch (e) {
      res.json({ message : e });
   }
});
router.post("/registerUser", async (req :Request, res :Response) => {
   const user = new User({
      email: req.body.email,
      password: req.body.password,
   });
   
   try {
      const data :Object = await user.save();
      res.json(data);
   } catch (e) {
      res.json({ message: e });
   }
});
router.post("/login", async (req :Request, res :Response) => {
   const email :string = req.body.email.trim();
   const password :string = req.body.password.trim();

   if (email !== "" && password !== "") {

      if (req.session.authenticated) res.json({ success: false }); 
      else {
         const existingUser = await User.findOne({ email: email });
         // await argon.verify("<big long hash>", password)

         if (existingUser !== null && existingUser.password === password) {
            req.session.authenticated = true;
            req.session.save();

            res.status(301).json({ success: true });   
         } 
            else {
            res.status(403).json({ success: false });
         }
      }
   } else {
      error("Form data are missing or empty !");
      res.status(400).json({ success: false });
   }
});
router.get("/logout",  (req :Request, res :Response) => {
   req.session.destroy(() => {
      res.redirect("/");
   });
});
router.get("/logged",  (req :Request, res :Response) => {
   res.send(req.session);
});

//===========//========>> PAGES RENDERING <<============//===========//

router.get("/admin(.html)?", renderTemplate("admin", "Administration"));

router.get("^/$|/index(.html)?", renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/about(.html)?", renderTemplate("about", "A propos"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));
router.get("/activities(.html)?", renderTemplate("activities", "Acitivités"));
router.get("/*", renderTemplate("404", "Page introuvable"));

function renderTemplate(page :string, title :string) {
   return (req :Request, res :Response) => {
      res.render(`${page}`, {
         stylesheet: `${page}.css`,
         script: `${page}.js`,
         title: title,
         logged: req.session.authenticated
      });  
   }
}
function authentify(req :Request, res :Response, next :NextFunction) {
   if (req.session.authenticated) {
      log("You're logged in");
      next();
   }
   else res.status(403).end();
}

function formattedDate() {
   const now = new Date(Date.now());
   const formatted = 
   ('0'+ now.getDate()).slice(-2) + '-' +
   ('0'+ (now.getMonth()+1)).slice(-2) + '-' +  now.getFullYear();

   return formatted;
}

export { router };

