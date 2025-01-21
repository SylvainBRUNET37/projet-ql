/**
 * Valide une adresse e-mail.
 *
 * @param {string} email - L'adresse e-mail à valider.
 * @returns {boolean} - Retourne `true` si l'e-mail est valide, sinon `false`.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe.
 *
 * Le mot de passe doit :
 * - Contenir entre 6 et 20 caractères.
 * - Contenir uniquement des caractères alphanumériques et ces caractères spéciaux : !@#$%^&*()_+=-
 *
 * @param {string} password - Le mot de passe à valider.
 * @returns {boolean} - Retourne `true` si le mot de passe est valide, sinon `false`.
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,20}$/;
  return passwordRegex.test(password);
};

/**
 * Valide un nom.
 *
 * Le nom doit :
 * - Contenir entre 1 et 30 caractères.
 * - Contenir uniquement des caractères alphanumériques.
 *
 * @param {string} name - Le nom à valider.
 * @returns {boolean} - Retourne `true` si le nom est valide, sinon `false`.
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^(?:[a-zA-Z0-9]{1,30})$/;
  return nameRegex.test(name);
};

/**
 * Valide un rôle utilisateur.
 *
 * Le rôle doit être soit 'user', soit 'admin'.
 *
 * @param {string} role - Le rôle à valider.
 * @returns {boolean} - Retourne `true` si le rôle est valide, sinon `false`.
 */
export const validateRole = (role: string): boolean => {
  return role === 'user' || role === 'admin';
};
