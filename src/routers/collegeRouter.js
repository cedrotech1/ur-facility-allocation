import express from "express";
// import { getColleges } from "../services/collegeService";
import {addCollege, CollegeWithAll,deleteOneCollege,getOneCollege,updateOneCollege } from "../controllers/collegeController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id", protect, deleteOneCollege);
router.post("/add/",protect, addCollege);
router.get("/",protect,  CollegeWithAll);
router.get("/one/:id", protect, getOneCollege);
router.put("/:id", protect, updateOneCollege);

export default router;