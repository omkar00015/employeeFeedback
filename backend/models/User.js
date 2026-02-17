import Mangoose from "mongoose";

const userSchema = new Mangoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],   
        required: true
    }
}, { timestamps: true });

const User = Mangoose.model('User', userSchema);
export default User;