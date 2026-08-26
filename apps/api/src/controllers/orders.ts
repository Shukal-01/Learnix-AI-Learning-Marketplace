import { Request, Response } from 'express';
import Order from '../models/Order.js';
import Course from '../models/Course.js';
import { AuthRequest } from '../middlewares/auth.js';
import { createOrderSchema } from '../validators/order.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('courseId', 'title slug thumbnail price')
            .populate('instructorId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })
            .populate('courseId')
            .populate('instructorId');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, order });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, paymentMethod } = createOrderSchema.parse(req.body);

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        if (course.isFree) {
            return res.status(400).json({
                success: false,
                message: 'This course is free. Use enrollment instead.',
            });
        }

        // Handle payment provider
        if (paymentMethod === 'STRIPE') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],

                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: course.title,
                            },
                            unit_amount: Math.round(course.price * 100),
                        },
                        quantity: 1,
                    },
                ],

                mode: 'payment',

                success_url: `${process.env.FRONTEND_URL}/payment/success/{CHECKOUT_SESSION_ID}`,

                cancel_url: `${process.env.FRONTEND_URL}/payment/failed/{CHECKOUT_SESSION_ID}`,

                metadata: {
                    courseId: course._id.toString(),
                    userId: req.user._id.toString(),
                    instructorId: course.instructorId.toString(),
                },
            });

            return res.status(201).json({
                success: true,
                paymentMethod: 'STRIPE',
                url: session.url,
            });
        }

        if (paymentMethod === 'PAYPAL') {
            // PayPal order creation here
            return res.status(501).json({
                success: false,
                message: 'PayPal payment is not implemented yet',
            });
        }

        if (paymentMethod === 'RAZORPAY') {
            // Razorpay order creation here
            return res.status(501).json({
                success: false,
                message: 'Razorpay payment is not implemented yet',
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Invalid payment method',
        });

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, instructorId: req.user._id },
            { orderStatus: status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
        }
        res.status(200).json({ success: true, order });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
