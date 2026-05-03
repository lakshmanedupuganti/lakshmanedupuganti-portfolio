type ObserveCallback = (isVisible: boolean) => void;
type Observer = {
  id: string;
  observer: IntersectionObserver;
  elements: Map<Element, ObserveCallback>;
};

interface UseIntersectionObserverInit {
  rootMargin?: string;
}

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

export function observe(
  element: Element,
  callback: ObserveCallback,
  options: UseIntersectionObserverInit
): () => void {
  if (!hasIntersectionObserver) {
    return () => {};
  }
  const { id, observer, elements } = createObserver(options);
  elements.set(element, callback);

  observer.observe(element);
  return function unobserve(): void {
    elements.delete(element);
    observer.unobserve(element);

    // Destroy observer when there's nothing left to watch:
    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };
}

const observers = new Map<string, Observer>();
function createObserver(options: UseIntersectionObserverInit): Observer {
  const id = options.rootMargin || '';
  let instance = observers.get(id);
  if (instance) {
    return instance;
  }

  const elements = new Map<Element, ObserveCallback>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const callback = elements.get(entry.target);
      const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
      if (callback) {
        callback(isVisible);
      }
    });
  }, options);

  observers.set(
    id,
    (instance = {
      id,
      observer,
      elements,
    })
  );
  return instance;
}
