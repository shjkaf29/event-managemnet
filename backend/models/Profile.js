import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    department: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Profile', profileSchema);