const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, hostel, roomno } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      hostel,
      roomno,
    });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = password == user.password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};


// exports.updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const { firstName, lastName, email, phone, dob, gender, hostel, thaparId, photo, availableFrom, availableTo } = req.body;
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.email = email || user.email;
//     user.phone = phone || user.phone;
//     user.dob = dob || user.dob;
//     user.gender = gender || user.gender;
//     user.hostel = hostel || user.hostel;
//     user.thaparId = thaparId || user.thaparId;
//     user.photo = photo || user.photo;
//     user.availableFrom = availableFrom || user.availableFrom;
//     user.availableTo = availableTo || user.availableTo;
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// Add more controller functions for GET, DELETE, etc.




// controllers/userController.js - Add these new functions
exports.getUserDetails = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a formatted response object
    const userDetails = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      hostel: user.hostel,
      roomno: user.roomno,
      availableFrom: user.availableFrom,
      availableTo: user.availableTo,
      photo: user.photo
    };

    res.json(userDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { email } = req.params;
    const {
      firstName,
      lastName,
      phone,
      dob,
      gender,
      hostel,
      roomno,
      availableFrom,
      availableTo,
      photo
    } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.hostel = hostel || user.hostel;
    user.roomno = roomno || user.roomno;
    user.availableFrom = availableFrom || user.availableFrom;
    user.availableTo = availableTo || user.availableTo;
    user.photo = photo || user.photo;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};


exports.uploadImage = async (req, res) => {
  try {
    // Save the image and return the URL
    const imageUrl = await saveImageToServer(req.files.image);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

async function saveImageToServer(image) {
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${image.name}`;
  const filePath = path.join(uploadDir, fileName);

  await image.mv(filePath);
  return `http://localhost:5000/uploads/${fileName}`;
}




exports.getHostelUsers = async (req, res) => {
  try {
    const { hostel } = req.query;
    
    if (!hostel) {
      return res.status(400).json({ message: 'Hostel name is required' });
    }

    console.log('Fetching users for hostel:', hostel);

    // Find all users in the specified hostel
    const users = await User.find({ hostel })
      .select('firstName lastName email phone roomno hostel')
      .sort({ firstName: 1, lastName: 1 });

    console.log(`Found ${users.length} users in hostel ${hostel}`);
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching hostel users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch users',
      error: error.message 
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Attempting to delete user with ID:', id);

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Successfully deleted user:', user);
    
    res.json({ 
      message: 'User deleted successfully',
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        hostel: user.hostel
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Error deleting user',
      error: error.message 
    });
  }
};