import{port as e,corsOptions as o}from"./config/config.js";import{__dirname as r}from"./helpers.js";import{router as s}from"./router.js";import i from"express";import t from"express-session";import n from"cors";const m=i(),p=new t.MemoryStore;m.use(t({secret:"WTF IS THAT",cookie:{maxAge:3e4},saveUninitialized:!1,resave:!1,store:p})),m.use(i.json()),m.use(i.urlencoded({extended:!0})),m.use(n(o)),m.use("/public",i.static(r+"/public")),m.use("/",s),m.listen(e,(()=>{console.log(`Server running on port ${e} ...`)}));