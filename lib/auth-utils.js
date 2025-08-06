// Utility functions for handling authentication and API responses

/**
 * Handles API responses and automatically logs out user on unauthorized errors
 * @param {Response} response - The fetch response object
 * @param {Function} logoutCallback - Function to call when logout is needed
 * @returns {Response} The original response object
 */
export const handleApiResponse = (response, logoutCallback) => {
  if (response.status === 401) {
    // Clear all auth-related data
    localStorage.removeItem('ai-tutor-user');
    localStorage.removeItem('ai-tutor-token');
    localStorage.removeItem('ai-tutor-messages');
    
    // Call the logout callback if provided
    if (logoutCallback && typeof logoutCallback === 'function') {
      logoutCallback();
    }
  }
  
  return response;
};

/**
 * Wrapper for fetch that automatically handles unauthorized responses
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {Function} logoutCallback - Function to call when logout is needed
 * @returns {Promise<Response>} The fetch response
 */
export const authenticatedFetch = async (url, options = {}, logoutCallback) => {
  const response = await fetch(url, options);
  return handleApiResponse(response, logoutCallback);
};

/**
 * Clears all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('ai-tutor-user');
  localStorage.removeItem('ai-tutor-token');
  localStorage.removeItem('ai-tutor-messages');
}; 