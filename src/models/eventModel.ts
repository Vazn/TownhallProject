import mongoose from "mongoose";

const schema = new mongoose.Schema({
   title: String,
   description: String,
   startDate: Date,
   endDate: Date,
});

//== NOTE: Link the schma to the DB collection
const Event = mongoose.model("events", schema);

export { Event }