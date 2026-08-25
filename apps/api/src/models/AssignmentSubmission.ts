import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAssignmentSubmission extends Document {
    userId: Types.ObjectId;
    assignmentId: Types.ObjectId;
    courseId: Types.ObjectId;
    submissionText?: string;
    attachmentUrl?: string;
    score?: number;
    feedback?: string;
    status: 'SUBMITTED' | 'GRADED' | 'LATE';
    submittedAt: Date;
    gradedAt?: Date;
}

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        assignmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Assignment',
            required: [true, 'Assignment ID is required'],
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        submissionText: {
            type: String,
            trim: true,
        },
        attachmentUrl: {
            type: String,
            trim: true,
        },
        score: {
            type: Number,
            min: [0, 'Score cannot be negative'],
        },
        feedback: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['SUBMITTED', 'GRADED', 'LATE'],
            default: 'SUBMITTED',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        gradedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const AssignmentSubmission = mongoose.model<IAssignmentSubmission>(
    'AssignmentSubmission',
    assignmentSubmissionSchema
);
export default AssignmentSubmission;
