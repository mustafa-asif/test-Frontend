import { useSnackbar } from "notistack";

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();
  return function (message, variant, options = {}) {
    if (typeof message !== "string") {
      console.log(message);
      message = "Error";
    }
    return enqueueSnackbar(message, { variant, ...options });
  };
};
