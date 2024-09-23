import express from "express";
// import { getdepartments } from "../services/departmentService";
import {adddepartment, departmentWithAll,deleteOnedepartment,getOnedepartment,updateOnedepartment } from "../controllers/departmentController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id", protect,deleteOnedepartment);
router.post("/add/",protect,adddepartment);
router.get("/", protect,departmentWithAll);
router.get("/one/:id",protect, getOnedepartment);
router.put("/:id",protect,updateOnedepartment);

export default router;