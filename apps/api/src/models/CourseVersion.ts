import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourseVersion extends Document {
    courseId: Types.ObjectId;
    versionNumber: number;
    changes: string[];
    createdBy: Types.ObjectId;
    isActive: boolean;
}

const courseVersionSchema = new Schema<ICourseVersion>(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        versionNumber: {
            type: Number,
            required: [true, 'Version number is required'],
        },
        changes: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Created by is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const CourseVersion = mongoose.model<ICourseVersion>('CourseVersion', courseVersionSchema);
export default CourseVersion;
