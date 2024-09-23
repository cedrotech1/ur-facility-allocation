import express from "express";
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
  getActivatedFacilities
} from "../controllers/facilitiesController";
import { protect } from "../middlewares/protect";

const router = express.Router();


router.get("/withDefaultGroupsByDean",protect, getFacilitiesWithDefaultGroupsByDean);
router.get("/withDefaultGroups", protect, getFacilitiesWithDefaultGroups);
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
router.put("/:id/unassign", protect, removeOneDefaultGroupFromFacility);
router.put("/:id/unassign/all", protect, removeAllDefaultGroupsFromFacility);



export default router;
