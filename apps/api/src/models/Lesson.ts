import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILesson extends Document {
    title: string;
    description?: string;
    videoUrl?: string;
    duration: number; // in seconds
    isFree: boolean;
    content?: string;
    sectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    order: number;
}

const lessonSchema = new Schema<ILesson>(
    {
        title: {
            type: String,
            required: [true, 'Lesson title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        videoUrl: {
            type: String,
            trim: true,
        },
        duration: {
            type: Number,
            default: 0,
            min: [0, 'Duration cannot be negative'],
        },
        isFree: {
            type: Boolean,
            default: false,
        },
        content: {
            type: String,
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
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
export default Lesson;
