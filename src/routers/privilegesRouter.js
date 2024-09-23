import express from 'express';
import { getAllPrivileges } from '../controllers/privilegesController';
import { protect } from '../middlewares/protect';

const router = express.Router();

router.get('/', protect, getAllPrivileges);

export default router;
