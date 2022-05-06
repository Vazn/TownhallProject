import mongoose from "mongoose";
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "defaultThumbnail.svg",
    },
    images: {
        empty: {
            type: Boolean,
            default: true,
        },
        imagesPaths: {
            type: [String]
        },
    },
    documents: {
        empty: {
            type: Boolean,
            default: true,
        },
        docPaths: {
            type: [String]
        },
    },
    postDate: {
        type: Date,
        default: () => new Date()
    }
});
const Article = mongoose.model("articles", schema);
export { Article };
