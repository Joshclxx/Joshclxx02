// //validator generator
// export const validator =
//   <T>(...validators: Array<(value: T) => boolean>) =>
//   (value: T) => {
//     return validators.every((fn) => fn(value));
//   };

//specific
export function isValidEmail(str: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// export const isValidPassword = (password: string): boolean => {
//     const hasUpper = /[A-Z]/.test(password);
//     const hasLower = /[a-z]/.test(password);
//     const hasNumber = /\d/.test(password);
//     const hasSpecial = /[^A-Za-z0-9]/.test(password);
//     return password.length >= 8 && password.length <= 64 &&
//             hasUpper && hasLower && hasNumber && hasSpecial;
// };

// export const isPhNum = (num: string): boolean => /^(?:09|\+639)\d{9}$/.test(num);
// export const isFullName = (str: string): boolean => /^[\p{L}\p{M}\s'.-]{6,100}$/u.test(str);
