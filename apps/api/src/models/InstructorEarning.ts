import mongoose, { Document, Schema, Types } from 'mongoose';

export type PayoutStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface IInstructorEarning extends Document {
    instructorId: Types.ObjectId;
    orderId: Types.ObjectId;
    courseId: Types.ObjectId;
    amount: number;
    currency: string;
    payoutStatus: PayoutStatus;
    payoutDate?: Date;
    transactionId?: string;
}

const instructorEarningSchema = new Schema<IInstructorEarning>(
    {
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Instructor ID is required'],
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Order ID is required'],
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        currency: {
            type: String,
            default: 'USD',
        },
        payoutStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
            default: 'PENDING',
        },
        payoutDate: {
            type: Date,
        },
        transactionId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const InstructorEarning = mongoose.model<IInstructorEarning>('InstructorEarning', instructorEarningSchema);
export default InstructorEarning;
