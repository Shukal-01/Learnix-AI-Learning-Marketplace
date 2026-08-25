import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISection extends Document {
    title: string;
    description?: string;
    courseId: Types.ObjectId;
    order: number;
}

const sectionSchema = new Schema<ISection>(
    {
        title: {
            type: String,
            required: [true, 'Section title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course ID is required'],
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Section = mongoose.model<ISection>('Section', sectionSchema);
export default Section;
