import { useEffect, useState } from "react";
import api from "../../data/api";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note) => (
            <li
              key={note.id}
              className={`p-4 rounded shadow ${
                note.isRead ? "bg-gray-100" : "bg-white border-l-4 border-blue-500"
              }`}
            >
              <p className="text-gray-800">{note.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
