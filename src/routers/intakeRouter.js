import express from "express";
import {
  addIntake,
  getIntakes,
  getOneIntake,
  updateIntake,
  deleteIntake,
  getIntakesByProgram,
  getIntakesByProgramYear,
} from "../controllers/intakeController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.post("/", protect, addIntake);
router.get("/", protect, getIntakes);
router.put("/:id", protect, updateIntake);
router.delete("/:id", protect, deleteIntake);
router.get("/:id", protect, getOneIntake);
router.get("/program/:id", protect, getIntakesByProgram);
router.get("/:year/program/:id", protect, getIntakesByProgramYear);

export default router;
