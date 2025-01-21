import Profile from '../models/Profile.js';

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({ userId });
        
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, department, email } = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                name,
                phone,
                department,
                email,
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
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};