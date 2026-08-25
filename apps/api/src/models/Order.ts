import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentMethod = 'STRIPE' | 'PAYPAL' | 'RAZORPAY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED';

export interface IOrder extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    instructorId: Types.ObjectId;
    orderId: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    transactionId?: string;
    receiptUrl?: string;
}

const orderSchema = new Schema<IOrder>(
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
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Instructor ID is required'],
        },
        orderId: {
            type: String,
            required: [true, 'Order ID is required'],
            unique: true,
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
            enum: ['STRIPE', 'PAYPAL', 'RAZORPAY'],
            required: [true, 'Payment method is required'],
        },
        paymentStatus: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            default: 'PENDING',
        },
        orderStatus: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED'],
            default: 'PENDING',
        },
        transactionId: {
            type: String,
        },
        receiptUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
