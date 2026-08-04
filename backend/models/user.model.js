import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        default: null
    },
    username: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [150, 'Bio must not be longer than 150 characters'],
        default: ''
    },
    profilePhoto: {
        type: String,
        default: null
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [ 6, 'Email must be at least 6 characters long' ],
        maxLength: [ 50, 'Email must not be longer than 50 characters' ]
    },
    password: {
        type: String,
        select: false,
    },
    starredProjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project'
        }
    ]
})


userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}


const User = mongoose.model('user', userSchema);

export default User;