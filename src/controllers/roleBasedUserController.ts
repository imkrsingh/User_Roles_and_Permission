import { Request, Response } from 'express';
import { userModel } from '../models/userSchema';
import { handleTokenVerification } from '../helper/jwt';

// Get api for user, admin, and hr
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

// Get api for superadmin
// Get api for admin
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

// Get api for admin
export const getAdminDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['admin']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
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

// Get api for Hr
export const getHrDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token is required' });
            return;
        }

        const { decoded, error } = handleTokenVerification(token, ['hr']);
        if (error) {
            res.status(decoded ? 403 : 401).json({ message: error });
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
////// PATCH //////
//////////////////
// Update user details (for user, admin, hr, superadmin)
// Patch API for updating user details (for user, admin, hr, superadmin)

