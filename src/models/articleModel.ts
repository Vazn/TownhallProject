import mongoose from "mongoose";
import { getDate } from "../helpers.js";

const schema = new mongoose.Schema({
   title: {
      type: String,
      required: true 
   },
   content: {
      type: String,
      required: true 
   },
   imagePaths: [String],
   postDate: {
      type: Date,
      default: () => getDate()
   }
});

//== NOTE: Link the schma to the DB collection
const Article = mongoose.model("articles", schema);

export { Article }