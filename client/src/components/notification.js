import React from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const Notification = ({ message, type }) => {
  // Trigger the notification
  const showNotification = () => {
    if (type === "success") {
      NotificationManager.success(message, "Success", 3000);
    } else if (type === "info") {
      NotificationManager.info(message, "Information", 3000);
    } else if (type === "warning") {
      NotificationManager.warning(message, "Warning", 3000);
    } else if (type === "error") {
      NotificationManager.error(message, "Error", 3000);
    }
  };

  // Automatically show the notification when the component mounts
  React.useEffect(() => {
    if (message) {
      showNotification();
      NotificationManager.listNotify = [];
    }
  }, [message, type]);

  return <NotificationContainer />;
};

export default Notification;
