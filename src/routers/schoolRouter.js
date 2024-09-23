import express from "express";
// import { getschools } from "../services/schoolService";
import {addschool, getAllschools,deleteOneschool,getOneschool,updateOneschool } from "../controllers/schoolController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id",protect, deleteOneschool);
router.post("/",protect, addschool);
router.get("/all/",protect, getAllschools);
router.get("/:id",protect,  getOneschool);
router.put("/edit/:id",protect, updateOneschool);

export default router;