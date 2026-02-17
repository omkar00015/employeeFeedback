import Mongoose from "mongoose";

const feedbackSchema = new Mongoose.Schema({
    review: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
    reviewer: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reting: {
        type: Number,
        min: 1,
        max: 5   
    },
    comments: {
        type: String,
    },
}, { timestamps: true });

const Feedback = Mongoose.model('Feedback', feedbackSchema);
export default Feedback;