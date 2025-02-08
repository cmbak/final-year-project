import { useEffect, useRef, useState } from "react";

// Based on https://blog.sachinchaurasiya.dev/simple-guide-to-using-intersection-observer-api-with-reactjs

type IntersectionObserverOptions = {
  // Based on MDN docs
  root?: null | HTMLElement;
  rootMargin?: string;
  threshold: number[] | number;
};

export default function useIntersection<T extends Element>(
  options: IntersectionObserverOptions,
) {
  const [isVisible, setIsVisible] = useState(false);
  // const elementRef = useRef<T extends Element>(null)
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      const [entry] = entries; // Only observing one element
      setIsVisible(entry.isIntersecting);
    }, options);

    if (elementRef.current !== null) observer.observe(elementRef.current);
  }, []);

  return { elementRef, isVisible };
}
