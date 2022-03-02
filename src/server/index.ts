import HTTP from 'http';
import EventEmitter from 'events';
import express from 'express';

const app = express();
const port = 666;

app.get("/", (request, response) => {
   console.log("Bienvenue sur la page d'acceuil");
   response.end();
});
app.get("/login", (request, response) => {
   console.log("Bienvenue sur la page login");
   response.end();
});

app.listen(666, () => {
   console.log(`Server running on port ${port} ...`);
})

