export function passwordValidator(v: string): boolean {
  const minLength = v.length >= 8;
  const hasUpper = /[A-Z]/.test(v);
  const hasLower = /[a-z]/.test(v);
  const hasDigit = /\d/.test(v);
  const hasSymbol = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(v);
  const noTripleRepeat = !/(.)\1\1/.test(v); // no 3 repeated chars

  return (
    minLength && hasUpper && hasLower && hasDigit && hasSymbol && noTripleRepeat
  );
}

export const passwordValidatorMessage =
  "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, one special character, and not have three consecutive identical characters.";
