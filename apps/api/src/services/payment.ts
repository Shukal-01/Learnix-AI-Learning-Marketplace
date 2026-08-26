import Stripe from 'stripe';
import Order from '../models/Order.js';
import Course from '../models/Course.js';
import PlatformFee from '../models/PlatformFee.js';
import InstructorEarning from '../models/InstructorEarning.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

const PLATFORM_FEE_PERCENTAGE = 10; // 10% platform fee

export const processStripeWebhook = async (req: any, res: any) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session: any = event.data.object;
        const { courseId, userId, instructorId } = session.metadata;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const amount = Math.round(course.price * 100);
        const platformFeeAmount = Math.round((amount * PLATFORM_FEE_PERCENTAGE) / 100);
        const instructorEarningAmount = amount - platformFeeAmount;

        const order = await Order.create({
            userId,
            courseId,
            instructorId,
            orderId: session.id,
            amount: course.price,
            currency: session.currency,
            paymentMethod: session.payment_method_types[0].toUpperCase(),
            paymentStatus: 'COMPLETED',
            orderStatus: 'CONFIRMED',
            transactionId: session.payment_intent,
            receiptUrl: session.invoice,
        });

        await PlatformFee.create({
            orderId: order._id,
            amount: platformFeeAmount / 100,
            currency: session.currency,
            feePercentage: PLATFORM_FEE_PERCENTAGE,
            description: `Platform fee for order ${order._id}`,
        });

        await InstructorEarning.create({
            instructorId,
            orderId: order._id,
            courseId,
            amount: instructorEarningAmount / 100,
            currency: session.currency,
            payoutStatus: 'PENDING',
        });
    }

    res.json({ received: true });
};
