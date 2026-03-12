export {};
declare global {
  interface NetworkInformation extends EventTarget {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    addEventListener(type: 'change', listener: () => void): void;
    removeEventListener(type: 'change', listener: () => void): void;
  }
  interface Navigator {
    connection?: NetworkInformation;
  }
}