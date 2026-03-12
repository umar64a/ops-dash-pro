import { useState, useEffect, useRef } from 'react';
export function useScrollFade(scrollThreshold = 150, fadeDelay = 1000) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > scrollThreshold) setScrolled(true);
      else setScrolled(false);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);
  const onMouseEnter = () => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    setHovered(true);
  };
  const onMouseLeave = () => {
    fadeTimeoutRef.current = setTimeout(() => {
      setHovered(false);
    }, fadeDelay);
  };
  // condition to apply fade class
  const shouldFade = scrolled && !hovered;
  return { shouldFade, onMouseEnter, onMouseLeave, scrolled, };
}
