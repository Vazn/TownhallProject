import mongoose from "mongoose";
import { connect } from "../helpers.js";

connect();

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});