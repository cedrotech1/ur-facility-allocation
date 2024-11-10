import express from "express";
// import { getprograms } from "../services/programService";
import {addprogram, programWithAll,deleteOneprogram,getOneprogram,updateOneprogram,programWithmodules} from "../controllers/programController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.delete("/delete/:id",protect, deleteOneprogram);
router.post("/add/",protect,addprogram);
router.get("/", protect,programWithAll);
router.get("/modules", protect,programWithmodules);
router.get("/one/:id",protect, getOneprogram);
router.put("/:id",protect,updateOneprogram);

export default router;