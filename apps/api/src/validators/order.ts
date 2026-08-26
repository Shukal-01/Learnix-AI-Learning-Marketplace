import { z } from 'zod';

// Create order validator
export const createOrderSchema = z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    paymentMethod: z.enum(['STRIPE', 'PAYPAL', 'RAZORPAY']).default('STRIPE'),
});
