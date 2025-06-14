import toast from "react-hot-toast";

// Notification helper functions
export const notify = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  info: (message: string) => {
    toast(message, {
      icon: "ℹ️",
    });
  },
  warning: (message: string) => {
    toast(message, {
      icon: "⚠️",
    });
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  // For longer operations, dismiss the loading toast when complete
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  // For token refresh notifications
  tokenRefreshed: () => {
    toast("Session refreshed successfully", {
      icon: "🔄",
      duration: 3000,
    });
  },
  sessionExpiring: () => {
    toast("Your session will expire soon", {
      icon: "⏱️",
      duration: 10000,
    });
  },
};
