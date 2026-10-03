import { toast } from "react-toastify";
import { getErrorMessage } from "./errorHandler";

export const apiHandler = async ({
  apiCall,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  showSuccessToast = true,
  showErrorToast = true,
}) => {
  try {
    const response = await apiCall();

    if (showSuccessToast) {
      toast.success(successMessage || response.message);
    }

    if (onSuccess) {
      onSuccess(response);
    }

    return response;
  } catch (error) {
    if (showErrorToast) {
      toast.error(getErrorMessage(error, errorMessage));
    }

    if (onError) {
      onError(error);
    }

    return null;
  }
};
