/**
 * Returns a user-friendly error message from API or JS errors.
 *
 * @param {Object} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong.";
  }

  // Backend error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Validation errors (optional)
  if (Array.isArray(error.response?.data?.errors)) {
    return error.response.data.errors.map((err) => err.message).join(", ");
  }

  // Axios error message
  if (error.message) {
    return error.message;
  }

  return "Something went wrong.";
};
