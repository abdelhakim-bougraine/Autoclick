import { useState, useEffect, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const NOTIFICATION_EVENT = "autoclick-notification";

// eslint-disable-next-line react-refresh/only-export-components
export function showNotification(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, { detail: { message, type } })
  );
}

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [...prev, { id, ...e.detail }]);
      setTimeout(() => removeNotification(id), 4000);
    };

    window.addEventListener(NOTIFICATION_EVENT, handler);
    return () => window.removeEventListener(NOTIFICATION_EVENT, handler);
  }, [removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-slide-in ${
            n.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : n.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span className="mt-0.5">
            {n.type === "success" ? (
              <FaCheckCircle className="text-green-500 text-lg" />
            ) : (
              <FaExclamationCircle className="text-red-500 text-lg" />
            )}
          </span>
          <p className="flex-1 font-semibold text-sm">{n.message}</p>
          <button
            type="button"
            onClick={() => removeNotification(n.id)}
            className="text-current opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
