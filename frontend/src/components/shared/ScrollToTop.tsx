import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ScrollToTopProps = {
  behavior?: 'instant' | 'smooth';
};

export default function ScrollToTop({ behavior = 'instant' }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior === 'instant' ? 'auto' : 'smooth',
    });
  }, [pathname, behavior]);

  return null;
}
