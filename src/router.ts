import { Request, Response, NextFunction } from 'express';
import express from "express";
import multer from "multer";
import argon from "argon2";

import { __dirname, getDate, formatTitles, log, error } from "./helpers.js";
import { CustomRequest, CustomResponse } from "./types.js";
import { User, Article, Event } from "./models/index.js";


const router = express.Router();
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      const root :string = __dirname + "/public/uploads"
      if (file.mimetype.includes("image")) {
         const path = root + "/images";
         callback(null, path);
      }
      if (file.mimetype.includes("video")) callback(null, root + "/videos");
      if (file.mimetype.includes("application")) callback(null, root + "/documents");
   },
   filename: (req, file, callback) => {
      const formattedName = getDate() + "-" + file.originalname;
      callback(null, `${formattedName}`);
   }
});
const upload = multer({
   storage: storage,
});
//===========//==========>> ADMIN ROUTES <<=============//===========//

router.get("/deleteArticle/:title", authentify, async (req, res) => {
   await Article.deleteOne({title: req.params.title});
   res.json({ success: true });
});
router.post("/articleUpdate/:category", upload.any(), authentify, async (req, res) => {
   const title = formatTitles(req.body.title);
   const content = req.body.content;
   const result = await Article.findOne({title: title});

   const imagePaths :Array<string> = [];
   const docPaths :Array<string> = []; 
   let thumbnail :string;

   if (req.files !== undefined) {
      for (let i=0 ; i<req.files.length ; i++) {
         if (req.files[i].fieldname === "documents") {
            docPaths.push(req.files[i].filename);
         } else if (req.files[i].fieldname === "images") {
            imagePaths.push(req.files[i].filename);
         } else if (req.files[i].fieldname === "thumbnail") {
            thumbnail = req.files[i].filename;
         }
      }
   }

   if (result === null) {
      try {
         await Article.create({
            title: title,
            content: content,
            images: {
               empty: imagePaths.length === 0,
               imagesPaths: imagePaths,
            },
            documents: {
               empty: docPaths.length === 0,
               docPaths: docPaths,
            },
            thumbnail: thumbnail,
            category: req.params.category,
         });    
         res.json({ 
            type: "Creation",
            success: true, 
         });
      } catch (e) {
         res.json({ 
            type: "Creation",
            success: false, 
         });        
      }
   } else {
      try {
         await Article.updateOne({title: title}, {
            $set: {
               content: content,
               images: {
                  empty: imagePaths.length === 0,
                  imagesPaths: imagePaths,
               },
               documents: {
                  empty: docPaths.length === 0,
                  docPaths: docPaths,
               },
               thumbnail: thumbnail,
            }
         });
         res.json({ 
            type: "Modification",
            success: true 
         }); 
      } catch (e) {
         res.json({ 
            type: "Modification",
            success: false, 
         });       
      }
   }
});
router.post("/eventCreate", authentify, async (req, res) => {
   const { type, description, start, end } = req.body;
   console.log("start : ", start)
   const title = formatTitles(req.body.title);
   const result = await Event.findOne({title: title});

   if (result === null) {
      try {
         await Event.create({
            title: title,
            type: type,
            description: description,
            start: start,
            end: end,
         });    
         res.json({ success: true });
      } catch (e) {
         console.log("e : ", e)
         res.json({ success: false });
      }
   } else {
      try {
         await Event.updateOne({title: title}, {
            $set: {
               title: title,
               type: type,
               description: description,
               start: start,
               end: end,
            }
         });
         res.json({ 
            type: "Modification",
            success: true 
         }); 
      } catch (e) {
         res.json({ 
            type: "Modification",
            success: false, 
         });       
      }
   }
});

router.get("/deleteEvent/:title",  authentify, async (req, res) => {
   await Event.deleteOne({title: req.params.title});
   res.json({ success: true });
});

router.get("/getEvents",  async (req :Request, res :Response) => {
   const data = await Event.find({}).lean();
   res.json(data);
});


//===========//=========>>  USER ROUTES <<===============//===========//

router.post("/registerUser", async (req :Request, res :Response) => { 
   try {
      const data :Object = await User.create({
         email: req.body.email,
         password: req.body.password,
      });
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


//===========//========>> PAGES RENDERING <<============//===========//

router.get("^/$|/index(.html)?", getData(["actualites", "informations"], 8), renderTemplate("index", "Commune de Rouffiac d'Aude"));
router.get("/actualites(.html)?", getData(["actualites"], 0), renderTemplate("actualites", "Actualités"));

router.get("/calendrier(.html)?", renderTemplate("calendrier", "Agenda et activités"));

//---- Au quotidien -------//
router.get("/ecole(.html)?", getData(["ecole"], 0), renderTemplate("articlesLayout", "Ecole"));
router.get("/associations(.html)?", getData(["associations"], 0), renderTemplate("articlesLayout", "Associations"));
router.get("/mediatheque(.html)?", getData(["mediatheque"], 0), renderTemplate("articlesLayout", "Médiatheque"));
router.get("/transport(.html)?", getData(["transport"], 0), renderTemplate("articlesLayout", "Transports"));
router.get("/entreprises(.html)?", getData(["entreprises"], 0),renderTemplate("articlesLayout", "Entreprises"));

//---- Vos démarches -------//
router.get("/urbanisme(.html)?",  getData(["urbanisme"], 0), renderTemplate("articlesLayout", "Urbanisme"));
router.get("/etatCivil(.html)?", getData(["etatCivil"], 0), renderTemplate("articlesLayout", "Etat Civil"));
router.get("/scolarite(.html)?", getData(["scolarite"], 0),renderTemplate("articlesLayout", "Scolarité"));
router.get("/risques(.html)?", getData(["risques"], 0), renderTemplate("articlesLayout", "Risques"));

//---- La municipalité -------//
router.get("/leVillage(.html)?", getData(["leVillage"], 0),renderTemplate("articlesLayout", "Le village"));
router.get("/lesElus(.html)?", getData(["lesElus"], 0),renderTemplate("articlesLayout", "Les Elus"));
router.get("/lesCommissions(.html)?", getData(["]lesCommissions"], 0),renderTemplate("articlesLayout", "Les Commissions"));


router.get("/login(.html)?", renderTemplate("login", "Connexion"));
router.get("/legal(.html)?", renderTemplate("legal", "Mentions légales"));

// Like this, it's called on EVERY url, todo //
// router.get("/*", renderTemplate("404", "Page introuvable"));

function renderTemplate(page :string, title :string) {
   return (req :CustomRequest, res :Response) => {
      let inputData :Object = req.data ?? null;      

      res.render(`${page}`, {
         page: page,
         title: title,
         logged: req.session.authenticated,
         data: inputData,
      });  
   }
}
function getData(categoryList :Array<string>, limit :number) {
   return async (req :CustomRequest, res, next) => {
      const dataList :Object = {};
      for (let category of categoryList) {
         const data :any[] = await Article.find({ category: category}).limit(limit).lean();
         for (let obj of data) {
            obj.title = obj.title.replace(/_/g,' ')         
         }
         if (categoryList.length === 1) {
            dataList["main"] = data;
         } else {
            dataList[category] = data;
         }
      }    
      req.data = dataList;
      next();
   }
}
function authentify(req :Request, res :Response, next :NextFunction) {
   if (req.session.authenticated) {
      log("Authentication : OK");
      next();
   }
   else{
      error("Acces denied");
      res.status(403).end();
   } 
}

export { router };

