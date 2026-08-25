import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILearnerProfile extends Document {
    userId: Types.ObjectId;
    learningPreferences: {
        language: string;
        difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
        categories: Types.ObjectId[];
    };
    currentStreak: number;
    longestStreak: number;
    totalLearningTime: number;
    coursesCompleted: number;
    certificates: { courseId: Types.ObjectId; issuedAt: Date; certificateId: string }[];
}

const learnerProfileSchema = new Schema<ILearnerProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        learningPreferences: {
            language: { type: String, default: 'en' },
            difficultyLevel: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
            categories: { type: [Schema.Types.ObjectId], ref: 'Category', default: [] },
        },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        totalLearningTime: { type: Number, default: 0 },
        coursesCompleted: { type: Number, default: 0 },
        certificates: {
            type: [
                {
                    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
                    issuedAt: { type: Date, default: Date.now },
                    certificateId: { type: String, required: true, unique: true },
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const LearnerProfile = mongoose.model<ILearnerProfile>('LearnerProfile', learnerProfileSchema);
export default LearnerProfile;
