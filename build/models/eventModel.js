import mongoose from "mongoose";
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "Once",
    },
    description: {
        type: String,
        default: "",
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
});
const Event = mongoose.model("events", schema);
export { Event };
