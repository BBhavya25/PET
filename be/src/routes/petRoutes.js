import express from 'express';
import { 
  getAllPets, 
  addPet, 
  updatePet, 
  deletePet 
} from '../controllers/petController.js';

const router = express.Router();

// Pet routes
router.get('/', getAllPets);
router.post('/', addPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

export default router;