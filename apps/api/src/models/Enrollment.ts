import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEnrollment extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    progress: number; // percentage (0-100)
    status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
    enrolledAt: Date;
    completedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        progress: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100'],
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'COMPLETED', 'DROPPED'],
            default: 'ACTIVE',
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
export default Enrollment;
