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
    isSubmitted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Feedback = Mongoose.model('Feedback', feedbackSchema);
export default Feedback;