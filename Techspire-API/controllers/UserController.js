import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Helper function to generate the formatted token
const generateBearerToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'techspire_secret',
    { expiresIn: '24h' }
  );
  return `Bearer ${token}`;
};

// REGISTER - Now logs the user in automatically
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ fullName, email, password, phoneNumber });
    await user.save();

    // Generate token immediately after saving
    const token = generateBearerToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token, // Automatically logged in
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateBearerToken(user);

    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};