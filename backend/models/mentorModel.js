import mongoose from 'mongoose';
import Auth from './authModel.js';
const mentorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    skills: [{
        type: String
    }],
    availableSlots: [{
        date: { type: Date },
        time: { type: String }
    }],
    payments: [{
        amount: { type: Number },
        date: { type: Date },
        status: { type: String }
    }],

    profileImage : {
        type: String,
    },
    bio: {
        type: String,
        required: true
    },
    fee :{
        type : String,
        required : true

    }
   
}, { timestamps: true } );

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
//helper