import Pet from '../models/Pet.js';

// Get all pets for a specific user
export const getAllPets = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }
    
    const pets = await Pet.find({ owner: ownerId });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a new pet
export const addPet = async (req, res) => {
  try {
    const { name, species, breed, age, owner } = req.body;
    
    if (!name || !species || !owner) {
      return res.status(400).json({ message: 'Name, species, and owner are required' });
    }
    
    const pet = new Pet({ name, species, breed, age, owner });
    await pet.save();
    
    res.status(201).json({ 
      message: 'Pet added successfully',
      pet
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update pet details
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, breed, age } = req.body;
    
    const pet = await Pet.findByIdAndUpdate(
      id,
      { name, species, breed, age },
      { new: true, runValidators: true }
    );
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json({ 
      message: 'Pet updated successfully',
      pet
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a pet
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};