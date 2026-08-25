import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPlatformFee extends Document {
    orderId: Types.ObjectId;
    amount: number;
    currency: string;
    feePercentage: number;
    description: string;
}

const platformFeeSchema = new Schema<IPlatformFee>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Order ID is required'],
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
        feePercentage: {
            type: Number,
            required: [true, 'Fee percentage is required'],
            min: [0, 'Fee percentage cannot be negative'],
            max: [100, 'Fee percentage cannot exceed 100'],
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const PlatformFee = mongoose.model<IPlatformFee>('PlatformFee', platformFeeSchema);
export default PlatformFee;
