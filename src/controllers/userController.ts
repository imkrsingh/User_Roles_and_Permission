import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userModel } from '../models/userSchema';
import jwt from 'jsonwebtoken';

// user Register
const userRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    //update
    // Role validation (only allow valid roles)
    if (role && !['user', 'admin', 'hr', 'superadmin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    // Check if the user already exists (by email)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already registered' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with a success message and user details
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// user Login
const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Check if the user exists in the database
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate a JWT token (including user's name and excluding userId)
    const token = jwt.sign(
      { name: existingUser.name, role: existingUser.role },
      process.env.JWT_SECRET || 'SecretKey',
      { expiresIn: '1h' }
    );

    // Respond with a success message and the token
    res.status(200).json({
      message: 'Login successful',
      token,
      // user: {
      //   name: existingUser.name,
      //   email: existingUser.email,
        role: existingUser.role,
      // },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { userRegister, userLogin };
