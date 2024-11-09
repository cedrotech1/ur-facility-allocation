import express from "express";
import multer from 'multer';
import {
  getAllFacilities,
  getOneFacilityById,
  createFacility,
  updateOneFacility,
  deleteOneFacility,
  addOneMaterial,
  removeOneMaterial,
  assignDefaultGroupsToFacility,
  removeOneDefaultGroupFromFacility,
  removeAllDefaultGroupsFromFacility,
  getFacilitiesWithDefaultGroups,
  getFacilitiesWithDefaultGroupsByDean,
  getDisactivatesFacilities,
  getActivatedFacilities,
  getFacilitiesWithDefaultGroupsForStudent,
  updateDefaultGroups,
  addTimeController,
  deleteTimeController,
  fetchDefaultGroupsWithTimes,
  activate,
  deactivate,
  processFacilities 
} from "../controllers/facilitiesController";

import { protect } from "../middlewares/protect";
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 
router.get('/upload-facilities',protect, upload.single('file'),express.json(), processFacilities);
router.get("/withDefaultGroupsByDean", protect, getFacilitiesWithDefaultGroupsByDean);
router.get("/withDefaultGroups", protect, getFacilitiesWithDefaultGroups);
router.get("/withDefaultGroupsForStudent", getFacilitiesWithDefaultGroupsForStudent);
router.get("/", protect, getAllFacilities);
router.get("/one/:id", protect, getOneFacilityById);
router.get("/disactivated", protect, getDisactivatesFacilities);
router.get("/activated", protect, getActivatedFacilities);
router.post("/add", protect, createFacility);
router.put("/edit/:id", protect, updateOneFacility);
router.delete("/delete/:id", protect, deleteOneFacility);
router.post("/:id/facility", protect, addOneMaterial);
router.delete("/:id/facility", protect, removeOneMaterial);
router.put("/:id/assign", protect, assignDefaultGroupsToFacility);
router.put("/default-groups/:id/time", protect, addTimeController);
router.delete("/delete/times/:id", protect, deleteTimeController);
router.put("/:id/defaultgroup/addgroup", protect, updateDefaultGroups);
router.put("/:id/unassign", protect, removeOneDefaultGroupFromFacility);
router.put("/:id/unassign/all", protect, removeAllDefaultGroupsFromFacility);
router.get("/timetable", protect, fetchDefaultGroupsWithTimes);
router.put("/defaultGroups/activate/:id", protect, activate);
router.put("/defaultGroups/deactivate/:id", protect, deactivate);

export default router;
