/**
 * Validates an email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns `true` if the email is valid, otherwise `false`.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password.
 *
 * Password must:
 * - Be 6 to 20 characters long.
 * - Contain only alphanumeric characters and these special characters: !@#$%^&*()_+=-
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns `true` if the password is valid, otherwise `false`.
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,20}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a name.
 *
 * Name must:
 * - Be 1 to 30 characters long.
 * - Contain only alphanumeric characters.
 *
 * @param {string} name - The name to validate.
 * @returns {boolean} - Returns `true` if the name is valid, otherwise `false`.
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^(?:[a-zA-Z0-9]{1,30})$/;
  return nameRegex.test(name);
};

/**
 * Validates a user role.
 *
 * Role must be either 'user' or 'admin'.
 *
 * @param {string} role - The role to validate.
 * @returns {boolean} - Returns `true` if the role is valid, otherwise `false`.
 */
export const validateRole = (role: string): boolean => {
  return role === 'user' || role === 'admin';
};
