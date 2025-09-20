import { useEffect, useState } from "react";

function NotificationManager({ tasks = [] }) {
  // Use state to track which notifications have already been sent this session
  const [sentNotifications, setSentNotifications] = useState(new Set());

  useEffect(() => {
    // 1. Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    // 2. Request permission if not already granted
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 3. Find tasks that are due today and haven't been notified yet
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    const dueTodayTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Normalize task due date

      return (
        dueDate.getTime() === today.getTime() &&
        !task.completed &&
        !sentNotifications.has(task.id)
      );
    });

    // 4. Send notifications for those tasks
    if (Notification.permission === "granted" && dueTodayTasks.length > 0) {
      dueTodayTasks.forEach((task) => {
        new Notification("Task Due Today!", {
          body: task.title,
          icon: "/pwa-192x192.png", // Re-use our PWA icon
          badge: "/pwa-192x192.png",
        });

        // Add the task ID to our set to prevent re-notifying
        setSentNotifications((prev) => new Set(prev).add(task.id));
      });
    }
  }, [tasks, sentNotifications]); // Rerun when tasks change

  // This component does not render anything
  return null;
}

export default NotificationManager;
