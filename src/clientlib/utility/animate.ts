"use client";
export interface animateOptions {
  from: number;
  to: number;
  duration?: number;
  easeFunc?: (input: number) => number;
  update: (current: number, duration: number) => void;
  complete: () => void;
}

const animate = (opts: animateOptions) => {
  const {
    from,
    to,
    duration = 300,
    easeFunc = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    update,
    complete,
  } = opts;

  const range = to - from;
  const startTime = performance.now();

  const loop = () => {
    const elapsed = performance.now() - startTime || 0.01;
    if (elapsed >= duration) {
      complete();
      return;
    }

    const currentValue = from + easeFunc(elapsed / duration) * range;
    update(currentValue, elapsed);

    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
};

export default animate;
