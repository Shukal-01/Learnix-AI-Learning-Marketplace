import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description: string;
    courseId: Types.ObjectId;
    sectionId: Types.ObjectId;
    maxScore: number;
    dueDate?: Date;
    isPublished: boolean;
    order: number;
}

const assignmentSchema = new Schema<IAssignment>(
    {
        title: {
            type: String,
            required: [true, 'Assignment title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Assignment description is required'],
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
        maxScore: {
            type: Number,
            default: 100,
            min: [1, 'Max score must be at least 1'],
        },
        dueDate: {
            type: Date,
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

const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
export default Assignment;
