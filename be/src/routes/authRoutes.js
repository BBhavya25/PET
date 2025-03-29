import express from 'express';
import { 
  signup, 
  login, 
  changePassword, 
  logout 
} from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', changePassword);
router.post('/logout', logout);

export default router;