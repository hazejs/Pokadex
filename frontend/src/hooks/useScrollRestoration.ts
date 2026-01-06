import { useEffect } from 'react';

export const useScrollRestoration = (initialLoading: boolean) => {
  useEffect(() => {
    const handleScroll = () => {
      if (!window.requestAnimationFrame) {
        sessionStorage.setItem('scrollPos', window.scrollY.toString());
      } else {
        window.requestAnimationFrame(() => {
          sessionStorage.setItem('scrollPos', window.scrollY.toString());
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position
  useEffect(() => {
    if (!initialLoading) {
      const savedPos = sessionStorage.getItem('scrollPos');
      if (savedPos) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPos), behavior: 'smooth' });
        }, 100);
      }
    }
  }, [initialLoading]);
};
