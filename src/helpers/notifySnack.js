import {toast} from 'react-toastify';

export const notifyError = (errorSnackText) =>
  toast.error(errorSnackText, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });

export const notifySuccess = (successSnackText) =>
  toast.success(successSnackText, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
