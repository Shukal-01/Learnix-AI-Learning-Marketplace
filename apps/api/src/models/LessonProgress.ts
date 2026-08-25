import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILessonProgress extends Document {
    userId: Types.ObjectId;
    lessonId: Types.ObjectId;
    courseId: Types.ObjectId;
    isCompleted: boolean;
    progress: number; // percentage (0-100)
    lastWatchedAt?: Date;
    notes?: string;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: [true, 'Lesson ID is required'],
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        progress: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100'],
        },
        lastWatchedAt: {
            type: Date,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const LessonProgress = mongoose.model<ILessonProgress>('LessonProgress', lessonProgressSchema);
export default LessonProgress;
