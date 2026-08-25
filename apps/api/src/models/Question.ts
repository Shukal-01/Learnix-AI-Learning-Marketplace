import mongoose, { Document, Schema, Types } from 'mongoose';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'CODE' | 'MULTIPLE_ANSWERS';

export interface IQuestion extends Document {
    testId: Types.ObjectId;
    questionText: string;
    questionType: QuestionType;
    options?: string[];
    correctAnswer: string | string[];
    points: number;
    explanation?: string;
    order: number;
}

const questionSchema = new Schema<IQuestion>(
    {
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: [true, 'Test ID is required'],
        },
        questionText: {
            type: String,
            required: [true, 'Question text is required'],
            trim: true,
        },
        questionType: {
            type: String,
            enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'CODE', 'MULTIPLE_ANSWERS'],
            default: 'MULTIPLE_CHOICE',
        },
        options: {
            type: [String],
            default: [],
        },
        correctAnswer: {
            type: Schema.Types.Mixed,
            required: [true, 'Correct answer is required'],
        },
        points: {
            type: Number,
            default: 1,
            min: [1, 'Points must be at least 1'],
        },
        explanation: {
            type: String,
            trim: true,
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

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;
