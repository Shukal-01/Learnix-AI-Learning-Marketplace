import mongoose, { Document, Schema, Types } from 'mongoose';

export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    description: string;
    referenceId: string;
    metadata?: mongoose.Document;
}

const transactionSchema = new Schema<ITransaction>(
    {
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
        transactionType: {
            type: String,
            enum: ['CREDIT', 'DEBIT'],
            required: [true, 'Transaction type is required'],
        },
        transactionStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        referenceId: {
            type: String,
            required: [true, 'Reference ID is required'],
            unique: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
