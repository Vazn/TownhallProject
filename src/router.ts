import express from "express";
export { router };

const router = express.Router();


router.get("^/$|/index(.html)?", (request, response) => {
   response.sendFile("./views/index.html", { root: "./" });
});
router.get("/login(.html)?", (request, response) => {
   response.sendFile("./views/login.html", { root: "./" });
});
router.get("/*", (request, response) => {
   response.status(404).sendFile("./views/404.html", { root: "./" });
});

router.post("/fetchTest", (request, response) => {
   response.json({
      attribut1: 1,
      attribut2: "blaaaa",
   });
});


router.post("/login", (request, response) => {
   const { login, password } = request.body;

   if (login && password) {
      if (request.session.authenticated) {
         response.json(request.session);
      } else {

         if (password === "123") {
            request.session.authenticated = true;
            request.session.user = {
               pseudo: login,
               password: password,
            }
            response.status(200).json(request.session);
         } else {
            response.status(403).json({ msg: `Bad credentials` });
         }
      }
   } else {
      response.status(403).json({ msg: `Bad credentials` });
   }
});

