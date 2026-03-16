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

    // 3. Track notified tasks in localStorage
    const savedNotified = JSON.parse(localStorage.getItem('notifiedTasks') || '{}');
    let updatedNotified = { ...savedNotified };
    let hasChanges = false;

    const now = new Date();

    tasks.forEach((task) => {
      if (task.completed) return;

      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const oneHourInMs = 60 * 60 * 1000;

      // Logic for "Due Today" (if not already notified)
      const isDueToday = dueDate.toDateString() === now.toDateString();
      const todayKey = `today_${task.id}`;

      if (isDueToday && !updatedNotified[todayKey]) {
        if (Notification.permission === "granted") {
          new Notification("Task Due Today!", {
            body: `Don't forget: ${task.title}`,
            icon: "/pwa-192x192.png",
          });
          updatedNotified[todayKey] = true;
          hasChanges = true;
        }
      }

      // Logic for "Due in 1 hour" (if time is within 1 hour and not already notified)
      const hourKey = `hour_${task.id}`;
      if (timeDiff > 0 && timeDiff <= oneHourInMs && !updatedNotified[hourKey]) {
        if (Notification.permission === "granted") {
          new Notification("Task Deadline Alert!", {
            body: `⚠ Task "${task.title}" due in 1 hour`,
            icon: "/pwa-192x192.png",
          });
          updatedNotified[hourKey] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      localStorage.setItem('notifiedTasks', JSON.stringify(updatedNotified));
    }
  }, [tasks]); // Rerun when tasks change

  // This component does not render anything
  return null;
}

export default NotificationManager;
