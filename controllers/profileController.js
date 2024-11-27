// // profileController.js
// const User = require('../models/User');

// exports.getProfile = async (req, res) => {
//   try {
//     const userEmail = req.params.email;
//     const user = await User.findOne({ email: userEmail });
//     console.log(user); 
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     res.json({
        
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       phone: user.phone || '',
//       dob: user.dob || '',
//       gender: user.gender || '',
//       hostel: user.hostel,
//       roomno: user.roomno,
//       photo: user.photo || '',
//       availableFrom: user.availableFrom || '',
//       availableTo: user.availableTo || ''
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching profile' });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const userEmail = req.params.email;
//     const updateData = req.body;
    
//     const user = await User.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update only the fields that are provided
//     Object.keys(updateData).forEach(key => {
//       if (updateData[key] !== undefined) {
//         user[key] = updateData[key];
//       }
//     });

//     await user.save();
//     res.json({ message: 'Profile updated successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating profile' });
//   }
// };



// profileController.js
const User = require('../models/User');
const path = require('path');
const fs = require('fs');


exports.getProfile = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Combine firstName and lastName for the response
        res.json({
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            phone: user.phone || '',
            dob: user.dob || '',
            gender: user.gender || '',
            hostel: user.hostel || '',
            roomno: user.roomno || '',
            photo: user.photo || '',
            availableFrom: user.availableFrom || '',
            availableTo: user.availableTo || ''
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const updateData = req.body;
        
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Split the full name into firstName and lastName if provided
        if (updateData.name) {
            const nameParts = updateData.name.trim().split(/\s+/);
            user.firstName = nameParts[0] || '';
            user.lastName = nameParts.slice(1).join(' ') || '';
            delete updateData.name;  // Remove name from updateData since we handled it
        }

        // Update other fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                user[key] = updateData[key];
            }
        });

        await user.save();
        res.json({ 
            message: 'Profile updated successfully',
            user: {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
                hostel: user.hostel,
                roomno: user.roomno,
                photo: user.photo,
                availableFrom: user.availableFrom,
                availableTo: user.availableTo
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};




// controllers/profileController.js

//const User = require('../models/User');

const profileController = {
    getProfile: async (req, res) => {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email is required' 
                });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            // Return profile data with exact matching field names from frontend
            const profileData = {
                success: true,
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    hostel: user.hostel,
                    roomNumber: user.roomno,  // renamed from roomno to match frontend
                    phoneNumber: user.phone,  // renamed from phone to match frontend
                    gender: user.gender,
                    dateOfBirth: user.dob,  // renamed from dob to match frontend
                    availableFrom: user.availableFrom,
                    availableUntil: user.availableTo,  // renamed from availableTo to match frontend
                    profileImage: user.photo  // renamed from photo to match frontend
                }
            };

            res.status(200).json(profileData);
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { email, ...updateData } = req.body;
            
            if (!email) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email is required' 
                });
            }

            // Map frontend field names to database field names
            const mappedUpdateData = {
                ...updateData,
                roomno: updateData.roomNumber,
                phone: updateData.phoneNumber,
                dob: updateData.dateOfBirth,
                availableTo: updateData.availableUntil,
                photo: updateData.profileImage
            };

            // Remove frontend-specific field names
            delete mappedUpdateData.roomNumber;
            delete mappedUpdateData.phoneNumber;
            delete mappedUpdateData.dateOfBirth;
            delete mappedUpdateData.availableUntil;
            delete mappedUpdateData.profileImage;

            const user = await User.findOneAndUpdate(
                { email }, 
                { $set: mappedUpdateData },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }
};

module.exports = profileController;