import express from "express";
// import { getgroups } from "../services/groupService";
import {addgroup, groupWithAll,deleteOnegroup,getOnegroup,updateOnegroup } from "../controllers/groupController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id",protect, deleteOnegroup);
router.post("/add/",protect,addgroup);
router.get("/", protect,groupWithAll);
router.get("/one/:id",protect, getOnegroup);
router.put("/:id",protect,updateOnegroup);

export default router;