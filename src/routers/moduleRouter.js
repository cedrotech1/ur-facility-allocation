import express from "express";
import multer from 'multer';
import {
  processModules,
  getAllModules,
  deleteOneModule,
  updateModule

} from "../controllers/modulesController";

import { protect } from "../middlewares/protect";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/upload-modules',protect, upload.single('file'),express.json(), processModules);
router.get('/',protect, getAllModules);
router.put("/:id", protect, updateModule);
router.delete("/delete/:id", protect, deleteOneModule);




export default router;
