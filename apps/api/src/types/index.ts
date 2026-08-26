import { Request } from 'express';
import { JwtPayload as JwtPayloadType } from 'jsonwebtoken';

export interface JwtPayload extends JwtPayloadType {
    id: string;
}

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: { field: string; message: string }[];
}
