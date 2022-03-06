import mongoose from "mongoose";

const schema = new mongoose.Schema({
   title: String,
   content: String,
   imagePath: String,
   postDate: Date,

   startDate: Date,
   endDate: Date,
});

//== NOTE: Link the schma to the DB collection
const Event = mongoose.model("events", schema);

export { Event }