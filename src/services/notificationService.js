import db from "../database/models/index.js";
const Notification = db["Notifications"];

export const addNotification = async (
  receiver_id,
  text,
  type,
  booking_id,
  facility_id
) => {
  try {
    const newNotification = await Notification.create({
      receiver_id,
      text,
      type,
      booking_id,
      facility_id,
    });
    return newNotification;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getNotifications = async (receiver_id) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        receiver_id,
      },
    });
    return notifications;
  } catch (error) {
    return null;
  }
};

export const getNotification = async (id) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id,
      },
    });
    return notification;
  } catch (error) {
    return null;
  }
};

export const updateNotification = async (id, data) => {
  try {
    const notification = await Notification.update(data, {
      where: {
        id,
      },
    });
    return notification;
  } catch (error) {
    return null;
  }
};

export const deleteNotification = async (id) => {
  try {
    const notification = await Notification.destroy({
      where: {
        id,
      },
    });
    return notification;
  } catch (error) {
    return null;
  }
};

export const deleteAllNotifications = async (receiver_id) => {
  try {
    const notification = await Notification.destroy({
      where: {
        receiver_id,
      },
    });
    return notification;
  } catch (error) {
    return null;
  }
};

export const getUnreadNotifications = async (receiver_id) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        receiver_id,
        isRead: false,
      },
    });
    return notifications;
  } catch (error) {
    return null;
  }
};

export const readAllNotifications = async (receiver_id) => {
  try {
    const notifications = await Notification.update(
      { isRead: true },
      {
        where: {
          receiver_id,
        },
      }
    );
    return notifications;
  } catch (error) {
    return null;
  }
};

export const readNotification = async (id) => {
  try {
    const notification = await Notification.update(
      { isRead: true },
      {
        where: {
          id,
        },
      }
    );
    return notification;
  } catch (error) {
    return null;
  }
};
