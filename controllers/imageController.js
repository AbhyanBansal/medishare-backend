const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const image = req.files.image;
        const fileExtension = path.extname(image.name);
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid file type' });
        }

        // Create unique filename
        const fileName = `${uuidv4()}${fileExtension}`;
        const uploadDir = path.join(__dirname, '..', 'public', 'images');
        
        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        console.log('Saving file to:', filePath); // Debug log

        // Move the file to uploads directory
        await image.mv(filePath);

        // The URL path that will be stored and used
        const imageUrl = `/images/${fileName}`;

        // Update user's photo field in database if email is provided
        const userEmail = req.body.email;
        if (userEmail) {
            await User.findOneAndUpdate(
                { email: userEmail },
                { photo: imageUrl }
            );
        }

        // Return the URL where the image can be accessed
        res.json({ 
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image' });
    }
};