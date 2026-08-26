import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { AuthRequest } from '../middlewares/auth.js';

export const getEnrollments = async (req: AuthRequest, res: Response) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id })
            .populate('courseId', 'title slug thumbnail price isFree instructorId')
            .sort({ enrolledAt: -1 });
        res.status(200).json({ success: true, enrollments });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getEnrollmentById = async (req: AuthRequest, res: Response) => {
    try {
        const enrollment = await Enrollment.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('courseId');
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        res.status(200).json({ success: true, enrollment });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createEnrollment = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const existingEnrollment = await Enrollment.findOne({
            userId: req.user._id,
            courseId,
        });
        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        const enrollment = await Enrollment.create({
            userId: req.user._id,
            courseId,
        });
        res.status(201).json({ success: true, enrollment });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteEnrollment = async (req: AuthRequest, res: Response) => {
    try {
        const enrollment = await Enrollment.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
