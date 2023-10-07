"use client"
import { toast } from 'react-toastify';

const toastOptions = {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const showSuccessToast = (message) => {
  toast.success(message, toastOptions);
};

export const showErrorToast = (message) => {
  toast.error(message, toastOptions);
};

export const showInfoToast = (message) => {
  toast.info(message, toastOptions);
};

export const showWarningToast = (message) => {
  toast.warning(message, toastOptions);
};
