import Mongoose from "mongoose";

const reviewSchema = new Mongoose.Schema({
    employee: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, { timestamps: true });   

const Review = Mongoose.model('Review', reviewSchema);
export default Review;
