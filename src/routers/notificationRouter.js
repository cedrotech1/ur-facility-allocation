import express from "express";
import {
  getAllNotifications,
  getNotificationById,
  removeNotification,
  removeAllNotifications,
  readAllUserNotifications,
  readUserNotification,
  getUnreadUserNotifications,
} from "../controllers/notificationController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/unreaded", protect, getUnreadUserNotifications);
router.get("/", protect, getAllNotifications);
router.get("/:id", protect, getNotificationById);
router.delete("/delete/:id", protect, removeNotification);
router.delete("/deleteAll", protect, removeAllNotifications);
router.put("/markAsRead", protect, readAllUserNotifications);
router.put("/markAsRead/:id", protect, readUserNotification);

export default router;
