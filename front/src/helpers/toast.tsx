import { toast } from 'react-toastify';

toast.configure()

const CONFIG_TOAST = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

export function successToast(message: string) : void {
  if (typeof message === "string")
    toast.success(message, CONFIG_TOAST);
}

export function warningToast(message: string) : void {
  if (typeof message === "string")
    toast.warning(message, CONFIG_TOAST);
}

export function errorToast(message: string) : void {
  if (typeof message === "string")
    toast.error(message, CONFIG_TOAST);
}

export default { success: successToast, warning: warningToast, error: errorToast };
