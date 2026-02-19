import "@testing-library/jest-dom";
import { MessageChannel } from "worker_threads";

// Polyfills required by Ant Design in jsdom

// MessageChannel — used by @rc-component/form's useNotifyWatch
global.MessageChannel = MessageChannel as unknown as typeof globalThis.MessageChannel;

// matchMedia — used by Antd's responsive observer
// Use a plain function (not jest.fn) so jest.resetAllMocks() won't clear it
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ResizeObserver — used by Antd Table
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// getComputedStyle — ensure it returns defaults for Antd CSS properties
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
  const styles = originalGetComputedStyle(elt, pseudoElt);
  return new Proxy(styles, {
    get(target, prop) {
      if (prop === "getPropertyValue") {
        return (p: string) => target.getPropertyValue(p) || "";
      }
      return Reflect.get(target, prop);
    },
  });
};
