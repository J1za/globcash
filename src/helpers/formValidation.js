export const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined); // for React Final Form

export const required = (value) => (value || typeof value === 'number' ? undefined : 'Required');

export const email = (value) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(value) ? 'Invalid email' : undefined;

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;

export const minLength8 = minLength(8);

export const number = (value) => (value && isNaN(Number(value)) ? 'Must be a number' : undefined);

export const minValue = (min) => (value) => value && value < min ? `Must be at least ${min}` : undefined;

export const passwordMatch = (value, allValues) => (value !== allValues.password ? "Passwords don't match" : undefined);
