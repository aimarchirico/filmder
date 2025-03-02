import '@testing-library/jest-dom';

// This solves the "not configured to support act(...)" warnings
// by setting up fake timers
jest.useFakeTimers();

// Silence React act() warnings
// This is sometimes needed when working with components that have 
// multiple async state updates
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError(...args);
};