const Medicine = require('../models/Medicine');
const User = require('../models/User');

exports.createMedicine = async (req, res) => {
  try {
    const { name, email, phone, medicineName, medicineMg, saltName, quantity, expiryDate, packagingType, hostel, roomNumber, instructions } = req.body;
    const medicine = new Medicine({
      name,
      email,
      phone,
      medicineName,
      medicineMg,
      saltName,
      quantity,
      expiryDate,
      packagingType,
      hostel,
      roomNumber,
      instructions
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};





// Also update the clearUserMedicines function while we're at it
exports.clearUserMedicines = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('Attempting to clear medicines for email:', email);

    const result = await Medicine.deleteMany({ email });
    
    console.log('Clear medicines result:', result);

    res.json({ 
      message: 'All medicines cleared successfully',
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Error in clearUserMedicines:', err);
    res.status(500).json({ 
      message: 'Error clearing medicines',
      error: err.message 
    });
  }
};



// Backend: controllers/medicineController.js
// Add these new functions to your existing medicineController.js

exports.getHostelMedicines = async (req, res) => {
  try {
    const { hostel } = req.query;
    
    if (!hostel) {
      return res.status(400).json({ message: 'Hostel name is required' });
    }

    console.log('Fetching medicines for hostel:', hostel);

    // Find all medicines in the specified hostel
    // Sort by expiry date to show nearest expiring medicines first
    const medicines = await Medicine.find({ hostel })
      .sort({ expiryDate: 1 });

    // Filter out expired medicines
    const currentDate = new Date();
    const validMedicines = medicines.filter(medicine => 
      new Date(medicine.expiryDate) > currentDate
    );

    console.log(`Found ${validMedicines.length} valid medicines in hostel ${hostel}`);
    
    res.json(validMedicines);
  } catch (error) {
    console.error('Error fetching hostel medicines:', error);
    res.status(500).json({ 
      message: 'Failed to fetch medicines',
      error: error.message 
    });
  }
};

// If you don't already have a delete function, add this:
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Medicine ID is required' });
    }

    console.log('Attempting to delete medicine with ID:', id);

    const medicine = await Medicine.findByIdAndDelete(id);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    console.log('Successfully deleted medicine:', medicine);
    
    res.json({ 
      message: 'Medicine deleted successfully',
      medicine: {
        medicineName: medicine.medicineName,
        hostel: medicine.hostel
      }
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ 
      message: 'Error deleting medicine',
      error: error.message 
    });
  }
};

  //autofill form
  exports.getUserDetails = async (req, res) => {
    try {
      // Get email from request - this will be sent from frontend
      const { email } = req.query;
      
      const user = await User.findOne({ email }).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return user details needed for the medicine form
      const userDetails = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        hostel: user.hostel,
        roomNumber: user.roomno
      };
  
      res.json(userDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };


  exports.getUserMedicines = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const medicines = await Medicine.find({ email });
      res.json(medicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({ message: 'Failed to fetch medicines' });
    }
  }


// medicineController.js
exports.searchMedicines = async (req, res) => {
  try {
      const { hostel, medicineName, saltName } = req.query;
      
      // Build search query
      const searchQuery = {};
      
      // Add search criteria with case-insensitive search
      if (hostel?.trim()) {
          searchQuery.hostel = { $regex: new RegExp(hostel.trim(), 'i') };
      }
      
      if (medicineName?.trim()) {
          searchQuery.medicineName = { $regex: new RegExp(medicineName.trim(), 'i') };
      }
      
      if (saltName?.trim()) {
          searchQuery.saltName = { $regex: new RegExp(saltName.trim(), 'i') };
      }
      
      // Add filter for non-expired medicines
      searchQuery.expiryDate = { $gt: new Date() };
      
      console.log('Search Query:', searchQuery); // For debugging
      
      // Execute search
      const medicines = await Medicine.find(searchQuery)
          .select('name email phone medicineName medicineMg saltName quantity expiryDate hostel roomNumber')
          .sort({ expiryDate: 1 });
          
      console.log('Found medicines:', medicines.length); // For debugging
      
      res.json(medicines);
      
  } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ 
          message: 'Error searching medicines',
          error: err.message 
      });
  }
};
  