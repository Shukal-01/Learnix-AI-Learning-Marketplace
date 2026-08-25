import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISectionProgress extends Document {
    userId: Types.ObjectId;
    sectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    isCompleted: boolean;
    lessonsCompleted: number;
    totalLessons: number;
}

const sectionProgressSchema = new Schema<ISectionProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        sectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Section',
            required: [true, 'Section ID is required'],
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
        lessonsCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Lessons completed cannot be negative'],
        },
        totalLessons: {
            type: Number,
            default: 0,
            min: [0, 'Total lessons cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

const SectionProgress = mongoose.model<ISectionProgress>('SectionProgress', sectionProgressSchema);
export default SectionProgress;
