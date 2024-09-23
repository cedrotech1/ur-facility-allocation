import express from 'express';
import {
  addUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  activateOneUser,
  deactivateOneUser,
  updateUserPrivileges,
  changePassword,
  getClassRepresentatives,
} from '../controllers/userController';
import { protect } from '../middlewares/protect';

const router = express.Router();

router.get('/class-rep', protect, getClassRepresentatives);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getOneUser);
router.post('/addUser', protect, addUser);
router.put('/update/:id', protect, updateOneUser);
router.delete('/delete/:id', protect, deleteOneUser);
router.put('/activate/:id', protect, activateOneUser);
router.put('/deactivate/:id', protect, deactivateOneUser);
router.patch('/updateUserPrivileges/:id', protect, updateUserPrivileges);
router.put('/changePassword', protect, changePassword);

export default router;
