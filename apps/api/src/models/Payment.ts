import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface IPayment extends Document {
    orderId: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    transactionId: string;
    receiptUrl?: string;
    metadata?: mongoose.Document;
}

const paymentSchema = new Schema<IPayment>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Order ID is required'],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
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
        paymentMethod: {
            type: String,
            required: [true, 'Payment method is required'],
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        transactionId: {
            type: String,
            required: [true, 'Transaction ID is required'],
            unique: true,
        },
        receiptUrl: {
            type: String,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
