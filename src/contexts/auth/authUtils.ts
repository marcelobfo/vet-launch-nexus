
// Generate a random company code
export const generateCompanyCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const length = 6;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

// Get session from localStorage
export const getSessionFromLocalStorage = () => {
  try {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
    return null;
  } catch (error) {
    console.error('Error parsing session from localStorage:', error);
    return null;
  }
};

// Set session to localStorage
export const setSessionToLocalStorage = (session: any) => {
  try {
    localStorage.setItem('session', JSON.stringify(session));
  } catch (error) {
    console.error('Error setting session to localStorage:', error);
  }
};

// Clear session from localStorage
export const clearSessionFromLocalStorage = () => {
  try {
    localStorage.removeItem('session');
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
  }
};
