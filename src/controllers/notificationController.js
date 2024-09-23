import {
  getNotification,
  getUnreadNotifications,
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
  readAllNotifications,
  readNotification,
} from "../services/notificationService.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    if (notifications) {
      return res.status(200).json({notifications});
    }
    return res.status(404).json({ message: "No notifications found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await getNotification(req.params.id);
    if (notification) {
      return res.status(200).json({notification});
    }
    return res.status(404).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeNotification = async (req, res) => {
  try {
    const notification = await deleteNotification(req.params.id);
    if (notification) {
      return res.status(200).json({notification});
    }
    return res.status(404).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAllNotifications = async (req, res) => {
  try {
    const notification = await deleteAllNotifications(req.user.id);
    if (notification) {
      return res.status(200).json({notification});
    }
    return res.status(404).json({ message: "No notifications found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const readAllUserNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    if (notifications) {
      await readAllNotifications(req.user.id);
      return res.status(200).json({ message: "All notifications read" });
    }
    return res.status(404).json({ message: "No notifications found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const readUserNotification = async (req, res) => {
  try {
    const notification = await getNotification(req.params.id);
    if (notification) {
      await readNotification(req.params.id);
      return res.status(200).json({ message: "Notification read" });
    }
    return res.status(404).json({ message: "Notification not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUnreadUserNotifications = async (req, res) => {
  try {
    const notifications = await getUnreadNotifications(req.user.id);
    if (notifications) {
      return res.status(200).json({notifications});
    }
    return res.status(404).json({ message: "No unread notifications found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
