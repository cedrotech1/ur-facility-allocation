import express from "express";
import {
  addCampusController,
  getAllCampusesController,
  deleteOneCampusController,
  getOneCampusController,
  updateOneCampusController,
  campusWithAllController,
  campusWithAllControllerForSTUDENT
} from "../controllers/campusController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id", protect, deleteOneCampusController);
router.post("/add/", protect, addCampusController);
router.get("/", protect, getAllCampusesController);
router.get("/all", protect, campusWithAllController);
router.get("/student", campusWithAllControllerForSTUDENT);
router.get("/one/:id", protect, getOneCampusController);
router.put("/:id", protect, updateOneCampusController);

export default router;
