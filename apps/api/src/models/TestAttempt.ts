import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITestAttempt extends Document {
    userId: Types.ObjectId;
    testId: Types.ObjectId;
    courseId: Types.ObjectId;
    answers: {
        questionId: Types.ObjectId;
        selectedAnswer: string | string[];
    }[];
    score: number;
    totalPoints: number;
    percentage: number;
    status: 'PASSED' | 'FAILED' | 'IN_PROGRESS';
    startedAt: Date;
    completedAt?: Date;
}

const testAttemptSchema = new Schema<ITestAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: [true, 'Test ID is required'],
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        answers: {
            type: [
                {
                    questionId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Question',
                        required: true,
                    },
                    selectedAnswer: {
                        type: Schema.Types.Mixed,
                        required: true,
                    },
                },
            ],
            default: [],
        },
        score: {
            type: Number,
            default: 0,
            min: [0, 'Score cannot be negative'],
        },
        totalPoints: {
            type: Number,
            default: 0,
            min: [0, 'Total points cannot be negative'],
        },
        percentage: {
            type: Number,
            default: 0,
            min: [0, 'Percentage cannot be negative'],
            max: [100, 'Percentage cannot exceed 100'],
        },
        status: {
            type: String,
            enum: ['PASSED', 'FAILED', 'IN_PROGRESS'],
            default: 'IN_PROGRESS',
        },
        startedAt: {
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

const TestAttempt = mongoose.model<ITestAttempt>('TestAttempt', testAttemptSchema);
export default TestAttempt;
