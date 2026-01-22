// resources/js/utils/cn.js
import clsx from 'clsx';

/**
 * Utility function to merge class names conditionally
 * Uses clsx for intelligent class name handling
 * 
 * @param {...any} inputs - Class names, objects, or arrays
 * @returns {string} Merged class names
 * 
 * @example
 * cn('base-class', { 'conditional': true }, ['array-class'])
 * // Returns: 'base-class conditional array-class'
 */
export function cn(...inputs) {
  return clsx(inputs);
}
