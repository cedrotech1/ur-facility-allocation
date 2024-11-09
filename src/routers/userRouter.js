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
  processAddUsers,
  getAllLect
} from '../controllers/userController';
import { protect } from '../middlewares/protect';
import multer from 'multer';
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/upload-lectures',protect, upload.single('file'),express.json(),processAddUsers);
router.get('/class-rep', protect, getClassRepresentatives);
router.get('/lectures', protect, getAllLect);
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
