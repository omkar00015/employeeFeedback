import Mongoose from "mongoose";

const AssignmentSchema = new Mongoose.Schema({
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

const Assignment = Mongoose.model('Assignment', AssignmentSchema);
export default Assignment;