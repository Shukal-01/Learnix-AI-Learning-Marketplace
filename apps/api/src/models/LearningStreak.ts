import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILearningStreak extends Document {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date;
}

const learningStreakSchema = new Schema<ILearningStreak>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            unique: true,
        },
        currentStreak: {
            type: Number,
            default: 0,
            min: [0, 'Current streak cannot be negative'],
        },
        longestStreak: {
            type: Number,
            default: 0,
            min: [0, 'Longest streak cannot be negative'],
        },
        lastActivityDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const LearningStreak = mongoose.model<ILearningStreak>('LearningStreak', learningStreakSchema);
export default LearningStreak;
