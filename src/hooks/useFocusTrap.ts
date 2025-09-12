import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

export const useFocusTrap = (ref: React.RefObject<HTMLElement>, isOpen: boolean) => {
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen && ref.current) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            const focusableElements = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
            
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key !== 'Tab') return;

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            };

            // Focus the first element when the modal opens
            firstElement.focus();

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                // Restore focus to the element that opened the modal
                previousActiveElement.current?.focus();
            };
        }
    }, [isOpen, ref]);
};
