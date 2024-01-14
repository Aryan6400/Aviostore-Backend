import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    rate: Number,
}, {timestamps:true})


const Review = mongoose.model("Review", reviewSchema);

export { Review };