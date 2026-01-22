// resources/js/hooks/useGreeting.js
import { useEffect } from 'react';
import useUIStore from '../stores/uiStore';

export const useGreeting = () => {
  const greeting = useUIStore((state) => state.greeting);
  const updateGreeting = useUIStore((state) => state.updateGreeting);

  useEffect(() => {
    updateGreeting();

    const interval = setInterval(() => {
      updateGreeting();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateGreeting]);

  return greeting;
};
