import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before clearing the message
        setTimeout(onHide, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onHide]);

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-700 dark:bg-[#2A2A2A] text-white rounded-md shadow-lg transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      {message}
    </div>
  );
};
