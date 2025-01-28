import { Request, Response } from 'express';
import { userModel } from '../models/userSchema';
import { handleTokenVerification } from '../helper/jwt';
import bcrypt from 'bcryptjs';

///////// Get(me) api for user, admin, superadmin and hr ///////// 
//////////////////////////////////////////////////////
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['superadmin', 'admin', 'hr', 'user']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        const user = await userModel.findOne({ name: decoded.name }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        //update
        // Check if the user has permission to access certain data
        if (!user.permissions.includes("read_record")) {
            res.status(403).json({ message: "You don't have permission to read records." });
            return;
        }

        res.status(200).json({
            message: 'User details fetched successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

///////// Get api for superadmin /////////
/////////////////////////////////////////

export const getSuperAdminDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['superadmin']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        //update
        // Ensure the logged-in user is superadmin
        if (decoded.role !== 'superadmin') {
            res.status(403).json({ message: 'You do not have permission to view SuperAdmin details' });
            return;
        }

        const user = await userModel.findOne({ name: decoded.name }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'SuperAdmin details fetched successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

///////// Get api for admin ///////// 
////////////////////////////////////

export const getAdminDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['admin', 'superadmin']); //update 'superadmin'
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        //update
        // Ensure the logged-in user is admin or superadmin
        if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
            res.status(403).json({ message: 'You do not have permission to view Admin details' });
            return;
        }

        const user = await userModel.findOne({ name: decoded.name }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Admin details fetched successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//////// Get api for Hr ////////////
////////////////////////////////////

export const getHrDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['hr', 'admin', 'superadmin']); // update 'admin', 'superadmin'
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        //update
        // Ensure the logged-in user is hr, admin, or superadmin
        if (decoded.role !== 'hr' && decoded.role !== 'admin' && decoded.role !== 'superadmin') {
            res.status(403).json({ message: 'You do not have permission to view HR details' });
            return;
        }

        const user = await userModel.findOne({ name: decoded.name }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'HR details fetched successfully',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

///////////////////
////// PUT ///////
//////////////////
// Update user details (for user, admin, hr, superadmin)

export const putUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['superadmin', 'admin', 'hr', 'user']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        const { userId } = req.params; // Get userId from URL params
        const { name, email, password, role } = req.body;

        // Find the user to update
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Only superadmins, admins, and hr can update user details (but role update is allowed for superadmins, admins, and hr)
        if (decoded.name !== user.name && (decoded.role !== 'superadmin' && decoded.role !== 'admin' && decoded.role !== 'hr')) {
            res.status(403).json({ message: 'You are not allowed to update this user\'s data' });
            return;
        }

        //update | email updates only admin & superadmin
        if (email) {
            if (decoded.role !== 'superadmin' && decoded.role !== 'admin') {
                res.status(403).json({ message: 'Only admins/superadmins can update email' });
                return;
            }
        }

        // Update user data
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            // Hash the new password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the saltRounds for bcrypt
            user.password = hashedPassword;
        }

        // Allow superadmin to update role
        if (role && (decoded.role === 'superadmin')) {
            user.role = role;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'User details updated successfully',
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


/////////////////////
/////// Delete //////
////////////////////
// Delete user based on userId
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        // Verify the token and decode the user info
        const { decoded, error } = handleTokenVerification(token, ['superadmin']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        const { userId } = req.params;  // Get userId from URL params

        // Find the user to delete
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Only superadmins are allowed to delete other users
        if (decoded.role !== 'superadmin') {
            res.status(403).json({ message: 'You do not have permission to delete users' });
            return;
        }

        // Delete the user using findByIdAndDelete()
        await userModel.findByIdAndDelete(userId);

        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


/////////////////////
/////// GetAll //////
////////////////////

// Get All user profiles based on role permissions
export const getAllUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['superadmin', 'admin', 'hr', 'user']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
            return;
        }

        // Check the role of the logged-in user and fetch appropriate data
        if (decoded.role === 'superadmin') {
            // Superadmin can view all profiles
            const users = await userModel.find().select('-password');
            res.status(200).json({
                message: 'All user details fetched successfully',
                users: users.map((user) => ({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                })),
            });
        } else if (decoded.role === 'admin') {
            // Admin can view HR and User profiles
            const users = await userModel.find({ role: { $in: ['hr', 'user'] } }).select('-password');
            res.status(200).json({
                message: 'Admin and HR details fetched successfully',
                users: users.map((user) => ({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                })),
            });
        } else if (decoded.role === 'hr') {
            // HR can view only User profiles
            const users = await userModel.find({ role: 'user' }).select('-password');
            res.status(200).json({
                message: 'User details fetched successfully for HR',
                users: users.map((user) => ({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                })),
            });
        } else if (decoded.role === 'user') {
            // User can only view their own profile
            const user = await userModel.findOne({ name: decoded.name }).select('-password');
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({
                message: 'User details fetched successfully',
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};






