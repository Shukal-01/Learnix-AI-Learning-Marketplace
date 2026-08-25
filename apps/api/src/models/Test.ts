import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITest extends Document {
    title: string;
    description?: string;
    courseId: Types.ObjectId;
    sectionId: Types.ObjectId;
    passingScore: number; // percentage (0-100)
    timeLimit: number; // in minutes
    isPublished: boolean;
    order: number;
}

const testSchema = new Schema<ITest>(
    {
        title: {
            type: String,
            required: [true, 'Test title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: [true, 'Section ID is required'],
        },
        passingScore: {
            type: Number,
            default: 60,
            min: [0, 'Passing score cannot be negative'],
            max: [100, 'Passing score cannot exceed 100'],
        },
        timeLimit: {
            type: Number,
            default: 30,
            min: [1, 'Time limit must be at least 1 minute'],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Test = mongoose.model<ITest>('Test', testSchema);
export default Test;
