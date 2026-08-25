import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';
    avatar?: string;
    bio?: string;
    isVerified: boolean;
    isActive: boolean;
    verifyToken?: string;
    verifyTokenExpires?: Date;
    resetToken?: string;
    resetTokenExpires?: Date;
    refreshToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['LEARNER', 'INSTRUCTOR', 'ADMIN'],
            default: 'LEARNER',
        },
        avatar: { type: String, trim: true },
        bio: { type: String, trim: true, maxlength: [500, 'Bio cannot exceed 500 characters'] },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        verifyToken: { type: String },
        verifyTokenExpires: { type: Date },
        resetToken: { type: String },
        resetTokenExpires: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
