import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInstructorProfile extends Document {
    userId: Types.ObjectId;
    bio: string;
    qualifications: string[];
    socialLinks: { website?: string; linkedin?: string; twitter?: string; youtube?: string };
    totalStudents: number;
    totalCourses: number;
    totalEarnings: number;
    averageRating: number;
    isFeatured: boolean;
}

const instructorProfileSchema = new Schema<IInstructorProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        bio: { type: String, trim: true, maxlength: [1000, 'Bio cannot exceed 1000 characters'] },
        qualifications: { type: [String], default: [] },
        socialLinks: {
            website: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            twitter: { type: String, trim: true },
            youtube: { type: String, trim: true },
        },
        totalStudents: { type: Number, default: 0 },
        totalCourses: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0, min: [0, 'Rating cannot be negative'], max: [5, 'Rating cannot exceed 5'] },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const InstructorProfile = mongoose.model<IInstructorProfile>('InstructorProfile', instructorProfileSchema);
export default InstructorProfile;
