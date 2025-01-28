import mongoose, { Schema, Document, model } from 'mongoose';

// Define the schema for the user data
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

//// Define permissions for each role
const rolePermissions: { [key: string]: string[] } = {
    superadmin: ["create_record", "read_record", "update_record", "delete_record"], // superadmin has full access
    admin: ["create_record", "read_record", "update_record", "delete_record"], // admin has full access
    hr: ["create_record", "read_record", "update_record"], // hr can create, read, and update
    user: ["create_record", "read_record"], // user can create and read
};

// Function to assign permissions based on role
const assignPermissions = (role: string): string[] => {
    return rolePermissions[role] || [];
};

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
            required: true,
        },
        //Assign permissions 
        permissions: {
            type: [String],
            default: function() {
                return assignPermissions(this.role); // Assign permissions based on the role
            },
        },
    },
    { timestamps: true }
);

const userModel = model<IUser>('User', userSchema);

export { userModel };
