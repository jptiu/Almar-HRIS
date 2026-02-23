import { useState, useEffect, useRef } from "react";

/**
 * Debounces a value by delaying updates until the specified delay has passed
 * without new changes. Commonly used to prevent excessive API calls on rapid
 * user input (e.g., search fields).
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @returns {*} The debounced value.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};
