import mongoose from "mongoose";

const schema = new mongoose.Schema({
   email: String,
   password: String 
});

//== NOTE: Link the schma to the DB collection
const User = mongoose.model("users", schema);

export { User }