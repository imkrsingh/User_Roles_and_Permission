import mongoose, { Schema, Document, model } from 'mongoose';

// Define the schema for the user data
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [30, 'Name must be at most 30 characters'],
            match: [/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v: string): boolean {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: (props: { value: string }) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'hr', 'superadmin'],
            default: 'user',
            trim: true,
        },
    },
    { timestamps: true }
);

const userModel = model<IUser>('User', userSchema);

export { userModel };
