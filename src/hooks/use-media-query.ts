import { useEffect, useState } from 'react';

export function useMediaQuery(minWidth: number): boolean {
  const [state, setState] = useState({
    windowWidth: window.innerWidth,
    isDesiredWidth: false,
  });

  useEffect(() => {
    const resizeHandler = () => {
      const currentWindowWidth = window.innerWidth;
      const isDesiredWidth = currentWindowWidth < minWidth;
      setState({ windowWidth: currentWindowWidth, isDesiredWidth });
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.windowWidth]);

  return state.isDesiredWidth;
}
