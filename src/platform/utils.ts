export const flush = (fn: FrameRequestCallback) => {
  requestAnimationFrame(fn);
};

export const customFlush = (fn: FrameRequestCallback) => {
  setTimeout(fn, 1000 / 60);
};
