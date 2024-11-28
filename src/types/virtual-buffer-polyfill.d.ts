declare module 'virtual:buffer-polyfill' {
  const content: any;
  export default content;
}

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
