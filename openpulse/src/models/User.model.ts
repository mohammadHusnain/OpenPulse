import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema<Message>({
    content: { 
        type: String,
        required: true 
    },
    createdAt: { 
        type: Date,
        required: true, 
        default: Date.now 
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema<User>({
    username: { 
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },

    email:{
        type:String,
        required:[true,'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },

    password: { 
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },

    verifyCode: {
        type: String,
        required: [true, 'Verification code is required'],
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verification code expiry is required'],
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },

    messages: [MessageSchema],
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);

export default userModel;