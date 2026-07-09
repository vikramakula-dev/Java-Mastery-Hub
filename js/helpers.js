export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const debounce = (fn, delay = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
