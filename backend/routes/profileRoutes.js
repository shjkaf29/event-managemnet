import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// MongoDB Profile Schema
const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    department: String,
    profilePicture: String,
    updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

// Configure multer for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profiles';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get profile
router.get('/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }
        res.json({ success: true, profile });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Update profile
router.post('/update', async (req, res) => {
    try {
        const { userId, name, email, phone, department } = req.body;

        if (!userId || !name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                name,
                email,
                phone,
                department,
                updatedAt: new Date()
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

router.post('/upload-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file || !req.body.userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing file or userId'
            });
        }

        const filename = req.file.filename;
        const imagePath = `/uploads/profiles/${filename}`;
        
        await Profile.findOneAndUpdate(
            { userId: req.body.userId },
            { 
                profilePicture: imagePath,
                updatedAt: new Date()
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            filename,
            imageUrl: imagePath,
            message: 'Profile picture updated successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading profile picture'
        });
    }
});

// Delete profile picture
router.delete('/picture/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.params.userId });
        
        if (!profile || !profile.profilePicture) {
            return res.status(404).json({
                success: false,
                message: 'Profile or picture not found'
            });
        }

        const picturePath = path.join('.', profile.profilePicture);
        if (fs.existsSync(picturePath)) {
            fs.unlinkSync(picturePath);
        }

        profile.profilePicture = null;
        await profile.save();

        res.json({
            success: true,
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        console.error('Profile picture delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting profile picture'
        });
    }
});

export default router;